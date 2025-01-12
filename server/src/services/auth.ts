import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  // we allow the token to be sent either through the body, the headers authorization or through the query
  let token = req.body.token || req.query.token || req.headers.authorization;

  // if the token is in the authorization header then extract it

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }
  // if the token isnt valid then return the req
  if (!token) {
    return req;
  }

  // verify the token
  const secretKey = process.env.JWT_SECRET_KEY || " ";
  try {
    const { data }: any = jwt.verify(token, secretKey, { maxAge: "2h" });
    req.user = data;
  } catch (err) {
    console.log("Invalid Token");
  }
  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || "";

  return jwt.sign({ data: payload }, secretKey, { expiresIn: "1h" });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ["UNAUTHENTICATED"]);
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}
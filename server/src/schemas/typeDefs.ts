const typeDefs = `
type User {
    _id : ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]

}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
    }

type Auth {
    token: ID!
    user: User!    
}

input UserInput {
    email: String!
    username: String!
    password: String!
    savedBooks: [BookInput]
}

input BookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: ID!
    image: String
    link: String
}

type Query {
    me: User
    }

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(userInput: UserInput!): Auth
    saveBook(bookInput: BookInput!): User
    removeBook(bookId: ID!): User
}
`;

export default typeDefs;
// use this to decode a token and get the user's information out of it
import { jwtDecode, type JwtPayload } from 'jwt-decode';

interface ExtendedJWT extends JwtPayload {
  data: {
    username: string;
    email: string;
    _id: string;
  }
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode<ExtendedJWT>(this.getToken() || '');
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      } 
      
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    const loggedAccount = localStorage.getItem('id_token');
    return loggedAccount;
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
   
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    window.location.reload();
  }
}

export default new AuthService();

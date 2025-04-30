import axios from 'axios';
import RegisterAPI from '../models/Register';

export default function AtuhApi() {
  const API_BASE_URL = 'http://192.168.0.12:3000/auth';

  // Configure axios defaults
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const registerUser = async (user : RegisterAPI) => {

      const responde = await axiosInstance.post('/register', {
        email: user.email,
        password: user.password,
        name: user.name,
        username: user.username,
        isAuthor: user.isAuthor,
      })
      return responde.data;
  };

  return {
    registerUser,
  };
}

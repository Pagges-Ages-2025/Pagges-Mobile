import axios from "axios";
import { User } from "../models/User";
// Se não funcionar mudar de localhost para o ip da máquina
const baseUrl = `http://localhost:3000/profile`;

export default function UserAPI() {
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoiYWxpY2VCQGV4YW1wbGUuY29tIiwiaWQiOjQsImlhdCI6MTc0NDA2MTYxNCwiZXhwIjoxNzQ0MTQ4MDE0fQ.mHCBZAZmX7ZK05XlA4TzvrxjHiCdeR4hQABxp9dW-O0"; // Exemplo com localStorage
  };

  const getProfile = async (email: string): Promise<User> => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${baseUrl}/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  };

  return {
    getProfile,
  };
}

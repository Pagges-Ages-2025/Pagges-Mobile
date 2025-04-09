import axios from "axios";
import { User } from "../models/User";
// Se não funcionar mudar de localhost para o ip da máquina
const baseUrl = `http://localhost:3000/profile`;

export default function UserAPI() {

  const getProfile = async (token: string): Promise<User> => {
    try {
      const response = await axios.get(`${baseUrl}`, {
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

import { User } from "../models/User";
import axiosInstance from "./axios-instance-singleton";
// Se não funcionar mudar de localhost para o ip da máquina
const profileControllerUrl = "profile";

export default function UserAPI() {
  const getProfile = async (token: string): Promise<User> => {
    try {
      const response = await axiosInstance.get(`${profileControllerUrl}`, {
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

  const updateBio = async (token: string, bio: string): Promise<User> => {
    try {
      const response = await axiosInstance.put(
        `${profileControllerUrl}/biography`,
        { biography: bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar bio:", error);
      throw error;
    }
  };

  const updateProfile = async (
    token: string,
    name?: string,
    biography?: string,
    genreIds?: number[]
  ): Promise<User> => {
    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (biography) payload.biography = biography;
      if (genreIds) payload.genreIds = genreIds;

      const response = await axiosInstance.put(
        `${profileControllerUrl}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  return {
    getProfile,
    updateBio,
    updateProfile,
  };
}

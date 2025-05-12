import { User } from "../models/User";
import axiosInstance from "./axios-instance-singleton";
// Se não funcionar mudar de localhost para o ip da máquina
const profileControllerUrl = "profile";

export default function UserAPI() {
  const getProfile = async (): Promise<User> => {
    try {
      const response = await axiosInstance.get(`${profileControllerUrl}`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  };

  const getProfileImage = async (): Promise<string> => {
    try {
      const response = await axiosInstance.get(`/profile-image`);
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar imagem de perfil:", error);
      throw error;
    }
  };

  const getUserStatistics = async (
  ): Promise<{
    readBooks: number;
    readKms: number;
  }> => {
    try {
      const response = await axiosInstance.get(
        `/personal-library/getUserStatistics`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
      throw error;
    }
  };

  const updateBio = async (bio: string): Promise<User> => {
    try {
      const response = await axiosInstance.put(
        `${profileControllerUrl}/biography`,
        { biography: bio },
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar bio:", error);
      throw error;
    }
  };

  const updateProfile = async (
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
        payload
      );

      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  return {
    getProfile,
    getProfileImage,
    getUserStatistics,
    updateBio,
    updateProfile,
  };
}

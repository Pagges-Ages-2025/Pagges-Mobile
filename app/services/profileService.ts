import { User } from "../models/User";
import axiosInstance from "./axios-instance-singleton";
import * as ImagePicker from "expo-image-picker";

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

  const getUserStatistics = async (): Promise<{
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
        { biography: bio }
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

  const updateProfileImage = async (
    image: ImagePicker.ImagePickerAsset
  ): Promise<User> => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: image.fileName || "upload.jpg",
        type: image.mimeType,
      } as any);
      console.log(formData);

      const response = await axiosInstance.put(
        `${profileControllerUrl}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  const getUserProfile = async (userEmail: string): Promise<User> => {
    try {
      const response = await axiosInstance.get(`${profileControllerUrl}/user-profile`, {
        params: { userEmail },
      });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  };

  return {
    getProfile,
    getProfileImage,
    getUserStatistics,
    updateBio,
    updateProfile,
    updateProfileImage,
    getUserProfile,
  };
}

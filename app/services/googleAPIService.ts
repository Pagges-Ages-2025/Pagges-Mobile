import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axios-instance-singleton";

export default function SearchAPI() {
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token === null) {
        throw new Error("Token not found");
      }
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  };

  const searchBooks = async (searchTerm: string) => {
    try {
      const token = await getAuthToken();
      const encodedTerm = encodeURIComponent(searchTerm);
      // Corrigindo a URL para usar o formato que o backend espera
      const response = await axiosInstance.get(
        `google-integration/search/${encodedTerm}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          validateStatus: (status) => status < 500,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        console.error(
          "Erro de conexão com o servidor. Verifique se o servidor está rodando."
        );
        throw new Error(
          "Erro de conexão com o servidor. Verifique se o servidor está rodando."
        );
      }
      console.error("Erro ao buscar livros:", error);
      throw error;
    }
  };

  const searchByGenre = async (genero: string) => {
    try {
      const token = await getAuthToken();
      const encodedGenre = encodeURIComponent(genero);
      // Corrigindo a URL para usar o formato que o backend espera
      const response = await axiosInstance.get(
        `google-integration/genre/${encodedGenre}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          validateStatus: (status) => status < 500,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        console.error(
          "Erro de conexão com o servidor. Verifique se o servidor está rodando."
        );
        throw new Error(
          "Erro de conexão com o servidor. Verifique se o servidor está rodando."
        );
      }
      console.error("Erro ao buscar por gênero:", error);
      throw error;
    }
  };

  return {
    searchBooks,
    searchByGenre,
  };
}

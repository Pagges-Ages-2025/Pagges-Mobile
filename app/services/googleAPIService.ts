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
    const token = await getAuthToken();
    try {
      const encodedTerm = encodeURIComponent(searchTerm);
      const response = await axiosInstance.get(`google-integration/search`, {
        params: {
          term: encodedTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      });
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
    const token = await getAuthToken();
    try {
      const response = await axiosInstance.get(`google-integration/genre`, {
        params: { genre: genero },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      });
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

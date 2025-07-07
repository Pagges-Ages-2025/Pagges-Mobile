import axiosInstance from "./axios-instance-singleton";

export default function SearchAPI() {
  const searchBooks = async (searchTerm: string) => {
    try {
      const encodedTerm = encodeURIComponent(searchTerm);
      const response = await axiosInstance.get(
        `google-integration/search/${encodedTerm}`,
        {
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

  const searchByGenre = async (genero: string[]) => {
    try {
      // Corrigindo a URL para usar o formato que o backend espera
      const response = await axiosInstance.post(
        `google-integration/genres`,
        genero,
        {
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

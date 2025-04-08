import axios from 'axios';

export default function SearchAPI() {
  // Função para obter o token de autorização (exemplo com localStorage)
  const getAuthToken = () => {
    // Aqui você pode pegar o token de onde for armazenado (localStorage, AsyncStorage, Context, etc.)
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoiYWxpY2VCQGV4YW1wbGUuY29tIiwiaWQiOjQsImlhdCI6MTc0NDA2MTYxNCwiZXhwIjoxNzQ0MTQ4MDE0fQ.mHCBZAZmX7ZK05XlA4TzvrxjHiCdeR4hQABxp9dW-O0"; // Exemplo com localStorage
  };

  // Função para buscar livros por termo
  const searchBooks = async (term: string) => {
    const token = getAuthToken(); // Obtém o token de autorização
    try {
      const response = await axios.get(`http://localhost:3000/google-integration/search/${term}`, {
        params: { term },
        headers: {
          Authorization: `Bearer ${token}`, // Passa o token no header
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  };

  // Função para buscar livros por gênero
  const searchByGenre = async (genero: string) => {
    const token = getAuthToken(); // Obtém o token de autorização
    try {
      const response = await axios.get(`http://localhost:3000/google-integration/genre/${genero}`, {
        params: { genero },
        headers: {
          Authorization: `Bearer ${token}`, // Passa o token no header
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por gênero:', error);
      throw error;
    }
  };

  // Expondo as funções para o uso no front-end
  return {
    searchBooks,
    searchByGenre
  };
}

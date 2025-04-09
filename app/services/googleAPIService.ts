import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchAPI() {
  const API_BASE_URL = 'http://localhost:3000/google-integration';

  // Configure axios defaults
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  };

  const searchBooks = async (term: string) => {
    const token = await getAuthToken();
    try {
      // Encoda o termo de busca para evitar problemas com caracteres especiais
      const encodedTerm = encodeURIComponent(term);
      
      const response = await axiosInstance.get(`/search`, {
        params: { 
          term: encodedTerm 
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.error('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
        throw new Error('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
      }
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  };

  const searchByGenre = async (genero: string) => {
    const token = await getAuthToken();
    try {
      const response = await axiosInstance.get(`/genre/${genero}`, {
        params: { genero },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.error('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
        throw new Error('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
      }
      console.error('Erro ao buscar por gênero:', error);
      throw error;
    }
  };

  return {
    searchBooks,
    searchByGenre
  };
}

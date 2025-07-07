import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../components/SearchBar/SearchBar';

const SEARCH_HISTORY_KEY = '@pagges:search-history';
const MAX_HISTORY_ITEMS = 5;

/**
 * Salva o histórico de pesquisas no AsyncStorage
 */
export const saveSearchHistory = async (history: Book[]): Promise<void> => {
  try {
    // Limitamos o número de itens a serem salvos
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Erro ao salvar histórico de pesquisas:', error);
  }
};

/**
 * Carrega o histórico de pesquisas do AsyncStorage
 */
export const loadSearchHistory = async (): Promise<Book[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
  } catch (error) {
    console.error('Erro ao carregar histórico de pesquisas:', error);
  }
  return [];
};

/**
 * Adiciona um livro ao histórico de pesquisas
 */
export const addBookToSearchHistory = async (book: Book): Promise<Book[]> => {
  try {
    // Carrega o histórico atual
    const currentHistory = await loadSearchHistory();
    
    // Remove o livro se já existir no histórico (para evitar duplicatas)
    const filteredHistory = currentHistory.filter(item => item.id !== book.id);
    
    // Adiciona o livro no início da lista
    const newHistory = [book, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    // Salva o histórico atualizado
    await saveSearchHistory(newHistory);
    
    return newHistory;
  } catch (error) {
    console.error('Erro ao adicionar livro ao histórico:', error);
    return [];
  }
};

/**
 * Remove um livro do histórico de pesquisas pelo índice
 */
export const removeBookFromSearchHistory = async (index: number): Promise<Book[]> => {
  try {
    // Carrega o histórico atual
    const currentHistory = await loadSearchHistory();
    
    // Remove o item no índice especificado
    const newHistory = currentHistory.filter((_, i) => i !== index);
    
    // Salva o histórico atualizado
    await saveSearchHistory(newHistory);
    
    return newHistory;
  } catch (error) {
    console.error('Erro ao remover livro do histórico:', error);
    return [];
  }
};

/**
 * Limpa todo o histórico de pesquisas
 */
export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico de pesquisas:', error);
  }
}; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../components/searchUser/SearchUser';

const USER_SEARCH_HISTORY_KEY = '@pagges:user-search-history';
const MAX_HISTORY_ITEMS = 5;

export const saveUserSearchHistory = async (history: User[]): Promise<void> => {
  try {
    const limited = history.slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(USER_SEARCH_HISTORY_KEY, JSON.stringify(limited));
  } catch (err) {
    console.error('Erro ao salvar histórico de usuários:', err);
  }
};

export const loadUserSearchHistory = async (): Promise<User[]> => {
  try {
    const json = await AsyncStorage.getItem(USER_SEARCH_HISTORY_KEY);
    if (json) return JSON.parse(json);
  } catch (err) {
    console.error('Erro ao carregar histórico de usuários:', err);
  }
  return [];
};

export const addUserToSearchHistory = async (user: User): Promise<User[]> => {
  try {
    const current = await loadUserSearchHistory();
    const filtered = current.filter(u => u.user_id !== user.user_id);
    const updated = [user, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    await saveUserSearchHistory(updated);
    return updated;
  } catch (err) {
    console.error('Erro ao adicionar usuário ao histórico:', err);
    return [];
  }
};

export const removeUserFromSearchHistory = async (index: number): Promise<User[]> => {
  try {
    const current = await loadUserSearchHistory();
    const updated = current.filter((_, i) => i !== index);
    await saveUserSearchHistory(updated);
    return updated;
  } catch (err) {
    console.error('Erro ao remover usuário do histórico:', err);
    return [];
  }
};

export const clearUserSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_SEARCH_HISTORY_KEY);
  } catch (err) {
    console.error('Erro ao limpar histórico de usuários:', err);
  }
};

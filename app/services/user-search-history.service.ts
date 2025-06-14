import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/User';
import { UserSearchResult } from '../models/UserSearchResult';

const USER_SEARCH_HISTORY_KEY = '@pagges:user-search-history';
const MAX_HISTORY_ITEMS = 5;

export const saveUserSearchHistory = async (history: UserSearchResult[]): Promise<void> => {
  try {
    const limited = history.slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(USER_SEARCH_HISTORY_KEY, JSON.stringify([limited]));
  } catch (err) {
    console.error('Erro ao salvar histórico de usuários:', err);
  }
};

export const loadUserSearchHistory = async (): Promise<UserSearchResult[]> => {
  try {
    const json = await AsyncStorage.getItem(USER_SEARCH_HISTORY_KEY);
    if (json) return JSON.parse(json);
  } catch (err) {
    console.error('Erro ao carregar histórico de usuários:', err);
  }
  return [];
};

export const addUserToSearchHistory = async (user: UserSearchResult): Promise<UserSearchResult[]> => {
  try {
    const current = await loadUserSearchHistory();
    const filtered = current.filter(u => u.id !== user.id);
    const updated = [user, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    await saveUserSearchHistory(updated);
    console.log("Histórico salvo:", updated);
    return updated;
  } catch (err) {
    console.error('Erro ao adicionar usuário ao histórico:', err);
    return [];
  }
};

export const removeUserFromSearchHistory = async (index: number): Promise<UserSearchResult[]> => {
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

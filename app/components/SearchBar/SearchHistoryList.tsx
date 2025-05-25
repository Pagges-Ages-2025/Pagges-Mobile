import React from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SearchHistoryItem } from './SearchHistoryItem';
import { Book } from './SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  history: Book[]; 
  onDeleteItem: (index: number) => void; 
  onSelectItem?: (text: string) => void; // Nova prop para quando um item é selecionado
  onClearHistory?: () => void; // Nova prop para limpar todo o histórico
}

export const SearchHistoryList = ({ history, onDeleteItem, onSelectItem, onClearHistory }: Props) => {
  const { theme } = useTheme();
  
  if (history.length === 0) return null; // Se não tiver histórico, não renderiza nada

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e botão para limpar histórico */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryText }]}>
          Pesquisas recentes
        </Text>
        {onClearHistory && (
          <TouchableOpacity onPress={onClearHistory} style={styles.clearButton}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={20} color={theme.primary} />
            <Text style={[styles.clearText, { color: theme.primary }]}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SearchHistoryItem 
            text={item.titulo}  // Passando apenas o título do livro
            onDelete={() => onDeleteItem(index)}
            isHistoryItem={true}
            onSelect={onSelectItem ? () => onSelectItem(item.titulo) : undefined}
          />
        )}
      />
    </View>
  );
};
// Estilização da lista
const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    marginLeft: 4,
    fontSize: 14,
  }
});
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { SearchHistoryItem } from './SearchHistoryItem';
import { Book } from './SearchBar';

interface Props {
  history: Book[]; 
  onDeleteItem: (index: number) => void; 
}

export const SearchHistoryList = ({ history, onDeleteItem }: Props) => {
  if (history.length === 0) return null; // Se não tiver histórico, não renderiza nada

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SearchHistoryItem 
            text={item.titulo}  // Passando apenas o título do livro
            onDelete={() => onDeleteItem(index)}
            isHistoryItem = {true}
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
});
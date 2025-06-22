import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SearchHistoryItem } from './searchHistoryUserItem';

import { useTheme } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserSearchResult } from '@/app/models/UserSearchResult';

interface Props {
  history: UserSearchResult[];
  onDeleteItem: (index: number) => void;
  onSelectItem?: (user: UserSearchResult) => void;
  onClearHistory?: () => void;
}

export const SearchUserHistoryList = ({
  history,
  onDeleteItem,
  onSelectItem,
  onClearHistory
}: Props) => {
  const { theme } = useTheme();
  if (history.length === 0) return null;

  useEffect(() => {
  console.log("Histórico atualizado:", SearchHistoryItem);
}, [SearchHistoryItem]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryText }]}>
          Pesquisas recentes
        </Text>
        {onClearHistory && (
          <TouchableOpacity onPress={onClearHistory} style={styles.clearButton}>
            <MaterialCommunityIcons
              name="delete-sweep-outline"
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.clearText, { color: theme.primary }]}>
              Limpar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SearchHistoryItem
            user={item}
            onDelete={() => onDeleteItem(index)}
            isHistoryItem={true}
            onSelect={onSelectItem ? () => onSelectItem(item) : undefined}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
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
  title: { fontSize: 16, fontWeight: 'bold' },
  clearButton: { flexDirection: 'row', alignItems: 'center' },
  clearText: { marginLeft: 4, fontSize: 14 },
});

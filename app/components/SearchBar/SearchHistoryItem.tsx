import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';


interface Props {
  text: string; 
  onDelete: () => void;
  isHistoryItem?: boolean;
}


export const SearchHistoryItem = ({ text, onDelete, isHistoryItem}: Props) => {
  const { theme } = useTheme(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>      
      {/* Ícone de relógio à esquerda */}
      {isHistoryItem && <MaterialIcons name="history" size={24} color={theme.placeholder} />}

      {/* Texto da pesquisa */}
      <Text style={[styles.text, { color: theme.primaryText }]}>{text}</Text>

      {/* Botão para excluir o item, exibido apenas se for um item do histórico */}
      {isHistoryItem && (
        <TouchableOpacity onPress={onDelete}>
          <Feather name="x" size={24} color={theme.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilização do item
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
});
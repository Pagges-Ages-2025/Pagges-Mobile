import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';


interface Props {
  text: string; 
  onDelete: () => void;
  isHistoryItem?: boolean;
  onSelect?: () => void;  // Nova prop para selecionar o item
}


export const SearchHistoryItem = ({ text, onDelete, isHistoryItem, onSelect }: Props) => {
  const { theme } = useTheme(); 

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.Background }]}
      onPress={onSelect}
      disabled={!onSelect}
    >      
      {/* Ícone de relógio à esquerda */}
      {isHistoryItem && <MaterialIcons name="history" size={24} color={theme.placeholder} />}

      {/* Texto da pesquisa */}
      <Text style={[styles.text, { color: theme.primaryText }]}>{text}</Text>

      {/* Botão para excluir o item, exibido apenas se for um item do histórico */}
      {isHistoryItem && (
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation(); // Impede que o evento de clique se propague para o componente pai
            onDelete();
          }}
        >
          <Feather name="x" size={24} color={theme.placeholder} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
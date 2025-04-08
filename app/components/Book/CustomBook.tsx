/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Image,
  Text,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type BookSize = "small" | "medium" | "large" | "search"; // Adiciona o tipo 'search'

interface CustomBookProps {
  size?: BookSize;
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  photoPath: string;
  bookId: number;
}

const CustomBook: React.FC<CustomBookProps> = ({
  size = "medium",
  title,
  onPress,
  photoPath = "https://placehold.co/600x400",
  bookId,
}) => {
  const { theme } = useTheme();

  // Estilos de tamanho para o botão
  const sizeStyles = {
    small: {
      height: 150,
      width: 100,
    },
    medium: {
      height: 200,
      width: 140,
    },
    large: {
      height: 260,
      width: 180,
    },
    search: {
      // Estilo específico para tipo 'search'
      height: 80,
    },
  }[size];

  const titleStyle = size === "search" ? styles.searchTitle : styles.baseText;

  return (
    <TouchableOpacity
      style={[
        size === "search" ? styles.baseSearch : styles.baseBook,
        size === "search" ? sizeStyles : sizeStyles,
        {
          backgroundColor:
            size === "search" ? theme.Background : theme.placeholder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: photoPath }}
        style={size === "search" ? styles.searchBookPhoto : styles.bookPhoto}
      />

      {title && <Text style={[titleStyle, {color: theme.primaryText}] }>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBook: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  baseSearch: {
    alignItems: "center",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    paddingLeft: 10,
  },
  baseText: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
  },
  searchTitle: {
    fontSize: 14,
    width: "100%",
    color: "black",
  },
  bookPhoto: {
    width: "100%",
    height: "100%",
  },
  searchBookPhoto: {
    width: 45,
    height: 70,
    borderRadius: 5,
  },
});

export default CustomBook;

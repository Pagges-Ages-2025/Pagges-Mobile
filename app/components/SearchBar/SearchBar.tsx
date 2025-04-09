import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomBook from "../Book/CustomBook";

export interface Book {
  id: number;          // Identificador único do livro
  titulo: string;      // Título do livro
  autores: string[];   // Lista de autores
  capa: string;        // URL da capa do livro
  paginas: number;     // Número de páginas
  sinopse?: string;    // Sinopse do livro (opcional, pois nem todos os livros possuem)
}

type SearchIconPosition = "right" | "left";
type SearchColor = "primary" | "secondary";
type SearchBorderRadius = "lg" | "md" | "sm";
type SearchIconColor = "primary" | "secondary" | "grey";
type SearchSize = "sm" | "md" | "lg";

interface BookSearchProps {
  SearchSize?: SearchSize;
  iconPosition?: SearchIconPosition;
  iconColor?: SearchIconColor;
  borderRadius?: SearchBorderRadius;
  color?: SearchColor;
  border?: boolean;
  books: Book[];
  onSelectBook: (book: Book) => void;
  placeholder?: string;
  onSearch?: (term: string) => void;
}

export default function BookSearch({
  SearchSize = "sm",
  iconPosition = "right",
  iconColor = "primary",
  borderRadius = "lg",
  color = "primary",
  border = true,
  books,
  onSelectBook,
  placeholder = "Buscar Livro...",
  onSearch,
}: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme } = useTheme();

  const dynamicStyles = {
    height: SearchSize === "lg" ? 50 : SearchSize === "md" ? 40 : 35,
    borderRadius: borderRadius === "lg" ? 33 : borderRadius === "md" ? 15 : 0,
    borderColor:
      color === "primary" ? theme.primary : theme.secondaryTransparent,
    borderWidth: border ? 1 : 0,
    iconColor:
      iconColor === "primary"
        ? theme.primary
        : iconColor === "secondary"
        ? theme.secondary
        : "#666",
    iconPositionStyle: iconPosition === "left" ? { left: 18 } : { right: 18 },
    inputPaddingStyle:
      iconPosition === "left"
        ? { paddingLeft: 35, paddingRight: 16 }
        : { paddingRight: 35 },
  };

  const handleSelectBook = useCallback(
    (book: Book) => {
      setQuery(book.titulo);
      setShowSuggestions(false);
      onSelectBook(book);
    },
    [onSelectBook]
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
    // Só dispara a busca se o texto não estiver vazio
    if (onSearch && text.trim().length > 0) {
      onSearch(text);
    }
  };

  // Função para fechar sugestões e teclado
  const handlePressOutside = () => {
    setShowSuggestions(false);
    setQuery(""); // Limpa o texto da busca
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.container}>
            <View
              style={[
                styles.searchContainer,
                {
                  height: dynamicStyles.height,
                  borderColor: dynamicStyles.borderColor,
                  borderWidth: dynamicStyles.borderWidth,
                  borderRadius: dynamicStyles.borderRadius,
                },
              ]}
            >
              <TextInput
                style={[styles.input, dynamicStyles.inputPaddingStyle, {backgroundColor: theme.Background, color: theme.primaryText}]}
                value={query}
                onChangeText={handleSearch}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                onFocus={() => setShowSuggestions(true)}
              />
              <View
                style={[styles.searchIconContainer, dynamicStyles.iconPositionStyle]}
              >
                <Ionicons name="search" size={20} color={dynamicStyles.iconColor} />
              </View>
            </View>

            {showSuggestions && query.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  style={{ maxHeight: 200, backgroundColor: theme.postCardBackground}}
                  data={books}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <CustomBook
                      size="search"
                      title={item.titulo}
                      photoPath={item.capa}
                      bookId={item.id}
                      onPress={() => handleSelectBook(item)}
                    />
                  )}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                      <Text style={[styles.emptyText, {color: theme.primaryText}]}>Nenhum livro encontrado</Text>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    width: "100%",
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    paddingRight: 40,
  },
  searchIconContainer: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  suggestionsContainer: {
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  bookTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});

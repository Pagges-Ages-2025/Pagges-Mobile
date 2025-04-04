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
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export interface Book {
  id: string;
  title: string;
  author: string;
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
}: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme, themeName } = useTheme();

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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectBook = useCallback(
    (book: Book) => {
      setQuery(book.title);
      setShowSuggestions(false);
      onSelectBook(book);
    },
    [onSelectBook]
  );

  return (
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
          style={[styles.input, dynamicStyles.inputPaddingStyle]}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          placeholderTextColor="#666"
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
            style={{ maxHeight: 200 }}
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectBook(item)}
              >
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#fff",
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
    borderBottomColor: "#eee",
  },
  bookTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});

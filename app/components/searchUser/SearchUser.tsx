import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import Strings from "@/app/constants/Strings";
import CustomUser from "./customUser";
import axiosInstance from "@/app/services/axios-instance-singleton";

export interface User {
    username: string;
    id: number;
}

type SearchIconPosition = "right" | "left";
type SearchColor = "primary" | "secondary";
type SearchIconColor = "primary" | "secondary" | "grey";

interface UserSearchProps {
  iconPosition?: SearchIconPosition;
  iconColor?: SearchIconColor;
  color?: SearchColor;
  border?: boolean;
  placeholder?: string;
  isBottomSheet?: boolean;
  // callback que terceiriza a ação de selecionar um usuário na lista
  onSelectUser: (user: User) => void;
}

export default function UserSearch({
  iconPosition = "right",
  iconColor = "primary",
  color = "primary",
  border = true,
  placeholder = "Buscar usuário...",
  isBottomSheet = false,
  onSelectUser,
}: UserSearchProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dynamicStyles = {
    height: 40,
    borderRadius: 15,
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

  useEffect(() => {
    if (isBottomSheet) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isBottomSheet]);

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      setShowSuggestions(text.trim().length > 0);

      if (text.trim().length === 0) {
        setUsers([]);
        return;
      }

      fetchUsers(text.trim());
    },
    []
  );

  const fetchUsers = async (term: string) => {
    setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/user-search/user`);
        console.log("response.data", response.data.data);
        const array = response.data.data as User[];
        setUsers(array);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = useCallback(
    (user: User) => {
      setQuery(user.username);
      setShowSuggestions(false);
      onSelectUser(user);
    },
    [onSelectUser]
  );

  const handleClearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setUsers([]);
    inputRef.current?.focus();
  };

  const handlePressOutside = () => {
    setShowSuggestions(false);
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
                ref={inputRef}
                style={[
                  styles.input,
                  dynamicStyles.inputPaddingStyle,
                  {
                    backgroundColor: theme.Background,
                    color: theme.primaryText,
                  },
                ]}
                value={query}
                onChangeText={handleSearch}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                onFocus={() => setShowSuggestions(query.length > 0)}
              />

              <View
                style={[
                  styles.searchIconContainer,
                  dynamicStyles.iconPositionStyle,
                ]}
              >
                {query.length > 0 ? (
                  <TouchableOpacity onPress={handleClearSearch}>
                    <MaterialIcons
                      name="cancel"
                      size={20}
                      color={dynamicStyles.iconColor}
                    />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name="search"
                    size={20}
                    color={dynamicStyles.iconColor}
                  />
                )}
              </View>
            </View>

            {showSuggestions && (
              <View style={styles.suggestionsContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.primary} />
                  </View>
                ) : (
                  <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <CustomUser
                        username={item.username}
                        profile_image="https://example.com/profile.jpg" // substitua pelo campo correto se necessário
                        onPress={() => handleSelectUser(item)}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <View style={styles.emptyContainer}>
                        <Text
                          style={[styles.emptyText, { color: theme.primaryText }]}
                        >
                          Nenhum usuário encontrado
                        </Text>
                      </View>
                    )}
                  />
                )}
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
    paddingHorizontal: 16,
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
    paddingRight: 40, // espaço para o ícone ficar por cima
  },
  searchIconContainer: {
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    right: 16,
    width: 25,
  },
  suggestionsContainer: {
    borderRadius: 8,
    marginTop: 4,
    marginHorizontal: 8,
    maxHeight: 200, // limita o tamanho da lista de sugestões
    backgroundColor: "#fff", // ou algum background do seu tema
    elevation: 4, // sombra (Android)
    shadowColor: "#000", // sombra (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    padding: 12,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  loadingContainer: {
    padding: 12,
    alignItems: "center",
  },
});

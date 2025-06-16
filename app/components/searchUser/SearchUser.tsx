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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import CustomUser from "./customUser";
import { base64Uri } from "@/app/utils/imageUtils";
import { searchUsers } from "@/app/services/search-user.service";
import { UserSearchResult } from "@/app/models/UserSearchResult";
import { router } from "expo-router";
import { SearchUserHistoryList } from "./searchHistoryUserList";

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
  onSelectUser: (user: UserSearchResult) => void;
  onShowSuggestionsChange?: (show: boolean) => void;
  showingResults: boolean;
  searchHistory: UserSearchResult[];
  handleSelectHistoryItem: (user: UserSearchResult) => void;
  handleDeleteHistoryItem: (index: number) => void;
  handleClearSearchHistory: () => void;
}

export default function UserSearch({
  iconPosition = "right",
  iconColor = "primary",
  color = "primary",
  border = true,
  placeholder = "Pesquisar leitores...",
  isBottomSheet = false,
  onSelectUser,
  onShowSuggestionsChange = () => {},
  showingResults = false,
  searchHistory = [],
  handleSelectHistoryItem,
  handleDeleteHistoryItem,
  handleClearSearchHistory,
}: UserSearchProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
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
  };

  useEffect(() => {
    if (isBottomSheet) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isBottomSheet]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    const shouldShow = text.trim().length > 0;
    setShowSuggestions(shouldShow);
    onShowSuggestionsChange(shouldShow);

    if (!shouldShow) {
      setUsers([]);
      return;
    }
    fetchUsers(text.trim());
  }, []);

  const fetchUsers = async (term: string) => {
    setIsLoading(true);
    try {
      const users = await searchUsers(term);

      setUsers(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    onShowSuggestionsChange(false);
    setUsers([]);
    inputRef.current?.focus();
  };

  const handlePressOutside = () => {
    setShowSuggestions(false);
    onShowSuggestionsChange(false);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
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
                    {
                      backgroundColor: theme.Background,
                      color: theme.primaryText,
                    },
                  ]}
                  value={query}
                  onChangeText={handleSearch}
                  placeholder={placeholder}
                  placeholderTextColor={theme.placeholder}
                  onFocus={() => {
                    const show = query.trim().length > 0;
                    setShowSuggestions(show);
                    onShowSuggestionsChange(show);
                  }}
                />

                <View style={[styles.searchIconContainer]}>
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

              <View>
                {!showingResults && searchHistory.length > 0 ? (
                  <SearchUserHistoryList
                    history={searchHistory}
                    onSelectItem={handleSelectHistoryItem}
                    onDeleteItem={handleDeleteHistoryItem}
                    onClearHistory={handleClearSearchHistory}
                  />
                ) : !showingResults ? (
                  <Text
                    style={{
                      color: theme.primaryText,
                      textAlign: "center",
                      marginTop: 16,
                    }}
                  >
                    Nenhuma pesquisa recente
                  </Text>
                ) : null}
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
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      renderItem={({ item }) => (
                        <CustomUser
                          name={item.name}
                          username={item.username}
                          profile_image={
                            item.profile_image
                              ? base64Uri(item.profile_image)
                              : null
                          }
                          onPress={() => {
                            onSelectUser(item);
                            setShowSuggestions(false);
                            onShowSuggestionsChange(false);
                            router.push({
                              pathname: "/screens/thirdPersonProfile",
                              params: { username: item.username },
                            });
                          }}
                        />
                      )}
                      ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                          <Text
                            style={[
                              styles.emptyText,
                              { color: theme.primaryText },
                            ]}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
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
  },
  searchIconContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    width: 25,
  },
  suggestionsContainer: {
    borderRadius: 8,
    shadowRadius: 4,
    flexDirection: "column",
    flex: 1,
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

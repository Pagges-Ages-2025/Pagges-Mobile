import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import UserSearch from "../components/searchUser/SearchUser";
import { useTheme } from "../context/ThemeContext";
import {
  loadUserSearchHistory,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  clearUserSearchHistory,
} from "../services/user-search-history.service";
import { SearchUserHistoryList } from "../components/searchUser/searchHistoryUserList";
import { UserSearchResult } from "../models/UserSearchResult";
import { router } from "expo-router";

const SearchSocialPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchHistory, setSearchHistory] = useState<UserSearchResult[]>([]);
  const [showingResults, setShowingResults] = useState(false);

  useEffect(() => {
    (async () => {
      const history = await loadUserSearchHistory();
      setSearchHistory(history);
    })();
  }, []);

  const handleSelectHistoryItem = async (user: UserSearchResult) => {
    console.log("Item de histórico selecionado:", user);
    await handleSelectUser(user);
    router.push({
      pathname: "/screens/thirdPersonProfile",
      params: { username: user.username },
    });
    console.log("Item de histórico selecionado:");
  };

  const handleSelectUser = async (user: UserSearchResult) => {
    const updated = await addUserToSearchHistory(user);
    setSearchHistory(updated);
    console.log("Usuário selecionado:", updated);
  };

  const handleDeleteHistoryItem = async (index: number) => {
    const updated = await removeUserFromSearchHistory(index);
    setSearchHistory(updated);
  };

  const handleClearSearchHistory = async () => {
    await clearUserSearchHistory();
    setSearchHistory([]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={{ paddingTop: 30, flex: 1 }}>
        <UserSearch
          onSelectUser={handleSelectUser}
          onShowSuggestionsChange={setShowingResults}
          showingResults={showingResults}
          searchHistory={searchHistory}
          handleSelectHistoryItem={handleSelectHistoryItem}
          handleDeleteHistoryItem={handleDeleteHistoryItem}
          handleClearSearchHistory={handleClearSearchHistory}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchSocialPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

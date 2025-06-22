import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import UserSearch from "../components/searchUser/SearchUser";
import { useTheme } from "../context/ThemeContext";
import {
  loadUserSearchHistory,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  clearUserSearchHistory,
} from "../services/user-search-history.service";
import { UserSearchResult } from "../models/UserSearchResult";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
    await handleSelectUser(user);
    router.push({
      pathname: "/screens/thirdPersonProfile",
      params: { username: user.username },
    });
  };

  const handleSelectUser = async (user: UserSearchResult) => {
    const updated = await addUserToSearchHistory(user);
    setSearchHistory(updated);
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

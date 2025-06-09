import React, { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import UserSearch, { User } from "../components/searchUser/SearchUser";
import { useTheme } from "../context/ThemeContext";
import { SearchHistoryList } from "../components/SearchBar/SearchHistoryList"; // Certifique-se de usar este

import {
  loadUserSearchHistory,
  addUserToSearchHistory,
  removeUserFromSearchHistory,
  clearUserSearchHistory,
} from "../services/user-search-history.service";
import { SearchUserHistoryList } from "../components/searchUser/searchHistoryUserList";

const SearchSocialPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchHistory, setSearchHistory] = useState<User[]>([]);
  const [showingResults, setShowingResults] = useState(false);

  useEffect(() => {
    (async () => {
      const history = await loadUserSearchHistory();
      setSearchHistory(history);
    })();
  }, []);

  const handleSelectHistoryItem = async (user: User) => {
    await handleSelectUser(user);
    console.log("Item de histórico selecionado:",);
  };

  const handleSelectUser = async (user: User) => {
    const updated = await addUserToSearchHistory(user);
    setSearchHistory(updated);
    console.log("Usuário selecionado:", searchHistory);
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
      <View style={{ paddingTop: 30 }}>

        <UserSearch onSelectUser={handleSelectUser} onShowSuggestionsChange={setShowingResults} />

        <View style={{paddingTop: 50}}>
          {!showingResults && searchHistory.length > 0 ? (
            <SearchUserHistoryList
              history={searchHistory}
              onSelectItem={handleSelectHistoryItem}
              onDeleteItem={handleDeleteHistoryItem}
              onClearHistory={handleClearSearchHistory}
            />
          ) : !showingResults ? (
            <Text style={{ color: theme.primaryText, textAlign: "center", marginTop: 16 }}>
              Nenhuma pesquisa recente
            </Text>
          ) : null}
        </View> 

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

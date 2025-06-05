import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import UserSearch from "../components/searchUser/SearchUser";
import { useTheme } from "../context/ThemeContext";


const SearchSocialPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={{paddingTop: 30}}> 
      <UserSearch
        onSelectUser={(user) => {
          console.log("Usuário selecionado:", user);
        }}
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
  content: {
    alignSelf: "center",
    width: "90%",
    flex: 1,
    paddingTop: 30,
    flexDirection: "column",
  },
});
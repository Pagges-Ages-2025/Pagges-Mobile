import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import SelectionButton from "../components/Buttons/SelectionButton";


const Social: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
      edges={[]}
    >
      <ScrollView>
        <View style={styles.content}>
          <NunitoText style={[styles.title, { color: theme.primary }]}>Pagges</NunitoText>
          <StaticSearchBar
          toRoute="/screens/searchSocialPage"
          placeholder="Pesquisar leitores..."
          />
          <View style={styles.selectionContainer}>
         <SelectionButton
            title="Para você"
            isSelected={true}
            isDisable={false}
            onSelectChange={() => {}}
          />
         <SelectionButton
            title="Seguindo"
            isSelected={false}
            isDisable={false}
            onSelectChange={() => {}}
          />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    flex: 1,
    paddingTop: 30,
    width: "90%",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
});

export default Social;

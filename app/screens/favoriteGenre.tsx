import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "../components/Buttons/CustomButton";
import SelectionButton from "../components/Buttons/SelectionButton";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import { useTheme } from "../context/ThemeContext";

const FavoriteGenre: React.FC = () => {
  const { theme, themeName } = useTheme();
  const gener = [
    "Família",
    "Ficção Científica",
    "Romance",
    "Terror",
    "Noir",
    "Histórico",
    "Fantasia",
    "Aventura",
    "Suspense",
    "Mistério",
    "Biografia",
    "Drama",
    "Policial",
    "Comédia",
    "Distopia",
    "Espiritualidade",
    "Autoajuda",
    "Tecnologia",
    "Thriller",
    "Crônicas",
    "Ensaio",
    "Mitologia",
    "Clássico",
    "Gótico",
    "Realismo Mágico",
    "Infantojuvenil",
    "Chick-Lit",
    "Humor",
    "Poesia",
    "Épico",
    "Cyberpunk",
    "Viagem",
    "Fábula",
    "Religião",
    "Psicologia",
    "Filosofia",
    "Sociedade",
    "Conto",
    "Natureza",
  ];

  const [selectedItens, setSelectedItens] = useState<string[]>([]);
  const { from } = useLocalSearchParams<{ from: string }>();

  const toggleSelection = (title: string) => {
    if (selectedItens.length < 3 || selectedItens.includes(title)) {
      setSelectedItens((iten) =>
        iten.includes(title)
          ? iten.filter((x) => x !== title)
          : [...iten, title]
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={[styles.containerView]}>
        <NunitoText
          style={[
            styles.h1,
            { color: themeName === "dark" ? theme.white : theme.primary },
          ]}
        >
          {Strings.genreTitle}
        </NunitoText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.genreList}>
          {gener.map((title) => (
            <SelectionButton
              title={title}
              isSelected={selectedItens.includes(title)}
              key={title}
              onSelectChange={() => toggleSelection(title)}
              isDisable={
                selectedItens.length === 3 && !selectedItens.includes(title)
              }
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <CustomButton
          title={Strings.save}
          size="small"
          fontWeight="bold"
          onPress={() => router.replace("/screens/home")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 28,
    fontWeight: "900",
  },
  containerView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  genreList: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 15,
    justifyContent: "center",
    paddingBottom: 20,
  },
  buttonWrapper: {
    alignSelf: "center",
    width: 250,
    bottom: 40,
    marginTop: 50,
  },
});

export default FavoriteGenre;

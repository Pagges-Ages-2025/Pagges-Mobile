import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import BookSearch, { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import SearchAPI from "../services/googleAPIService";
import ModalBookDetails from "./book";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import SelectionButton from "../components/Buttons/SelectionButton";

const FavoriteGenre: React.FC = () => {
  const { theme } = useTheme();
  const gener = [
    "Família",
    "Ficção Científica",
    "Romance",
    "Terror",
    "Noir",
    "Histórico",
    "Fantasia",
    "Drama",
    "Suspense",
    "Documentário",
    "Guerra",
    "Comédia",
    "Thriller Psicológico",
    "Aventura",
    "Musical",
    "Crime",
    "Policial",
    "Animação",
    "Esporte",
    "Biografia",
    "Ação",
    "Faroeste",
    "Super-herói",
    "Mistério",
  ];
  const toggleSelection = (title: string) => {
    if (selectedItens.length < 3 || selectedItens.includes(title)) {
      setSelectedItens((iten) =>
        iten.includes(title)
          ? iten.filter((x) => x !== title)
          : [...iten, title]
      );
    }
  };
  const [selectedItens, setSelectedItens] = useState<string[]>([]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={[styles.containerView]}>
        <NunitoText style={[styles.h1, { color: theme.primary }]}>
          {Strings.genreTitle}
        </NunitoText>
      </View>
      <View
        style={{
          flexDirection: "row",
          columnGap: 10,
          rowGap: 20,
          flexWrap: "wrap",
          paddingInline: 15,
          justifyContent: "center",
        }}
      >
        {gener.map((title) => (
          <SelectionButton
            title={title}
            isSelected={selectedItens.includes(title)}
            key={title}
            onSelectChange={() => toggleSelection(title)}
          />
        ))}
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
    marginBottom: 40,
  },
});

export default FavoriteGenre;

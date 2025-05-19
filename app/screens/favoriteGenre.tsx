import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "../components/Buttons/CustomButton";
import SelectionButton from "../components/Buttons/SelectionButton";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import { useTheme } from "../context/ThemeContext";

import { retriveAllGenres } from "../services/genres.service";
import { Genre } from "../models/Genre"; 
const FavoriteGenre: React.FC = () => {
  const { theme, themeName } = useTheme();
  const [genres, setGenres] = useState<Genre[]>([]); 
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

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await retriveAllGenres();
      setGenres(genresData.data); 
    };
    fetchGenres();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={styles.containerView}>
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
          {genres.length > 0 ? (
            genres.map((genre) => (
              <SelectionButton
                title={genre.genre_name}
                isSelected={selectedItens.includes(genre.genre_name)}
                key={genre.genre_id}
                onSelectChange={() => toggleSelection(genre.genre_name)}
                isDisable={
                  selectedItens.length === 3 &&
                  !selectedItens.includes(genre.genre_name)
                }
              />
            ))
          ) : (
            <NunitoText>No genres found or genres is empty.</NunitoText>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <CustomButton
          title={Strings.save}
          size="small"
          fontWeight="bold"
          onPress={() => {
            // Salvar os gêneros no banco
            if (from === "register") {
              router.replace("/screens/home");
            } else {
              router.back();
            }
          }}
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
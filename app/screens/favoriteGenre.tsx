import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import CustomButton from "../components/Buttons/CustomButton";
import SelectionButton from "../components/Buttons/SelectionButton";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import { useTheme } from "../context/ThemeContext";

import {
  retriveUserGenres,
  retriveAllGenres,
} from "../services/genres.service";
import UserAPI from "../services/profileService";
import { Genre } from "../models/Genre";

const FavoriteGenre: React.FC = () => {
  const { theme, themeName } = useTheme();
  const { from } = useLocalSearchParams<{ from: string }>();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const saveGenre = async () => {
    try {
      await UserAPI().updateProfile(undefined, undefined, selectedItems);

      if (from === "edit") {
        router.back();
      } else {
        router.replace("/screens/home");
      }
    } catch (error) {
      console.error("Erro ao salvar gênero:", error);
      showErrorModal(
        "Erro",
        "Não foi possível salvar suas preferências. Tente novamente.",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await retriveAllGenres();
      setGenres(genresData.data);

      const userGenresData = await retriveUserGenres();
      setSelectedItems(
        userGenresData.data.map((genre: Genre) => genre.genre_id)
      );
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
                key={genre.genre_id}
                title={genre.genre_name}
                isSelected={selectedItems.includes(genre.genre_id)}
                onSelectChange={() => toggleSelection(genre.genre_id)}
                isDisable={
                  selectedItems.length === 3 &&
                  !selectedItems.includes(genre.genre_id)
                }
              />
            ))
          ) : (
            <NunitoText>Nenhum gênero encontrado.</NunitoText>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <CustomButton
          title={Strings.save}
          size="small"
          fontWeight="bold"
          onPress={saveGenre}
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

function showErrorModal(
  title: string,
  message: string,
  type: string
) {
  console.warn(`[${type.toUpperCase()}] ${title}: ${message}`);
}

export default FavoriteGenre;
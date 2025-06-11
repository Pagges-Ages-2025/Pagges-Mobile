import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import CustomButton from "../components/Buttons/CustomButton";
import SelectionButton from "../components/Buttons/SelectionButton";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import { useTheme } from "../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  retriveUserGenres,
  retriveAllGenres,
} from "../services/genres.service";
import UserAPI from "../services/profileService";
import { Genre } from "../models/Genre";

import FollowUser from "../components/Follow-User/FollowUserComponent";

const Followers: React.FC = () => {
  const { fromScreen } = useLocalSearchParams();

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
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={themeName === "dark" ? theme.white : theme.black}
            onPress={router.back}
          />
        </TouchableOpacity>
        <NunitoText
          style={[
            styles.h1,
            { color: themeName === "dark" ? theme.white : theme.primary },
          ]}
        >
          {Strings.followersPage}
        </NunitoText>

        <View></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}></ScrollView>
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
  backButton: {
    position: "absolute",
    left: 20,
  },
  containerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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

function showErrorModal(title: string, message: string, type: string) {
  console.warn(`[${type.toUpperCase()}] ${title}: ${message}`);
}

export default Followers;

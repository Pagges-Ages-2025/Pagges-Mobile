import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import HomeCarouselSection from "../components/Home-Carousel/HomeCarousel";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import ModalBookDetails from "./bookDetails";
import BooksService from "../services/booksService";

export interface Book {
  id: number;
  title: string;
  authors: string[];
  coverUrl: string;
  pages: number;
  publicationYear: string;
  genres: string[];
  synopsis?: string;
  avgRating?: number;
}

const mockCards = [
  { id: "1", title: "Desafio Diário" },
  { id: "2", title: "Desafio Diário" },
  { id: "3", title: "Desafio Diário" },
];
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomButton from "../components/Buttons/CustomButton";
import { router } from "expo-router";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const gener = [
    "Terror",
    "Romance",
    "Família",
    "Noir",
    "Ficção Científica",
    "Histórico",
  ];
  const genres = gener.map((item) => (
    <CustomButton fontWeight={"semibold"} size={"small"} title={item} onPress={() => router.push({
      pathname: "/screens/genreLibrary",
      params: { selectedGenre: item },
    })}></CustomButton>
  ));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={styles.content}>
        <StaticSearchBar />
        <View style={styles.genreContent}>
          <CustomCarousel isHorizontal data={genres} />
        </View>
      </View>
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
  genreContent: {
    paddingTop: 30,
  },
});

export default Home;

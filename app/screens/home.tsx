import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomButton from "../components/Buttons/CustomButton";
import { router } from "expo-router";

const Home: React.FC = () => {
  const { theme } = useTheme();
  const gener = [
    "Família",
    "Ficção Científica",
    "Romance",
    "Terror",
    "Noir",
    "Histórico"
  ];

  const genres = gener.map((item) => (
    <CustomButton fontWeight={"semibold"} size={"small"} title={item} onPress={() => router.replace("/screens/favoriteGenre")}></CustomButton>
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

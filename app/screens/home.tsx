import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import HomeCarouselSection from "../components/Home-Carousel/HomeCarousel";
import { ScrollView } from "react-native-gesture-handler";

const mockCards = [
  { id: "1", title: "Desafio Diário" },
  { id: "2", title: "Desafio Diário" },
  { id: "3", title: "Desafio Diário" },
];

const Home: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <ScrollView> 
        
        <View style={styles.content}>
          <StaticSearchBar />
        </View>

        <View style={styles.carouselContainer}>
          {/* alterar a rota assim que houver pagina */}
            <HomeCarouselSection route={"/screens/home"} cards={mockCards} />
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
  carouselContainer: {
    paddingTop: 20,
  }
});

export default Home;

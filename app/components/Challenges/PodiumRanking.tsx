import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHomeCarousel from "../Carousel/CustomHomeCarousel"; // seu componente
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Props = {
  // cards: CardItem[];
  route: string;
  onIndexChange?: (index: number) => void;
};

const PodiumRankingSection = ({ route, onIndexChange }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<any>();

  const handlePress = (route?: string) => {
    if (route) {
      console.log("clicado", route);
      router.push(route as any); 
    }
  };

  return (
    <View style={styles.carouselContainer}>
      
    </View>
  );
};

export default PodiumRankingSection;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1, 
  },
  card: {
    width: width * 0.8,
    height: 172,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});

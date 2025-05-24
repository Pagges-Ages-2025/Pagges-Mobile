import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHomeCarousel from "../Carousel/CustomHomeCarousel"; // seu componente
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type CardItem = {
  id: string;
  title: string;
};

type Props = {
  cards: CardItem[];
  route: string;
  onIndexChange?: (index: number) => void;
};

const HomeCarouselSection = ({ cards, route, onIndexChange }: Props) => {
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
      <View style={{ paddingHorizontal: 20 }}>
        <CustomHomeCarousel
          data={cards.map((item, index) => (
            <View
            key={item.id}
          >
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(route)}
              style={[
                styles.card, 
                {backgroundColor: theme.tertiaryText},
              ]}
            >
              <Text style={[styles.cardText, {color: theme.white}]}>{item.title}</Text>
            </TouchableOpacity>
            </View>
          ))}
          isHorizontal={true}
          onIndexChange={setCurrentIndex}
        />
      </View>

      <View style={styles.dotsContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? {backgroundColor: theme.tertiaryText} : {backgroundColor: "#D9D9D9"},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeCarouselSection;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1, 
  },
  card: {
    width: width * 0.9,
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

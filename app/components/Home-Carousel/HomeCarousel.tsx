import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomHomeCarousel from "../Carousel/CustomHomeCarousel";

const { width } = Dimensions.get("window");

type CardItem = {
  id: string;
  title: string;
  subtitle?: string;
  route?: string;
  icon?: string;
  backgroundImage?: string | number; // Can be URL (string) or imported image (number)
};

type Props = {
  cards: CardItem[];
  onIndexChange?: (index: number) => void;
};

const HomeCarouselSection = ({ cards, onIndexChange }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageErrorStates, setImageErrorStates] = useState<{
    [key: string]: boolean;
  }>({});
  const navigation = useNavigation<any>();

  const handlePress = (route?: string) => {
    if (route) {
      console.log("clicado", route);
      router.push(route as any);
    }
  };

  const handleImageLoad = (cardId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [cardId]: false }));
  };

  const handleImageError = (cardId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [cardId]: false }));
    setImageErrorStates((prev) => ({ ...prev, [cardId]: true }));
  };

  const renderCard = (item: CardItem) => {
    const cardContent = (
      <View style={styles.cardContent}>
        {item.icon && <Text style={styles.cardIcon}>{item.icon}</Text>}
        <Text style={[styles.cardTitle, { color: theme.white }]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.cardSubtitle, { color: theme.white }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
    );

    // If background image is provided and no error, use ImageBackground
    if (item.backgroundImage && !imageErrorStates[item.id]) {
      // Determine if it's a local image (number) or remote URL (string)
      const imageSource =
        typeof item.backgroundImage === "string"
          ? { uri: item.backgroundImage }
          : item.backgroundImage;

      return (
        <ImageBackground
          source={imageSource}
          style={styles.card}
          imageStyle={styles.cardBackgroundImage}
          resizeMode="cover"
          onLoad={() => handleImageLoad(item.id)}
          onError={() => handleImageError(item.id)}
        >
          <View style={styles.cardOverlay}>
            {imageLoadingStates[item.id] && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.white} />
              </View>
            )}
            {cardContent}
          </View>
        </ImageBackground>
      );
    }

    // Fallback to solid color background
    return (
      <View style={[styles.card, { backgroundColor: theme.primary }]}>
        {cardContent}
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <View style={{ paddingHorizontal: 20 }}>
        <CustomHomeCarousel
          data={cards.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => handlePress(item.route)}
                style={styles.cardTouchable}
                activeOpacity={0.8}
              >
                {renderCard(item)}
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
              currentIndex === index
                ? { backgroundColor: theme.tertiaryText }
                : { backgroundColor: "#D9D9D9" },
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
    width: width * 0.8,
    height: 172,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardTouchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  cardBackgroundImage: {
    borderRadius: 10,
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for better text readability
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});

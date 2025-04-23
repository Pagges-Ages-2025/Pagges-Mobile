import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/app/constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";

interface StarRatingProps {
  stars: number;
  onPressStar?: (starIndex: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ stars, onPressStar }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedStars, setSelectedStars] = useState(stars);

  const handlePress = (index: number) => {
    setSelectedStars(index + 1);
    if (onPressStar) {
      onPressStar(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}>
          <AntDesign
            name={index < selectedStars ? "star" : "staro"}
            color={index < selectedStars ? theme.starColor : theme.secondaryText}
            size={20}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      width: "30%",
      alignItems: "center",
    },
  });

export default StarRating;

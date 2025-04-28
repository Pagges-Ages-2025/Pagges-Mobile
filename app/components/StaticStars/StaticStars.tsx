import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext"; 
import { Theme } from "@/app/constants/Theme"; 
import AntDesign from "@expo/vector-icons/AntDesign";

interface StaticStarsProps {
  rating: number;        
  onPress: () => void;   
}

const StaticStars: React.FC<StaticStarsProps> = ({ rating, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign
            key={index}
            name={index < rating ? "star" : "staro"}
            color={index < rating ? theme.starColor : theme.secondaryText}
            size={20}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      justifyContent: "center",
      width: "100%",
    },
    starsContainer: {
      flexDirection: "row",
    },
  });

export default StaticStars;

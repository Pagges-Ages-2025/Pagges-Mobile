import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomCarousel from "../Carousel/CustomCarousel";
import Achievement from "./Achievement";

const AchievementsGrid: React.FC = () => {
  const { theme } = useTheme();

  const achievements = [
    {
      icon: "book",
      title: "Primeiro Livro",
      color: theme.primary,
      backgroundColor: theme.quaternary,
    },
    {
      icon: "library",
      title: "Bibliotecário",
      color: theme.secondary,
      backgroundColor: theme.quaternary,
    },
    {
      icon: "trophy",
      title: "Campeão",
      color: "#FFD700",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "star",
      title: "Crítico",
      color: "#FF6B6B",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "flame",
      title: "Leitor Ávido",
      color: "#FF8C42",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "heart",
      title: "Amante dos Livros",
      color: "#E91E63",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "bulb",
      title: "Sábio",
      color: "#9C27B0",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "diamond",
      title: "Colecionador",
      color: "#00BCD4",
      backgroundColor: theme.quaternary,
    },
    {
      icon: "medal",
      title: "Conquistador",
      color: "#4CAF50",
      backgroundColor: theme.quaternary,
    },
  ];

  return (
    <View style={styles.container}>
      <CustomCarousel
        isHorizontal
        data={achievements.map((achievement, index) => (
          <Achievement
            key={index}
            icon={achievement.icon}
            title={achievement.title}
            color={achievement.color}
            backgroundColor={achievement.backgroundColor}
          />
        ))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
});

export default AchievementsGrid;

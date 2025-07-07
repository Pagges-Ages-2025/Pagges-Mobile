import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Achievement from "../../../components/Achievements/Achievement";
import { useTheme } from "../../../context/ThemeContext";
import Section from "../components/section";
const AchievementsSection = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState({
    achievements: false,
    variations: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Conquistas"
      isOpen={open.achievements}
      onToggle={() => toggle("achievements")}
      type="title"
    >
      <Section
        title="Variações"
        isOpen={open.variations}
        onToggle={() => toggle("variations")}
      >
        <View style={styles.grid}>
          <Achievement
            icon="ribbon"
            title="Conquista Básica"
            color={theme.iconColor}
            backgroundColor={theme.quaternary}
          />
          <Achievement
            icon="book"
            title="Primeiro Livro"
            color={theme.secondary}
            backgroundColor={theme.quaternary}
          />
          <Achievement
            icon="trophy"
            title="Campeão"
            color={theme.tertiary}
            backgroundColor={theme.quaternary}
          />
          <Achievement
            icon="star"
            title="Crítico"
            color={theme.primary}
            backgroundColor={theme.quaternary}
          />
          <Achievement
            icon="flame"
            title="Leitor Ávido"
            color="#FF8C42"
            backgroundColor={theme.quaternary}
          />
          <Achievement
            icon="heart"
            title="Amante dos Livros"
            color="#E91E63"
            backgroundColor={theme.quaternary}
          />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
});

export default AchievementsSection;

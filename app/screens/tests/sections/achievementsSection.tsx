import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import Achievement from "../../../components/Achievements/Achievement";
import { useTheme } from "../../../context/ThemeContext";
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
          <Achievement />
          <Achievement color={theme.secondary} backgroundColor={theme.quaternary} />
          <Achievement color={theme.tertiary} backgroundColor={theme.quaternary} />
          <Achievement color={theme.primary} backgroundColor={theme.quaternary} />
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
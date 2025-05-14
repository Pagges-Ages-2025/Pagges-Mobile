// components/Section.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import NunitoText from "@/app/components/Texts/NunitoText";

interface SectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  type?: "title" | "default";
  titleStyle?: TextStyle;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  isOpen,
  onToggle,
  type = "default",
  titleStyle,
  children,
}) => {
  const { theme } = useTheme();

  const dynamicTitleStyle: TextStyle =
    type === "title"
      ? { fontSize: 36, fontWeight: "bold", color: theme.primaryText }
      : { fontSize: 20, fontWeight: "500", color: theme.secondaryText };

  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={onToggle} style={styles.header}>
        <NunitoText style={[dynamicTitleStyle, titleStyle]}>
          {title}
        </NunitoText>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={22}
          color={theme.primaryText}
        />
      </TouchableOpacity>
      {isOpen && children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default Section;

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";

interface AchievementProps {
  color?: string;
  backgroundColor?: string;
  icon?: string;
  title?: string;
  size?: number;
}

const Achievement: React.FC<AchievementProps> = ({
  color,
  backgroundColor,
  icon = "ribbon",
  title,
  size = 30,
}) => {
  const { theme } = useTheme();

  const dynamicStyles = () => ({
    borderColor: color || theme.iconColor,
    backgroundColor: backgroundColor || theme.quaternary,
  });

  const dynamicIconStyles = () => ({
    color: color || theme.iconColor,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.iconeArea, dynamicStyles()]}>
        <Ionicons name={icon as any} size={size} style={dynamicIconStyles()} />
      </TouchableOpacity>
      {title && (
        <NunitoText style={[styles.title, { color: theme.primaryText }]}>
          {title}
        </NunitoText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  iconeArea: {
    alignItems: "center",
    borderRadius: 60,
    borderWidth: 2,
    height: 60,
    justifyContent: "center",
    padding: 10,
    width: 60,
  },
  title: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    maxWidth: 80,
  },
});

export default Achievement;

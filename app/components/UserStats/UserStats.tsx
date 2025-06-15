import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/app/constants/Theme";
import { Stack } from "expo-router";

interface UserStatsProps {
  kmLidos: number;
  livros: number;
  ranking: number;
  seguidores: number;
  onSeguidoresClick: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({
  kmLidos,
  livros,
  ranking,
  seguidores,
  onSeguidoresClick,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const stats = [
    { label: "km lidos", value: kmLidos },
    { label: "livros", value: livros },
    { label: "ranking", value: ranking },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <NunitoText style={styles.value}>{stat.value}</NunitoText>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.statContainer, { marginTop: 3 }]}
        onPress={onSeguidoresClick}
      >
        <NunitoText style={styles.value}>{seguidores}</NunitoText>
        <Text style={styles.label}>seguidores</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statContainer: {
      alignItems: "center",
    },
    value: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme.secondary,
    },
    label: {
      fontSize: 20,
      color: theme.secondaryText,
    },
    label2: {
      fontSize: 21,
      color: theme.secondaryText,
    },
  });

export default UserStats;

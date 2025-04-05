import React from "react";
import { Text, View, StyleSheet } from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/app/constants/Theme";

interface UserStatsProps {
  kmLidos: number;
  livros: number;
  ranking: number;
  amigos: number;
}

const UserStats: React.FC<UserStatsProps> = ({ kmLidos, livros, ranking, amigos }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const stats = [
    { label: "km lidos", value: kmLidos },
    { label: "livros", value: livros },
    { label: "ranking", value: ranking },
    { label: "amigos", value: amigos },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <NunitoText style={styles.value}>{stat.value}</NunitoText>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
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
  });

export default UserStats;

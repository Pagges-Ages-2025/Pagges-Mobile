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

  return (
    <View style={styles.container}>
      <View style={styles.statContainer}>
        <NunitoText style={styles.value}>{kmLidos}</NunitoText>
        <Text style={styles.label}>km lidos</Text>
      </View>
      <View style={styles.statContainer}>
        <NunitoText style={styles.value}>{livros}</NunitoText>
        <Text style={styles.label}>livros</Text>
      </View>
      <View style={styles.statContainer}>
        <NunitoText style={styles.value}>{ranking}</NunitoText>
        <Text style={styles.label}>ranking</Text>
      </View>
      <View style={styles.statContainer}>
        <NunitoText style={styles.value}>{amigos}</NunitoText>
        <Text style={styles.label}>amigos</Text>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    statContainer: {
      alignItems: "center",
    },
    value: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.secondary,
    },
    label: {
      fontSize: 14,
      color: theme.secondaryText,
    },
  });

export default UserStats;

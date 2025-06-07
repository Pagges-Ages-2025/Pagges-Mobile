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
  amigos: number;
}

const UserStats: React.FC<UserStatsProps> = ({
  kmLidos,
  livros,
  ranking,
  amigos,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const stats = [
    { label: "km lidos", value: kmLidos },
    { label: "livros", value: livros },
    { label: "ranking", value: ranking },
  ];
  function onPress() {}
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statContainer}>
          <NunitoText style={styles.value}>{stat.value}</NunitoText>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}

      <TouchableOpacity style={[styles.statContainer, {marginTop:3}]} onPress={onPress}>
        <Text style={styles.value}>{amigos}</Text>
        <NunitoText style={styles.label2}>amigos</NunitoText>
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

import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Section from "../components/section";
import { useTheme } from "../../../context/ThemeContext";

const ColorsSection = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const themeEntries = Object.entries(theme) as [string, string][];

  return (
    <Section
      title="Cores do Tema"
      isOpen={open}
      onToggle={() => setOpen(!open)}
      type="title"
    >
      <FlatList
        data={themeEntries}
        keyExtractor={([name]) => name}
        numColumns={4}
        renderItem={({ item: [name, color] }) => (
          <View style={styles.item}>
            <View style={[styles.colorBox, { backgroundColor: color }]} />
            <Text style={[styles.colorName, {color: theme.primaryText}]}>{name}</Text>
          </View>
        )}
        contentContainerStyle={styles.grid}
      />
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 16,
    padding: 8,
  },
  item: {
    alignItems: "center",
    margin: 8,
    width: 70,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorName: {
    marginTop: 6,
    fontSize: 10,
    textAlign: "center",
  },
});

export default ColorsSection;

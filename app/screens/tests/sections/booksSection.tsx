import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomBook from "../../../components/Book/CustomBook";
import Section from "../components/section";

const BooksSection = () => {
  const [open, setOpen] = useState({
    books: false,
    small: true,
    medium: true,
    large: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePress = () => {
    console.log("Livro clicado!");
  };

  return (
    <Section
      title="Livros"
      isOpen={open.books}
      onToggle={() => toggle("books")}
      type="title"
    >
      <Section
        title="Tamanho do livro (size) (small)"
        isOpen={open.small}
        onToggle={() => toggle("small")}
      >
        <View style={styles.grid}>
          <CustomBook size="small" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
          <CustomBook size="small" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
          <CustomBook size="small" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
        </View>
      </Section>
      <Section
        title="Tamanho do livro (size) (medium)"
        isOpen={open.medium}
        onToggle={() => toggle("medium")}
      >
        <View style={styles.grid}>
          <CustomBook size="medium" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
          <CustomBook size="medium" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
        </View>
      </Section>
      <Section
        title="Tamanho do livro (size) (large)"
        isOpen={open.large}
        onToggle={() => toggle("large")}
      >
        <View style={styles.grid}>
          <CustomBook size="large" onPress={handlePress} photoPath={"https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"} />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

export default BooksSection;

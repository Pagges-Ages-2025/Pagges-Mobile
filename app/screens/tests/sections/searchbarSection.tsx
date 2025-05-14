import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import BookSearch, { Book } from "../../../components/SearchBar/SearchBar";

const mockBooks: Book[] = [
  {
    id: 1,
    titulo: "O Senhor dos Anéis",
    autores: ["Tolkien"],
    capa: "",
    paginas: 200,
  },
  {
    id: 2,
    titulo: "Harry Potter",
    autores: ["J.K. Rowling"],
    capa: "",
    paginas: 200,
  },
  {
    id: 3,
    titulo: "Dom Casmurro",
    autores: ["Machado de Assis"],
    capa: "",
    paginas: 200,
  },
];

const SearchBarSection = () => {
  const [open, setOpen] = useState({
    searchbars: false,
    size: true,
    color: true,
    iconPosition: true,
    iconColor: true,
    borderRadius: true,
    border: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSelectBook = (book: Book) => {
    console.log("Livro selecionado:", book);
  };

  return (
    <Section
      title="SearchBar"
      isOpen={open.searchbars}
      onToggle={() => toggle("searchbars")}
      type="title"
    >
      <Section
        title="Tamanho (SearchSize)"
        isOpen={open.size}
        onToggle={() => toggle("size")}
      >
        <View style={styles.grid}>
          <BookSearch
            SearchSize="sm"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            SearchSize="md"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            SearchSize="lg"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>

      <Section
        title="Cor (color)"
        isOpen={open.color}
        onToggle={() => toggle("color")}
      >
        <View style={styles.grid}>
          <BookSearch
            color="primary"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            color="secondary"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>

      <Section
        title="Posição do ícone (iconPosition)"
        isOpen={open.iconPosition}
        onToggle={() => toggle("iconPosition")}
      >
        <View style={styles.grid}>
          <BookSearch
            iconPosition="left"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            iconPosition="right"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>

      <Section
        title="Cor do ícone (iconColor)"
        isOpen={open.iconColor}
        onToggle={() => toggle("iconColor")}
      >
        <View style={styles.grid}>
          <BookSearch
            iconColor="primary"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            iconColor="secondary"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            iconColor="grey"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>

      <Section
        title="Borda arredondada (borderRadius)"
        isOpen={open.borderRadius}
        onToggle={() => toggle("borderRadius")}
      >
        <View style={styles.grid}>
          <BookSearch
            borderRadius="lg"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            borderRadius="md"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            borderRadius="sm"
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>

      <Section
        title="Com ou sem borda (border)"
        isOpen={open.border}
        onToggle={() => toggle("border")}
      >
        <View style={styles.grid}>
          <BookSearch
            border={true}
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
          <BookSearch
            border={false}
            books={mockBooks}
            onSelectBook={handleSelectBook}
          />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    paddingVertical: 8,
  },
});

export default SearchBarSection;

import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BookSearch, { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import SearchAPI from "../services/googleAPIService";
import ModalBookDetails from "./book";

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleSearch = useCallback(
    async (term: string) => {
      setLoading(true);
      try {
        const results = await searchBooks(term);
        console.log("Search results:", results);

        // Garantir que os resultados estão no formato esperado pelo componente SearchBar
        // Se os resultados já forem retornados no formato esperado, esta etapa pode não ser necessária
        const formattedResults = Array.isArray(results) ? results : [];

        setBooks(formattedResults);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    },
    [searchBooks]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 1000), // Debounce de 1 segundo
    [handleSearch]
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={styles.content}>
        <BookSearch
          SearchSize="md"
          iconPosition="left"
          iconColor="grey"
          borderRadius="md"
          books={books}
          onSelectBook={handleSelectBook}
          onSearch={debouncedSearch}
        />
      </View>

      {selectedBook && (
        <ModalBookDetails
          visible={modalVisible}
          onClose={handleCloseModal}
          rating={4.0}
          title={selectedBook.titulo}
          pages={selectedBook.paginas || 0}
          synopsis={selectedBook.sinopse || "Sinopse não disponível"}
          review="Sem avaliações disponíveis ainda."
          authors={selectedBook.autores?.join(", ") || "Autor desconhecido"}
          year={selectedBook.anoDePublicacao?.substring(0, 4) || "Desconhecido"}
          id={selectedBook.id?.toString() || "0"}
          genre={selectedBook.generos?.[0] || "Gênero não especificado"}
          google_image_url={selectedBook.capa || ""}
          onCreateReview={() =>
            console.log("Criar resenha para:", selectedBook.titulo)
          }
          onShare={() => console.log("Compartilhar:", selectedBook.titulo)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    width: "90%",
    flex: 1,
    paddingTop: 30,
  },
});

export default SearchPage;

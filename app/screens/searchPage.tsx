import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearch, { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import SearchAPI from "../services/googleAPIService";
import ModalBookDetails from "./bookDetails";

import { SearchHistoryList } from "../components/SearchBar/SearchHistoryList";

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchHistory, setSearchHistory] = useState<Book[]>([]);


  const handleSearch = useCallback(
    async (term: string) => {
      setLoading(true);
      try {
        const results = await searchBooks(term);

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
    () => debounce(handleSearch, 800), // Debounce de 1 segundo
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
   // Coloca o livro pesquisado no histórico 
    if (book) {
    setSearchHistory(prev => [book, ...prev].slice(0, 15));
  }
    setModalVisible(true);
  };

  // Exclui um livro do histórico
  const handleDeleteHistoryItem = (index: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== index));
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

        {searchHistory.length > 0 ? (
          <SearchHistoryList
            history={searchHistory}
            onDeleteItem={handleDeleteHistoryItem}
          />
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.primaryText, fontSize: 16, textAlign: 'center' }}>
              Nenhuma pesquisa recente
            </Text>
          </View>
        )}
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

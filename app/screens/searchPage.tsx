import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearch, { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import SearchAPI from "../services/googleAPIService";
import ModalBookDetails from "./bookDetails";
import { router } from "expo-router";

import { SearchHistoryList } from "../components/SearchBar/SearchHistoryList";
import { registerBookInDatabase } from "../services/handle-select-book.service";
import { 
  loadSearchHistory, 
  addBookToSearchHistory, 
  removeBookFromSearchHistory,
  clearSearchHistory
} from "../services/search-history.service";

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showingResults, setShowingResults] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchHistory, setSearchHistory] = useState<Book[]>([]);

  // Carrega o histórico de pesquisas ao iniciar o componente
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const history = await loadSearchHistory();
        setSearchHistory(history);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    fetchSearchHistory();
  }, []);

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchQuery(term);
      setLoading(true);
      try {
        const results = await searchBooks(term);

        // Garantir que os resultados estão no formato esperado pelo componente SearchBar
        // Se os resultados já forem retornados no formato esperado, esta etapa pode não ser necessária
        const formattedResults = Array.isArray(results) ? results : [];

        setBooks(formattedResults);
        // Define que estamos mostrando resultados quando temos resultados e uma pesquisa não vazia
        setShowingResults(formattedResults.length > 0 && term.trim() !== "");
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        setBooks([]);
        setShowingResults(false);
      } finally {
        setLoading(false);
      }
    },
    [searchBooks]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 800), // Debounce de 800ms
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

  // Quando o campo de pesquisa fica vazio, esconde os resultados
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setShowingResults(false);
    }
  }, [searchQuery]);

  const handleSelectBook = async (book: Book) => {
    setSelectedBook(book);
    // Coloca o livro pesquisado no histórico
    if (book) {
      // Registra o livro no banco de dados da aplicação
      registerBookInDatabase(book);
      
      // Adiciona ao histórico de pesquisas local e no AsyncStorage
      try {
        const updatedHistory = await addBookToSearchHistory(book);
        setSearchHistory(updatedHistory);
      } catch (error) {
        console.error("Erro ao atualizar histórico:", error);
      }
    }
    setModalVisible(true);
  };

  // Exclui um livro do histórico
  const handleDeleteHistoryItem = async (index: number) => {
    try {
      const updatedHistory = await removeBookFromSearchHistory(index);
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error("Erro ao remover item do histórico:", error);
    }
  };

  // Limpa todo o histórico de pesquisas
  const handleClearSearchHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error("Erro ao limpar histórico de pesquisas:", error);
    }
  };

  // Manipula a seleção de um item do histórico
  const handleSelectHistoryItem = (text: string) => {
    setSearchQuery(text); // Atualiza o estado para refletir na SearchBar
    debouncedSearch(text); // Executa a pesquisa
  };

  // Função para esconder as sugestões e limpar a pesquisa
  const handleClearSearch = () => {
    setSearchQuery('');
    setBooks([]);
    setShowingResults(false);
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
          searchText={searchQuery} // Usa o estado searchQuery para controlar o texto da barra de pesquisa
        />

        {/* Mostra o histórico de pesquisas recentes apenas se não estivermos mostrando resultados */}
        {!showingResults && searchHistory.length > 0 ? (
          <SearchHistoryList
            history={searchHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onSelectItem={handleSelectHistoryItem}
            onClearHistory={handleClearSearchHistory}
          />
        ) : !showingResults ? (
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                color: theme.primaryText,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Nenhuma pesquisa recente
            </Text>
          </View>
        ) : null}
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
          onCreateReview={() => {
            // Fecha o modal e depois navega para a tela de criação
            handleCloseModal();
            
            // Dados do livro para passar para a tela de criação
            const bookData = {
              bookId: selectedBook.id?.toString() || "0",
              bookTitle: selectedBook.titulo,
              bookAuthors: selectedBook.autores?.join(", ") || "Autor desconhecido",
              bookCover: selectedBook.capa || ""
            };
            
            // Navega após um pequeno atraso para garantir que o modal foi fechado
            setTimeout(() => {
              console.log("SearchPage - Navegando para criação de resenha com:", bookData);
              
              // Usar router.replace para garantir uma navegação limpa
              router.replace({
                pathname: "/screens/createReviewComment",
                params: bookData
              });
            }, 500);
          }}
          onShare={() => console.log("Compartilhar:", selectedBook.titulo)}
          bookId={selectedBook.id}
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
    flexDirection: "column",
  },
});

export default SearchPage;
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBook from "../components/Book/CustomBook";
import CustomButton from "../components/Buttons/CustomButton";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import HomeCarouselSection from "../components/Home-Carousel/HomeCarousel";
import { Book } from "../components/SearchBar/SearchBar";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { Genre } from "../models/Genre";
import BooksService from "../services/booksService";
import { retriveAllGenres } from "../services/genres.service";
import ModalBookDetails from "./bookDetails";

const mockCards = [
  { id: "1", title: "Desafio Diário" },
  { id: "2", title: "Desafio Diário" },
  { id: "3", title: "Desafio Diário" },
];

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks, getFavoriteBasedBooks } = BooksService();
  const [trendingBooks, setTradingBooks] = useState<Book[]>();
  const [genreBasedBook, setGenreBasedBook] = useState<Book[]>();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGenreBasedBooks, setLoadingGenreBasedBooks] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  const handleSelectTrendingBook = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleGenrePressButton = useCallback(
    (genreId: number, genreName: string) => {
      if (isMounted) {
        router.push({
          pathname: "/screens/genreLibrary",
          params: { selectedGenreId: genreId, genreName: genreName },
        });
      }
    },
    [isMounted]
  );

  const fetchTrendingBooks = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getTrendingBooks();
      const formattedResults = Array.isArray(results) ? results : [];
      setTradingBooks(formattedResults);
    } catch (error) {
      console.error("Erro ao buscar livros em alta:", error);
      setTradingBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGenres = useCallback(async () => {
    setLoadingGenres(true);
    try {
      const response = await retriveAllGenres();
      console.log("response.data genres", response.data);
      setGenres(response.data);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
      setGenres([]);
    } finally {
      setLoadingGenres(false);
    }
  }, []);

  const fetchFavoriteBasedBooks = useCallback(async () => {
    setLoadingGenreBasedBooks(true);
    try {
      const results = await getFavoriteBasedBooks();
      setGenreBasedBook(results);
    } catch (error) {
      console.error("Erro ao buscar livros baseados nos favoritos:", error);
      setGenreBasedBook([]);
    } finally {
      setLoadingGenreBasedBooks(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsMounted(true);
      fetchTrendingBooks();
      fetchGenres();
      fetchFavoriteBasedBooks();

      return () => {
        setIsMounted(false);
      };
    }, [fetchTrendingBooks, fetchGenres, fetchFavoriteBasedBooks])
  );

  const handleSelectFavoriteBasedBook = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <ScrollView>
        <View style={styles.content}>
          <StaticSearchBar
            toRoute="/screens/searchPage"
            placeholder="Buscar Livro..."
          />

          <View style={styles.carouselContainer}>
            <HomeCarouselSection route={"/screens/challenges"} cards={mockCards} />
          </View>

          <NunitoText
            style={[
              styles.secondTitle,
              { paddingBottom: 0, color: theme.primaryText },
            ]}
          >
            Gêneros
          </NunitoText>
          <View style={styles.genreContent}>
            {loadingGenres ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <CustomCarousel
                isHorizontal
                data={genres.map((genre) => (
                  <CustomButton
                    key={genre.genre_id}
                    fontWeight={"semibold"}
                    size={"small"}
                    title={genre.genre_name}
                    onPress={() =>
                      handleGenrePressButton(genre.genre_id, genre.genre_name)
                    }
                  />
                ))}
              />
            )}
          </View>

          <NunitoText
            style={[
              styles.secondTitle,
              { paddingBottom: 15, color: theme.primaryText },
            ]}
          >
            Em alta
          </NunitoText>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : trendingBooks && trendingBooks.length > 0 ? (
            <CustomCarousel
              isHorizontal
              data={trendingBooks.map((book) => (
                <CustomBook
                  size="small"
                  key={book.id}
                  bookId={book.id}
                  photoPath={book.capa}
                  title={book.titulo}
                  author={book.autores.join(", ")}
                  onPress={() => handleSelectTrendingBook(book)}
                />
              ))}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <NunitoText
                style={[styles.emptyText, { color: theme.primaryText }]}
              >
                Nenhum livro em alta no momento
              </NunitoText>
            </View>
          )}

          <NunitoText
            style={[
              styles.secondTitle,
              { paddingBottom: 15, color: theme.primaryText },
            ]}
          >
            Com base nos seus favoritos
          </NunitoText>

          {loadingGenreBasedBooks ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : genreBasedBook && genreBasedBook.length > 0 ? (
            <CustomCarousel
              isHorizontal
              data={
                genreBasedBook
                  ? genreBasedBook.map((book) => (
                      <CustomBook
                        size="small"
                        key={book.id}
                        bookId={book.id}
                        photoPath={book.capa}
                        title={book.titulo}
                        author={book.autores.join(", ")}
                        onPress={() => handleSelectFavoriteBasedBook(book)}
                      />
                    ))
                  : []
              }
            />
          ) : (
            <NunitoText style={{ color: theme.secondaryText }}>
              Nenhum livro encontrado para os gêneros favoritos.
            </NunitoText>
          )}
        </View>

        {selectedBook && (
          <ModalBookDetails
            visible={modalVisible}
            onClose={handleCloseModal}
            title={selectedBook.titulo || "Título não disponível"}
            pages={selectedBook.paginas || 0}
            synopsis={selectedBook.sinopse || "Sinopse não disponível"}
            review="Sem avaliações disponíveis ainda."
            authors={selectedBook.autores?.join(", ") || "Autor desconhecido"}
            year={
              selectedBook.anoDePublicacao?.substring(0, 4) || "Desconhecido"
            }
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
                bookAuthors:
                  selectedBook.autores?.join(", ") || "Autor desconhecido",
                bookCover: selectedBook.capa || "",
              };

              // Navega após um pequeno atraso para garantir que o modal foi fechado
              setTimeout(() => {
                console.log(
                  "SearchPage - Navegando para criação de resenha com:",
                  bookData
                );

                // Usar router.replace para garantir uma navegação limpa
                router.replace({
                  pathname: "/screens/createReviewComment",
                  params: bookData,
                });
              }, 500);
            }}
            onShare={() => console.log("Compartilhar:", selectedBook.titulo)}
            bookId={selectedBook.id}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    flex: 1,
    paddingTop: 30,
    width: "90%",
  },
  carouselContainer: {
    paddingTop: 20,
  },
  genreContent: {
    paddingTop: 15,
  },
  secondTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 10,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default Home;

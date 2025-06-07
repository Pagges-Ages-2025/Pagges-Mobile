import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
  const { getTrendingBooks } = BooksService();
  const [trendingBooks, setTradingBooks] = useState<Book[]>();
  const [selectedTrendingBook, setSelectedTrendingBook] = useState<Book | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTrendingBook(null);
  };

  const handleSelectTrendingBook = (book: Book) => {
    setSelectedTrendingBook(book);
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
      console.log("response.data", response.data);
      setGenres(response.data);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
      setGenres([]);
    } finally {
      setLoadingGenres(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchTrendingBooks();
    fetchGenres();

    return () => {
      setIsMounted(false);
    };
  }, [fetchTrendingBooks, fetchGenres]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <ScrollView>
        <View style={styles.content}>
          <StaticSearchBar />

          <View style={styles.carouselContainer}>
            <HomeCarouselSection route={"/screens/home"} cards={mockCards} />
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
        </View>

        {selectedTrendingBook && (
          <ModalBookDetails
            visible={modalVisible}
            onClose={handleCloseModal}
            title={selectedTrendingBook.titulo || "Título não disponível"}
            pages={selectedTrendingBook.paginas || 0}
            synopsis={selectedTrendingBook.sinopse || "Sinopse não disponível"}
            review="Sem avaliações disponíveis ainda."
            authors={
              selectedTrendingBook.autores?.join(", ") || "Autor desconhecido"
            }
            year={
              selectedTrendingBook.anoDePublicacao?.substring(0, 4) ||
              "Desconhecido"
            }
            id={selectedTrendingBook.id?.toString() || "0"}
            genre={
              selectedTrendingBook.generos?.[0] || "Gênero não especificado"
            }
            google_image_url={selectedTrendingBook.capa || ""}
            onCreateReview={() =>
              console.log("Criar resenha para:", selectedTrendingBook.titulo)
            }
            onShare={() =>
              console.log("Compartilhar:", selectedTrendingBook.titulo)
            }
            bookId={selectedTrendingBook.id}
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

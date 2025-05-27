import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import HomeCarouselSection from "../components/Home-Carousel/HomeCarousel";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import ModalBookDetails from "./bookDetails";
import BooksService from "../services/booksService";
import { retriveUserGenres } from "../services/genres.service";
import SearchAPI from "../services/googleAPIService";

export interface Book {
  id: number;
  title: string;
  authors: string[];
  coverUrl: string;
  pages: number;
  publicationYear: string;
  genres: string[];
  synopsis?: string;
  avgRating?: number;
}

const mockCards = [
  { id: "1", title: "Desafio Diário" },
  { id: "2", title: "Desafio Diário" },
  { id: "3", title: "Desafio Diário" },
];

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks, getFavoriteBasedBooks } = BooksService();
  const [trendingBooks, setTradingBooks] = useState<Book[]>();
  const [favoriteBasedBook, setFavoriteBasedBook] = useState<Book[]>();
  const [selectedTrendingBook, setSelectedTrendingBook] = useState<Book | null>(null);
  const [selectedFavoriteBasedBook, setSelectedFavoriteBasedBook] = useState<Book | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { searchByGenre } = SearchAPI();

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTrendingBook(null);
  };

    const handleCloseFavoriteModal = () => {
    setModalVisible(false);
    setSelectedFavoriteBasedBook(null);
  };

  const handleSelectTrendingBook = (book: Book) => {
    setSelectedTrendingBook(book);
    setModalVisible(true);
  };

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

  useEffect(() => {
    fetchTrendingBooks();
  }, [fetchTrendingBooks]);

    const handleSelectFavoriteBasedBook = (book: Book) => {
    setSelectedFavoriteBasedBook(book);
    setModalVisible(true);
  };

    const fetchFavoriteBasedBooks = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getFavoriteBasedBooks();
      setFavoriteBasedBook(results);
    } catch (error) {
      console.error("Erro ao buscar livros baseados nos favoritos:", error);
      setFavoriteBasedBook([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingBooks();
    fetchFavoriteBasedBooks();
  }, [fetchTrendingBooks, fetchFavoriteBasedBooks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
      <ScrollView>
        <View style={styles.content}>
          <StaticSearchBar />

          <View style={styles.carouselContainer}>
            <HomeCarouselSection route={"/screens/home"} cards={mockCards} />
          </View>

          <NunitoText
            style={[
              styles.secondTitle,
              { paddingBottom: 15, color: theme.primaryText },
            ]}
          >
            Em alta
          </NunitoText>

          <CustomCarousel
            isHorizontal
            data={
              trendingBooks
                ? trendingBooks.map((book) => (
                    <CustomBook
                      size="small"
                      key={book.id}
                      bookId={book.id}
                      photoPath={book.coverUrl}
                      title={book.title}
                      author={book.authors.join(", ")}
                      onPress={() => handleSelectTrendingBook(book)}
                    />
                  ))
                : []
            }
          />

          <NunitoText
            style={[
              styles.secondTitle,
              { paddingBottom: 15, color: theme.primaryText },
            ]}
          >
            Com base nos seus favoritos
          </NunitoText>

          <CustomCarousel
            isHorizontal
            data={
              favoriteBasedBook
                ? favoriteBasedBook.map((book) => (
                    <CustomBook
                      size="medium"
                      key={book.id}
                      bookId={book.id}
                      photoPath={book.coverUrl}
                      title={book.title}
                      author={book.authors.join(", ")}
                      onPress={() => handleSelectFavoriteBasedBook(book)}
                    />
                  ))
                : []
            }
          />

        </View>

        {selectedTrendingBook && (
          <ModalBookDetails
            visible={modalVisible}
            onClose={handleCloseModal}
            rating={selectedTrendingBook.avgRating || 1}
            title={selectedTrendingBook.title || "Título não disponível"}
            pages={selectedTrendingBook.pages || 0}
            synopsis={selectedTrendingBook.synopsis || "Sinopse não disponível"}
            review="Sem avaliações disponíveis ainda."
            authors={selectedTrendingBook.authors?.join(", ") || "Autor desconhecido"}
            year={selectedTrendingBook.publicationYear?.substring(0, 4) || "Desconhecido"}
            id={selectedTrendingBook.id?.toString() || "0"}
            genre={selectedTrendingBook.genres?.[0] || "Gênero não especificado"}
            google_image_url={selectedTrendingBook.coverUrl || ""}
            onCreateReview={() =>
              console.log("Criar resenha para:", selectedTrendingBook.title)
            }
            onShare={() => console.log("Compartilhar:", selectedTrendingBook.title)}
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
  secondTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 10,
  },
});

export default Home;

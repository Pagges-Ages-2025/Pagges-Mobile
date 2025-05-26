import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import HomeCarouselSection from "../components/Home-Carousel/HomeCarousel";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import ModalBookDetails, { getBookWithRegisteredId } from "./bookDetails";
import BooksService from "../services/booksService";
import CustomButton from "../components/Buttons/CustomButton";
import { router } from "expo-router";
import { Book } from "../components/SearchBar/SearchBar";

const mockCards = [
  { id: "1", title: "Desafio Diário" },
  { id: "2", title: "Desafio Diário" },
  { id: "3", title: "Desafio Diário" },
];
const gener = [
  "Terror",
  "Romance",
  "Família",
  "Noir",
  "Ficção Científica",
  "Histórico",
];
const genres = gener.map((item) => (
  <CustomButton
    key={item}
    fontWeight={"semibold"}
    size={"small"}
    title={item}
    onPress={() =>
      router.push({
        pathname: "/screens/genreLibrary",
        params: { selectedGenre: item },
      })
    }
  ></CustomButton>
));

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks } = BooksService();
  const [trendingBooks, setTradingBooks] = useState<Book[]>();
  const [selectedTrendingBook, setSelectedTrendingBook] = useState<Book | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTrendingBook(null);
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
            <CustomCarousel isHorizontal data={genres} />
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

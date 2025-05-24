import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import ModalBookDetails from "./bookDetails";
import BooksService from "../services/booksService";

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

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks } = BooksService();
  const [ trendingBooks, setTradingBooks ] = useState<Book[]>();
  const [ selectedTrendingBook, setSelectedTrendingBook ] = useState<Book | null>(null);
  const [ modalVisible, setModalVisible ] = useState(false);
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
    }   finally {
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
      <View style={styles.content}>
        <StaticSearchBar />
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
          data={trendingBooks ? trendingBooks.map((book) => (
              <CustomBook
                size="small"
                key={book.id}
                bookId={book.id}
                photoPath={book.coverUrl}
                title={book.title}
                author={book.authors.join(", ")}
                onPress={() => handleSelectTrendingBook(book)}
              />
           )) : []}
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
   secondTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 10,
  },
});

export default Home;

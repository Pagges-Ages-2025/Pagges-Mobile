import React, { use, useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import ModalBookDetails from "./book";
import BooksService from "../services/booksService";

export interface Book {
  id: number;
  titulo: string;
  autores: string[];
  capa: string;
  paginas: number;
  anoDePublicacao: string;
  generos: string[];
  sinopse?: string;
}

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks } = BooksService();
  const [ trendingBooks, setTrendingBookds ] = useState<Book[]>();
  const [ selectedTrendingBook, setSelectedTrendingBook ] = useState<Book | null>(null);
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
      setTrendingBookds(formattedResults);
    } catch (error) {
      console.error("Erro ao buscar livros em alta:", error);
      setTrendingBookds([]);
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
                photoPath={book.capa}
                title={book.titulo}
                author={book.autores.join(", ")}
                onPress={() => handleSelectTrendingBook(book)}
              />
           )) : []}
         />
      </View>
          {selectedTrendingBook && (
              <ModalBookDetails
                visible={modalVisible}
                onClose={handleCloseModal}
                rating={4.0}
                title={selectedTrendingBook.titulo}
                pages={selectedTrendingBook.paginas || 0}
                synopsis={selectedTrendingBook.sinopse || "Sinopse não disponível"}
                review="Sem avaliações disponíveis ainda."
                authors={selectedTrendingBook.autores?.join(", ") || "Autor desconhecido"}
                year={selectedTrendingBook.anoDePublicacao?.substring(0, 4) || "Desconhecido"}
                id={selectedTrendingBook.id?.toString() || "0"}
                genre={selectedTrendingBook.generos?.[0] || "Gênero não especificado"}
                google_image_url={selectedTrendingBook.capa || ""}
                onCreateReview={() =>
                  console.log("Criar resenha para:", selectedTrendingBook.titulo)
                }
                onShare={() => console.log("Compartilhar:", selectedTrendingBook.titulo)}
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

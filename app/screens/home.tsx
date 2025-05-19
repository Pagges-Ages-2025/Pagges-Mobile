import React, { use, useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import { useTheme } from "../context/ThemeContext";
import NunitoText from "../components/Texts/NunitoText";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";

import { router } from "expo-router";
import ModalBookDetails from "./book";
import SearchAPI from "../services/googleAPIService";

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
const initialBooks: Book[] = [
  {
    id: 1,
    titulo: "O Hobbit",
    autores: ["J.R.R. Tolkien"],
    capa: "", 
    paginas: 310,
    anoDePublicacao: "1937",
    generos: ["Fantasia", "Aventura"],
    sinopse: "A aventura de Bilbo Bolseiro pela Terra Média.",
  },
  {
    id: 2,
    titulo: "1984",
    autores: ["George Orwell"],
    capa: "",
    paginas: 328,
    anoDePublicacao: "1949",
    generos: ["Ficção Científica", "Distopia"],
    sinopse: "Um clássico distópico sobre vigilância e controle.",
  },
  {
    id: 3,
    titulo: "Dom Casmurro",
    autores: ["Machado de Assis"],
    capa: "",
    paginas: 256,
    anoDePublicacao: "1899",
    generos: ["Romance", "Literatura Brasileira"],
    sinopse: "Um retrato psicológico sobre ciúmes e memórias.",
  },
];



const Home: React.FC = () => {
  const { theme } = useTheme();
  const { getTrendingBooks } = SearchAPI();
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
                Livros em alta
                </NunitoText>
                <CustomCarousel
                  isHorizontal
                  data={trendingBooks ? trendingBooks.map((book) => (
                     <CustomBook
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

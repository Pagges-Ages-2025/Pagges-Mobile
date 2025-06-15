import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBook from "../components/Book/CustomBook";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { DatabaseBookModel } from "../models/DatabaseBook.model";
import BooksService from "../services/booksService";
import ModalBookDetails from "./bookDetails";

interface LibraryProps {
  onClose?: () => void;
  pageIndex?: number;
}

const Library: React.FC<LibraryProps> = ({ onClose, pageIndex = 0 }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPageIndex = params.pageIndex
    ? Number(params.pageIndex)
    : pageIndex;
  const selectedGenreId = Number(params.selectedGenreId);
  const selectedGenreName = params.genreName;
  const [actualPage] = useState(initialPageIndex);
  const [books, setBooks] = useState<DatabaseBookModel[]>([]);
  const [selectedBook, setSelectedBook] = useState<DatabaseBookModel>();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(actualPage)).current;
  const slideOutAnim = useRef(new Animated.Value(0)).current;
  const { getBooksByGenre } = BooksService();

  const handleClose = () => {
    console.log(router);
    Animated.timing(slideOutAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(undefined);
  };

  const fetchBooks = async (genreId: number) => {
    try {
      const databaseBooksBySelectedGenre = await getBooksByGenre(genreId);
      setBooks(databaseBooksBySelectedGenre);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setBooks([]);
        setLoading(false);
      } else {
        console.error(`Erro ao buscar livros do genero ${genreId}:`, error);
        setLoading(false);
      }
    }
  };

  // Inicializa a animação com o valor correto quando o componente é montado
  useEffect(() => {
    slideAnim.setValue(initialPageIndex);
  }, []);

  const handleSelectBook = (book: DatabaseBookModel) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  useEffect(() => {
    if (selectedBook) {
      console.log("Livro selecionado:", selectedBook);
    }
  }, [selectedBook]);

  useEffect(() => {
    fetchBooks(selectedGenreId);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.Background,
        },
        {
          transform: [
            {
              translateY: slideOutAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000],
              }),
            },
          ],
        },
      ]}
    >
      {/* header */}
      <View style={styles.headerPage}>
        <TouchableOpacity
          onPress={handleClose}
          style={[
            styles.circleButton,
            { zIndex: 999 }, // Número alto = na frente
          ]}
        >
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={theme.primaryText}
          />
        </TouchableOpacity>

        <NunitoText
          style={[
            styles.headerTitle,
            {
              color: theme.quinaryText,
              zIndex: 1,
            },
          ]}
        >
          {selectedGenreName}
        </NunitoText>
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ flex: 1 }}
          nestedScrollEnabled
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginLeft: 10, marginTop: 20 }}
              />
            ) : books.length > 0 ? (
              books.map((book) => (
                <React.Fragment key={book.book_id}>
                  <View style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
                    <CustomBook
                      size={"small"}
                      photoPath={book.google_image_url}
                      onPress={() => handleSelectBook(book)}
                      bookId={book.book_id}
                    />
                    <NunitoText
                      style={{
                        fontSize: 14,
                        maxWidth: 100,
                        textAlign: "center",
                        color: theme.quinaryText,
                        fontWeight: "bold",
                      }}
                    >
                      {book.title}
                    </NunitoText>
                    <NunitoText
                      style={{
                        paddingTop: 5,
                        fontSize: 12,
                        maxWidth: 100,
                        textAlign: "center",
                        color: theme.quinaryText,
                        fontWeight: "bold",
                      }}
                    >
                      {book.authors}
                    </NunitoText>
                  </View>
                </React.Fragment>
              ))
            ) : (
              <View style={styles.centered}>
                <View
                  style={{
                    paddingBottom: 10,
                    height: 500,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NunitoText
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: theme.quinaryText,
                    }}
                  >
                    Nenhum livro de {selectedGenreName} encontrado...
                  </NunitoText>
                </View>
              </View>
            )}

            {selectedBook && (
              <ModalBookDetails
                visible={modalVisible}
                onClose={handleCloseModal}
                title={selectedBook.title || "Título não disponível"}
                pages={selectedBook.pages || 0}
                synopsis={selectedBook.synopsis || "Sinopse não disponível"}
                review="Sem avaliações disponíveis ainda."
                authors={selectedBook.authors || "Autor desconhecido"}
                year={
                  selectedBook.year
                    ? String(selectedBook.year).substring(0, 4)
                    : "Desconhecido"
                }
                id={selectedBook.book_id?.toString() || "0"}
                genre={
                  Array.isArray(params.genreName)
                    ? params.genreName[0]
                    : params.genreName || "Gênero não especificado"
                }
                google_image_url={selectedBook.google_image_url || ""}
                onCreateReview={() => {
                  // Fecha o modal e depois navega para a tela de criação
                  handleCloseModal();

                  // Dados do livro para passar para a tela de criação
                  const bookData = {
                    bookId: selectedBook.book_id?.toString() || "0",
                    bookTitle: selectedBook.title,
                    bookAuthors: selectedBook.authors || "Autor desconhecido",
                    bookCover: selectedBook.google_image_url || "",
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
                onShare={() => console.log("Compartilhar:", selectedBook.title)}
                bookId={selectedBook.book_id}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Library;

const styles = StyleSheet.create({
  activeTab: {
    fontWeight: "bold",
  },
  barContainer: {
    alignItems: "center",
    height: 2,
    justifyContent: "center",
    marginBottom: 15,
    position: "relative",
    width: "90%",
  },
  button: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  circleButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  headerPage: {
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    justifyContent: "flex-start",
    marginTop: 80,
    paddingHorizontal: 20,
    position: "relative",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    left: 0,
    position: "absolute",
    right: 0,
    textAlign: "center",
    width: "auto",
  },
  onTopBar: {
    alignItems: "center",
    backgroundColor: "#9D0F54",
    borderRadius: 1.5,
    bottom: 0,
    height: 3,
    justifyContent: "center",
    position: "absolute",
  },
  scrollContent: {
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingTop: 30,
    width: "90%",
  },

  textTabs: {
    fontSize: 20,
    textAlign: "center",
  },
});

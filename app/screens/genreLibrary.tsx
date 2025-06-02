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
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(actualPage)).current;
  const slideOutAnim = useRef(new Animated.Value(0)).current;
  const { getBooksByGenre } = BooksService();

  const handleClose = () => {
    Animated.timing(slideOutAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
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
        <TouchableOpacity onPress={handleClose} style={[styles.circleButton]}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={theme.primaryText}
            style={{ paddingRight: 20 }}
          />
        </TouchableOpacity>

        <View style={{ paddingLeft: "13%" }}>
          <NunitoText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.quinaryText,
            }}
          >
            {selectedGenreName}
          </NunitoText>
        </View>
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
    position: "relative",
    width: "90%",
    marginBottom: 15,
  },
  button: {
    alignItems: "center",
    paddingBottom: 10,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  circleButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    paddingLeft: 3,
    width: 40,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  headerPage: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 80,
    paddingLeft: 30,
    width: "100%",
  },
  onTopBar: {
    alignItems: "center",
    backgroundColor: "#9D0F54",
    bottom: 0,
    height: 3,
    justifyContent: "center",
    position: "absolute",
    borderRadius: 1.5,
  },
  tabs: {
    flexDirection: "row",
    paddingTop: 30,
    width: "90%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textTabs: {
    fontSize: 20,
    textAlign: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

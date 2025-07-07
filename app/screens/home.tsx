import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
import ChallangesAPI from "../services/challanges";
import { retriveAllGenres } from "../services/genres.service";
import UserAPI from "../services/profileService";
import ModalBookDetails from "./bookDetails";

// Import background images
import communityBg from "../assets/images/community-bg.png";
import dailyChallengeBg from "../assets/images/daily-challenge-background.png";
import libraryBg from "../assets/images/library-bg.png";
import rankingBg from "../assets/images/ranking-bg.png";

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

  // User statistics and challenge data
  const [userStats, setUserStats] = useState<{
    readBooks: number;
    readKms: number;
  } | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(false);

  // Ref to track if data has been loaded
  const dataLoadedRef = useRef(false);

  // Dynamic carousel cards with real data
  const [homeCarouselCards, setHomeCarouselCards] = useState([
    {
      id: "1",
      title: "Desafio Diário",
      subtitle: "Ganhe pontos respondendo perguntas sobre livros",
      route: "/screens/challenges",
      icon: "🎯",
      backgroundImage: dailyChallengeBg,
    },
    {
      id: "2",
      title: "Comunidade",
      subtitle: "Conecte-se com outros leitores",
      route: "/screens/social",
      icon: "👥",
      backgroundImage: communityBg,
    },
    {
      id: "3",
      title: "Ranking",
      subtitle: "Veja quem está no topo",
      route: "/screens/generalRanking",
      icon: "🏆",
      backgroundImage: rankingBg,
    },
    {
      id: "4",
      title: "Minha Biblioteca",
      subtitle: "Acesse seus livros favoritos",
      route: "/screens/personalLibrary",
      icon: "📚",
      backgroundImage: libraryBg,
    },
  ]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  const handleSelectTrendingBook = (book: Book) => {
    console.log("Selected trending book:", book);
    console.log("Book genres:", book.generos);
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleGenrePressButton = useCallback(
    (genreId: number, genreName: string) => {
      router.push({
        pathname: "/screens/genreLibrary",
        params: { selectedGenreId: genreId, genreName: genreName },
      });
    },
    []
  );

  const fetchUserStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [statsResponse, correctAnswersResponse] = await Promise.all([
        UserAPI().getUserStatistics(),
        ChallangesAPI().getUserCorrects(),
      ]);

      setUserStats(statsResponse);
      setCorrectAnswers(correctAnswersResponse);

      // Update carousel cards with real data
      setHomeCarouselCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === "1") {
            return {
              ...card,
              subtitle: `${correctAnswersResponse} respostas corretas • Ganhe mais pontos!`,
            };
          }
          if (card.id === "4") {
            return {
              ...card,
              subtitle: `${statsResponse.readBooks} livros lidos • ${statsResponse.readKms}km percorridos`,
            };
          }
          return card;
        })
      );
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

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
  }, [getTrendingBooks]);

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
  }, [getFavoriteBasedBooks]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      // Only fetch data if not already loaded
      if (!dataLoadedRef.current) {
        const fetchData = async () => {
          try {
            await Promise.all([
              fetchTrendingBooks(),
              fetchGenres(),
              fetchFavoriteBasedBooks(),
              fetchUserStats(),
            ]);
          } catch (error) {
            console.error("Error fetching home data:", error);
          }
        };

        fetchData();
        dataLoadedRef.current = true;
      }

      return () => {
        mounted = false;
      };
    }, [
      fetchTrendingBooks,
      fetchGenres,
      fetchFavoriteBasedBooks,
      fetchUserStats,
    ])
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
            <HomeCarouselSection cards={homeCarouselCards} />
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
            genre={
              selectedBook.generos && selectedBook.generos.length > 0
                ? selectedBook.generos[0]
                : "Gênero não especificado"
            }
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

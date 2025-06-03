/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-inline-styles */
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBook from "../components/Book/CustomBook";
import { SinopseExpandable } from "../components/Book/sinopseExpandable";
import CustomButton from "../components/Buttons/CustomButton";
import CustomCarousel from "../components/Carousel/CustomHomeCarousel";
import RatingModal from "../components/RatingModal/RatingModal";
import { ReviewComment } from "../components/review-comments/review-comments";
import { Book } from "../components/SearchBar/SearchBar";
import StaticStars from "../components/StaticStars/StaticStars";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import BooksService from "../services/booksService";
import { registerBookInDatabase } from "../services/handle-select-book.service";
import PersonalLibraryService from "../services/personalLibraryService";
import { Post } from "../models/Post";
import PostService from "../services/postService";
interface ModalBookDetailsProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  pages?: number;
  readersNumber?: number;
  rankingNumber?: string;
  synopsis: string;
  review: string;
  authors?: string;
  year?: string;
  id: string;
  genre?: string;
  google_image_url?: string;
  onCreateReview?: () => void;
  onShare?: () => void;
  bookId: number; // ID Autogerado do banco de dados
}

export default function ModalBookDetails({
  visible,
  onClose,
  title,
  readersNumber = 1000,
  pages,
  rankingNumber = "10",
  synopsis,
  review,
  authors,
  year,
  id,
  genre,
  google_image_url,
  onCreateReview,
  onShare,
  bookId,
}: ModalBookDetailsProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [bookPosts, setBookPosts] = useState<Post[]>([]);
  const PostAPI = PostService();

  useEffect(() => {
    const fetchBookPosts = async () => {
      PostAPI.fetchBookPosts(id).then((response: Post[]) => {
        setBookPosts(response);
      });
    };
    fetchBookPosts();
  }, [id]);

  const childPost = (parentId: number) => {
    return bookPosts
      .filter((post) => post.parentId === parentId)
      .map((post) => (
        <ReviewComment
          text={post.text}
          photoPostAuthor={post.googleImageUrl}
          fullNamePostAuthor={post.username}
          likesNumber={post.likedBy}
          datePost={
            typeof post.createdAt === "string"
              ? post.createdAt
              : new Date(post.createdAt).toLocaleDateString()
          }
          repostNumber={0}
          commentsNumber={0}
        />
      ));
  };

  const updateAverageRating = () => {
    try {
      console.log("updateAverageRating:", bookId);
      BooksService()
        .getAverageRating(bookId)
        .then((response) => {
          console.log("Média de avaliação:", response);
          setAverageRating(response);
        });
    } catch (error) {
      console.error("Erro ao buscar média de avaliação:", error);
    }
  };

  useEffect(() => {
    updateAverageRating();
  }, []);

  const updateBookState = async (bookId: number, state: string) => {
    try {
      const response = await PersonalLibraryService().addBookToLibrary(
        bookId,
        state
      );

      if (response.status === 200) {
        console.log(`Adicionado a ${state} da biblioteca pessoal`);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            `Livro adicionado com sucesso à sua biblioteca`,
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert(
            "Sucesso",
            `Livro adicionado com sucesso à sua biblioteca`
          );
        }
      } else {
        console.error(`Erro ao adicionar livro com estado ${state}:`);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Erro ao adicionar livro à biblioteca",
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível adicionar o livro à biblioteca"
          );
        }
      }
    } catch (error) {
      console.error(`Erro ao adicionar livro (${state}):`, error);
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Erro ao adicionar livro à biblioteca",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o livro à biblioteca");
      }
    }
  };

  const handleBackPress = () => {
    onClose();
  };

  const handleCreateReview = () => {
    if (onCreateReview) {
      onCreateReview();
    } else {
      console.log("Tentando abrir tela de criação de resenha");
      // Fechar o modal e liberar recursos imediatamente
      onClose();

      // Tentar navegação direta depois de um delay para garantir que o modal foi fechado
      setTimeout(() => {
        try {
          console.log("Navegando para tela de criação de resenha");
          // Usar router.navigate porque o push pode estar preservando o histórico de navegação
          router.push("/screens/createReviewComment");
        } catch (error) {
          console.error("Falha na navegação:", error);
          // Alternativa de navegação em caso de falha
          router.replace("/screens/home");
        }
      }, 700); // Aumentar o delay para dar mais tempo para o modal fechar
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      console.log("Share action");
    }
  };

  const bookStats = [
    { value: readersNumber, label: "Leitores" },
    { value: pages, label: "Páginas" },
    { value: averageRating?.toFixed(1), label: "Avaliação" },
    { value: `#${rankingNumber}`, label: "Ranking" },
  ];

  const bookActions = [
    {
      label: "Já li",
      onPress: async () => {
        console.log("Ação: Já li");
        await updateBookState(bookId, "READ");
      },
    },
    {
      label: "Lendo",
      onPress: async () => {
        console.log("Ação: Estou lendo");
        await updateBookState(bookId, "READING");
      },
    },
    {
      label: "Quero ler",
      onPress: async () => {
        console.log("Ação: Quero ler");
        await updateBookState(bookId, "TO_BE_READ");
      },
    },
  ];

  const BookContent = () => {
    const [coverImageError, setCoverImageError] = useState(false);

    const processGoogleImageUrl = (url: string | undefined) => {
      if (!url) return undefined;

      try {
        // Ajusta parametros de URL para melhor qualidade e compatibilidade
        let processedUrl = url;

        // Remove parametros que podem causar problemas
        if (url.includes("&edge=curl")) {
          processedUrl = processedUrl.replace("&edge=curl", "");
        }

        // Garante que a URL usa HTTPS
        if (processedUrl.startsWith("http:")) {
          processedUrl = processedUrl.replace("http:", "https:");
        }

        return processedUrl;
      } catch (error) {
        console.error("Erro ao processar URL da imagem:", error);
        return url;
      }
    };

    const optimizedImageUrl = processGoogleImageUrl(google_image_url);
    const coverImage =
      !coverImageError && optimizedImageUrl
        ? { uri: optimizedImageUrl }
        : require("../assets/images/book-cover.png");

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={coverImage}
          style={styles.backgroundImage}
          onError={(e) => {
            setCoverImageError(true);
          }}
        >
          <View style={styles.overlay} />
          <View
            style={{
              flex: 1,
              paddingTop: 24,
              paddingStart: 24,
              paddingEnd: 24,
            }}
          >
            <View style={styles.bookContentContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 0,
                }}
              >
                <TouchableOpacity onPress={handleBackPress}>
                  <Ionicons
                    name="return-up-back-outline"
                    size={30}
                    color={theme.white}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={handleCreateReview}
                  style={{
                    borderRadius: 15,
                    backgroundColor: theme.primary,
                    width: "35%",
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginRight: 10,
                  }}
                >
                  <NunitoText
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: theme.white,
                    }}
                  >
                    Criar Resenha
                  </NunitoText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                  <AntDesign name="export" size={24} color={theme.white} />
                </TouchableOpacity>
              </View>

              <NunitoText style={[styles.title, { color: theme.white }]}>
                {title.length > 40
                  ? title.substring(0, 40).trim() + "..."
                  : title}
              </NunitoText>
              <NunitoText style={[styles.subtitle, { color: theme.white }]}>
                {authors
                  ? authors.length > 30
                    ? authors.substring(0, 30).trim + "..."
                    : authors
                  : "Autor desconhecido"}
              </NunitoText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <NunitoText style={[styles.date, { color: theme.white }]}>
                  {year}
                </NunitoText>
                <NunitoText
                  style={{ color: theme.white, paddingHorizontal: 10 }}
                >
                  {" "}
                  -{" "}
                </NunitoText>
                <NunitoText style={[styles.gender, { color: theme.white }]}>
                  {genre}
                </NunitoText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <View style={styles.starsContainer}>
                  <StaticStars
                    rating={Math.round(averageRating)}
                    onPress={() => {
                      setModalVisible(true);
                    }}
                  />
                  <RatingModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onRate={() => {
                      updateAverageRating();
                      setModalVisible(false);
                    }}
                    book={title}
                    bookId={Number(id)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    borderRadius: 15,
                    backgroundColor: theme.primary,
                    width: "35%",
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginRight: 10,
                  }}
                >
                  <NunitoText
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: theme.white,
                    }}
                  >
                    Avaliar
                  </NunitoText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView
            style={{
              flex: 2,
              flexGrow: 2,
              backgroundColor: theme.Background,
              paddingStart: 24,
              paddingEnd: 24,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View style={styles.bookNumbersContainer}>
              {bookStats.map((stat, index) => (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NunitoText
                    style={[styles.bookNumbers, { color: theme.primaryText }]}
                  >
                    {stat.value}
                  </NunitoText>
                  <NunitoText
                    style={[
                      styles.bookNumbersTitle,
                      { color: theme.primaryText },
                    ]}
                  >
                    {stat.label}
                  </NunitoText>
                </View>
              ))}
            </View>

            <View style={styles.statusBookContainer}>
              {bookActions.map((action, index) => (
                <View style={{ flex: 1 }}>
                  <CustomButton
                    size="small"
                    containerStyle={{ flex: 1 }}
                    key={index}
                    title={action.label}
                    onPress={action.onPress}
                  />
                </View>
              ))}
            </View>

            <SinopseExpandable synopsis={synopsis} />

            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <NunitoText
                style={[
                  styles.secondTitle,
                  { paddingBottom: 25, color: theme.primaryText },
                ]}
              >
                Principais Resenhas e Comentários
              </NunitoText>
              {bookPosts
                .filter((post) => !post.parentId)
                .map((post) => (
                  <View style={{ backgroundColor: "#1a1919" }}>
                    <ReviewComment
                      text={post.text}
                      photoPostAuthor={post.profileImage}
                      fullNamePostAuthor={post.username}
                      likesNumber={post.likedBy}
                      datePost={
                        typeof post.createdAt === "string"
                          ? post.createdAt
                          : new Date(post.createdAt).toLocaleDateString()
                      }
                      repostNumber={0}
                      commentsNumber={bookPosts.map((p) => p.parentId).length}
                    />
                    {childPost(post.postId)}
                  </View>
                ))}
            </View>

            <NunitoText
              style={[
                styles.secondTitle,
                { paddingBottom: 15, color: theme.primaryText },
              ]}
            >
              Livros do mesmo autor
            </NunitoText>
            <CustomCarousel
              isHorizontal
              data={[
                <CustomBook
                  key={1}
                  bookId={0}
                  photoPath={require("../assets/images/book-cover.png")}
                />,
              ]}
            />

            <View style={{ marginBottom: 15 }}></View>

            <NunitoText
              style={[
                styles.secondTitle,
                { paddingBottom: 15, color: theme.primaryText },
              ]}
            >
              Livros semelhantes
            </NunitoText>
            <CustomCarousel
              isHorizontal
              data={[
                <CustomBook
                  key={1}
                  bookId={0}
                  photoPath={require("../assets/images/book-cover.png")}
                />,
              ]}
            />

            <View style={{ marginBottom: 500 }}></View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose || router.replace("/screens/searchPage")}
    >
      <BookContent />
    </Modal>
  );
}

export async function getBookWithRegisteredId(
  book: Book,
  callback: (book: Book) => void
) {
  const registerdBook = await registerBookInDatabase(book);

  const bookWithRegisteredId = {
    ...book,
    id: registerdBook.book_id,
  };

  callback(bookWithRegisteredId);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "normal",
    marginBottom: 8,
  },
  date: {
    fontSize: 15,
    fontWeight: "normal",
  },
  gender: {
    fontSize: 15,
    fontWeight: "normal",
    marginRight: 10,
  },
  starsContainer: {
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 5,
  },
  bookContentContainer: {
    flex: 1,
  },
  bookNumbers: {
    fontSize: 19,
    fontWeight: "bold",
  },
  bookNumbersTitle: {
    fontSize: 14,
    fontWeight: "regular",
  },
  bookNumbersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 44,
  },
  secondTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 10,
  },
  sinopseText: {
    fontSize: 14,
    fontWeight: "regular",
    paddingRight: 35,
    textAlign: "justify",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
  },
  showMoreAndLess: {
    fontSize: 14,
    paddingLeft: 30,
    paddingTop: 10,
  },
  moreAndLessButton: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingBottom: 20,
  },
  statusBookContainer: {
    flex: 1,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
});

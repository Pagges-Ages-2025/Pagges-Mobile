/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-inline-styles */
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBook from "../components/Book/CustomBook";
import { SinopseExpandable } from "../components/Book/sinopseExpandable";
import CustomButton from "../components/Buttons/CustomButton";
import CustomCarousel from "../components/Carousel/CustomHomeCarousel";
import SuccessModal from "../components/Modals/SuccessModal";
import RatingModal from "../components/RatingModal/RatingModal";
import { ReviewComment } from "../components/review-comments/review-comments";
import { Book } from "../components/SearchBar/SearchBar";
import StaticStars from "../components/StaticStars/StaticStars";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { Post } from "../models/Post";
import BooksService from "../services/booksService";
import { registerBookInDatabase } from "../services/handle-select-book.service";
import PersonalLibraryService from "../services/personalLibraryService";
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
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalData, setSuccessModalData] = useState({
    title: "",
    description: "",
  });
  const [averageRating, setAverageRating] = useState(0);
  const [bookPosts, setBookPosts] = useState<Post[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<number[]>([]);
  const PostAPI = PostService();

  useEffect(() => {
    const fetchBookPosts = async () => {
      try {
        const response = await PostAPI.fetchBookPosts(id);
        setBookPosts(response);
      } catch (error) {
        console.error("Erro ao buscar posts do livro:", error);
        setBookPosts([]);
      }
    };
    fetchBookPosts();
  }, [id]);

  function findPostById(posts: Post[], postId: number): Post | undefined {
    for (const post of posts) {
      if (post.postId === postId) return post;
      if (post.child) {
        const found = findPostById(post.child, postId);
        if (found) return found;
      }
    }
    return undefined;
  }

  const togglePostExpansion = useCallback(
    async (postId: number) => {
      console.log("togglePostExpansion called with postId:", postId);
      const post = findPostById(bookPosts, postId);
      console.log("Found post:", post);

      if (!post) {
        console.log(`Post with ID ${postId} not found`);
        return;
      }

      // If already loading, don't do anything
      if (loadingPosts.includes(postId)) {
        return;
      }

      if (post.child && post.child.length > 0) {
        console.log(
          `Post ${postId} already has ${post.child.length} children, toggling expansion`
        );
        setExpandedPosts((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev.filter((id) => id !== postId), postId]
        );
        return;
      }

      console.log("Fetching children for postId:", post.postId);

      // Add to loading state
      setLoadingPosts((prev) => [...prev, postId]);

      try {
        const response = await PostAPI.getPostsByParentId(post.postId);
        console.log("Fetched children:", response);

        if (response.length === 0) {
          console.log(`No children found for post ${post.postId}`);
          // Still toggle expansion to show that there are no children
          setExpandedPosts((prev) =>
            prev.includes(postId)
              ? prev.filter((id) => id !== postId)
              : [...prev.filter((id) => id !== postId), postId]
          );
          return;
        }

        function updatePostChildren(posts: Post[]): Post[] {
          return posts.map((p) => {
            if (p.postId === postId) {
              return { ...p, child: response };
            } else if (p.child) {
              return { ...p, child: updatePostChildren(p.child) };
            } else {
              return p;
            }
          });
        }
        setBookPosts((prevPosts) => updatePostChildren(prevPosts));

        setExpandedPosts((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev.filter((id) => id !== postId), postId]
        );
      } catch (error) {
        console.error(
          `Error fetching children for post ${post.postId}:`,
          error
        );
        // Don't toggle expansion on error
      } finally {
        // Remove from loading state
        setLoadingPosts((prev) => prev.filter((id) => id !== postId));
      }
    },
    [bookPosts, loadingPosts, PostAPI]
  );

  const childPost = useCallback(
    (parentId: number) => {
      const parent = findPostById(bookPosts, parentId);
      if (!parent || !parent.child) return null;
      return parent.child.map((post: Post) => (
        <View
          key={`child-${post.postId}-${expandedPosts.includes(post.postId)}`}
          style={styles.childCommentContainer}
        >
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
            commentsNumber={post.comments}
            onPress={() => togglePostExpansion(post.postId)}
            loading={loadingPosts.includes(post.postId)}
          />
          {expandedPosts.includes(post.postId) && (
            <View style={styles.nestedChildContainer}>
              {childPost(post.postId)}
            </View>
          )}
        </View>
      ));
    },
    [bookPosts, expandedPosts, loadingPosts, togglePostExpansion]
  );

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
      if (response.status === 201) {
        console.log(
          `Atualizado o estado dolivro para ${state} da biblioteca pessoal`,
          {
            data: response.data,
          }
        );

        // Show success modal with appropriate message based on state
        let modalTitle = "Sucesso!";
        let description = "";

        switch (state) {
          case "READ":
            description = `"${title}" foi adicionado à sua lista de livros já lidos!`;
            break;
          case "READING":
            description = `"${title}" foi adicionado à sua lista de livros em leitura!`;
            break;
          case "TO_BE_READ":
            description = `"${title}" foi adicionado à sua lista de livros para ler!`;
            break;
          default:
            description = `Livro atualizado com sucesso!`;
        }

        setSuccessModalData({ title: modalTitle, description });
        setSuccessModalVisible(true);
      }
    } catch (error) {
      console.log(`Erro ao adicionar livro (${state}):`, error);
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
                  marginBottom: 45,
                }}
              >
                <TouchableOpacity onPress={handleBackPress}>
                  <Ionicons
                    name="return-up-back-outline"
                    size={30}
                    color={theme.white}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    display: "flex",
                    gap: 20,
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    title="Criar Resenha"
                    onPress={handleCreateReview}
                    size="small"
                    type={"primary"}
                    fullWidth={false}
                    width={"50%"}
                    height={25}
                  />
                  <TouchableOpacity onPress={handleShare}>
                    <AntDesign name="export" size={24} color={theme.white} />
                  </TouchableOpacity>
                </View>
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
                <CustomButton
                  title="Avaliar"
                  onPress={() => setModalVisible(true)}
                  size="small"
                  type={"primary"}
                  fullWidth={false}
                  width={"37%"}
                  height={25}
                />
              </View>
            </View>
          </View>
          <ScrollView
            key={`scroll-${expandedPosts.length}`}
            style={{
              flex: 2,
              flexGrow: 2,
              backgroundColor: theme.Background,
              paddingStart: 24,
              paddingEnd: 24,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
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
                <View key={index} style={{ flex: 1 }}>
                  <CustomButton
                    size="small"
                    containerStyle={{ flex: 1 }}
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

              {bookPosts.length === 0 ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                  }}
                >
                  <NunitoText
                    style={[styles.noPostsText, { color: theme.secondaryText }]}
                  >
                    Este livro ainda não tem publicações
                  </NunitoText>
                </View>
              ) : (
                bookPosts
                  .filter((post) => !post.parentId)
                  .map((post) => (
                    <View
                      key={`post-${post.postId}-${expandedPosts.includes(post.postId)}`}
                      style={{ width: "100%" }}
                    >
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
                        commentsNumber={post.comments}
                        onPress={() => togglePostExpansion(post.postId)}
                        loading={loadingPosts.includes(post.postId)}
                      />
                      {expandedPosts.includes(post.postId) && (
                        <View style={styles.nestedChildContainer}>
                          {childPost(post.postId)}
                        </View>
                      )}
                    </View>
                  ))
              )}
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
      presentationStyle="pageSheet"
      onRequestClose={onClose || router.replace("/screens/searchPage")}
    >
      <BookContent />
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={successModalData.title}
        description={successModalData.description}
      />
    </Modal>
  );
}

export async function getBookWithRegisteredId(book: Book): Promise<Book> {
  try {
    const registeredBook = await registerBookInDatabase(book);
    return {
      ...book,
      id: registeredBook.book_id,
    };
  } catch (error) {
    console.error("Error registering book in database:", error);
    // Return the original book if registration fails
    return book;
  }
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  noPostsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  childCommentContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  nestedChildContainer: {
    marginLeft: 20,
    width: "90%",
    alignSelf: "flex-start",
    flex: 1,
  },
});

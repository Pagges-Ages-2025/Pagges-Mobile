import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import CheckBoxOptions from "../components/checkbox/CheckBoxOptions";
import CancelPostButtons from "../components/review-comments/cancel-post-buttons";
import SelectBook from "../components/review-comments/select-book";
import ReviewTextField from "../components/ReviewTextField/ReviewTextField";
import { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import { User } from "../models/User";
import PostService from "../services/postService";
import UserAPI from "../services/profileService";
import { base64Uri } from "../utils/imageUtils";

// Interface estendida para suportar ambos os formatos de livro
interface ExtendedBook extends Book {
  title?: string;
  google_image_url?: string;
  authors?: string;
}

export default function CreateReviewCommentScreen() {
  const [reviewText, setReviewText] = useState("");
  const [selectedBook, setSelectedBook] = useState<ExtendedBook | null>(null);
  const [isReviewChecked, setIsReviewChecked] = useState(true);
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = PostService();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [data, setData] = useState<User>();

  const fetchProfile = async () => {
    UserAPI()
      .getProfile()
      .then((response: User) => {
        setData(response);
      })
      .catch((error: any) => {});
  };

  // Usar useMemo para processar o livro a partir dos parâmetros apenas quando params mudar
  const bookFromParams = useMemo(() => {
    if (!params.bookId || !params.bookTitle) {
      return null;
    }

    const authorStr = params.bookAuthors ? String(params.bookAuthors) : "";

    return {
      id: Number(params.bookId),
      title: String(params.bookTitle),
      authors: authorStr,
      google_image_url: params.bookCover ? String(params.bookCover) : undefined,
      titulo: String(params.bookTitle),
      autores: authorStr ? [authorStr] : [],
      capa: params.bookCover ? String(params.bookCover) : "",
      paginas: 0,
      anoDePublicacao: "",
      generos: [],
    } as ExtendedBook;
  }, [params.bookId, params.bookTitle, params.bookAuthors, params.bookCover]);

  // Definir o livro selecionado apenas uma vez quando bookFromParams mudar
  useEffect(() => {
    if (bookFromParams && !selectedBook) {
      setSelectedBook(bookFromParams);
    }
    fetchProfile();
  }, [bookFromParams, selectedBook]);

  const handlePublish = async () => {
    if (!reviewText.trim() || !selectedBook) return;
    setIsLoading(true);

    try {
      const newPost = {
        book_id: selectedBook.id,
        is_spoiler: isSpoilerChecked,
        text: reviewText,
        is_review: isReviewChecked,
      };

      await createPost(newPost);

      // Limpa os campos após sucesso
      setReviewText("");
      setIsReviewChecked(false);
      setIsSpoilerChecked(false);

      // Show success alert instead of modal for testing
      Alert.alert(
        "Resenha Publicada!",
        "Sua resenha foi publicada com sucesso e agora está visível no seu perfil.",
        [
          {
            text: "Ver Perfil",
            onPress: () => router.push("/screens/profile"),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { theme } = useTheme();

  const backgroundColor = theme.Background;
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <CancelPostButtons
          onPost={handlePublish}
          cancelScreen="searchPage"
          isLoading={isLoading}
        />
      </View>

      <ReviewTextField
        value={reviewText}
        onChangeText={setReviewText}
        profileImage={
          data?.profileImage ? base64Uri(data.profileImage) : undefined
        }
      />

      <SelectBook
        onSelectBook={(book) => setSelectedBook(book)}
        initialBook={selectedBook}
      />

      <View style={styles.options}>
        <CheckBoxOptions
          isReviewChecked={isReviewChecked}
          isSpoilerChecked={isSpoilerChecked}
          onReviewChange={setIsReviewChecked}
          onSpoilerChange={setIsSpoilerChecked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  options: {
    paddingTop: 5,
    paddingBottom: 15,
  },
});

import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CheckBoxOptions from "../components/checkbox/CheckBoxOptions";
import CancelPostButtons from "../components/review-comments/cancel-post-buttons";
import SelectBook from "../components/review-comments/select-book";
import ReviewTextField from "../components/ReviewTextField/ReviewTextField";
import { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import PostService from "../services/postService";

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

  console.log("CreateReviewCommentScreen renderizada");
  
  // Usar useMemo para processar o livro a partir dos parâmetros apenas quando params mudar
  const bookFromParams = useMemo(() => {
    console.log("Processando parâmetros do livro");
    
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
      generos: []
    } as ExtendedBook;
  }, [params.bookId, params.bookTitle, params.bookAuthors, params.bookCover]);
  
  // Definir o livro selecionado apenas uma vez quando bookFromParams mudar
  useEffect(() => {
    if (bookFromParams && !selectedBook) {
      console.log("Definindo livro selecionado a partir dos parâmetros");
      setSelectedBook(bookFromParams);
    }
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

      console.log("Enviando post:", newPost);
      await createPost(newPost);

      // Limpa os campos após sucesso
      setReviewText("");
      setIsReviewChecked(false);
      setIsSpoilerChecked(false);
      
      // Navega para a tela home após o post ser publicado com sucesso
      router.replace("/screens/home");
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

      <ReviewTextField value={reviewText} onChangeText={setReviewText} />

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

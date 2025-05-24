import { View, StyleSheet } from "react-native";
import CancelPostButtons from "../components/review-comments/cancel-post-buttons";
import ReviewTextField from "../components/ReviewTextField/ReviewTextField";
import SelectBook from "../components/review-comments/select-book";
import CheckBoxOptions from "../components/checkbox/CheckBoxOptions";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import PostService from "../services/postService";
import { Book } from "../components/SearchBar/SearchBar";

export default function CreateReviewCommentScreen() {
  const [reviewText, setReviewText] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReviewChecked, setIsReviewChecked] = useState(true);
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = PostService();

  const handlePublish = async () => {
    if (!reviewText.trim() || !selectedBook) return;
    setIsLoading(true);

    console.log(selectedBook.id);
    try {
      const newPost = {
        book_id: 1,
        is_spoiler: isSpoilerChecked,
        text: reviewText,
        is_review: isReviewChecked,
      };

      await createPost(newPost);

      // Limpa os campos após sucesso
      setReviewText("");
      setIsReviewChecked(false);
      setIsSpoilerChecked(false);
      // setSelectedBook(null); // se usar
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

      <SelectBook onSelectBook={(book) => setSelectedBook(book)} />

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
    paddingTop: 30,
    paddingBottom: 20,
  },
  options: {
    paddingTop: 5,
    paddingBottom: 15,
  },
});

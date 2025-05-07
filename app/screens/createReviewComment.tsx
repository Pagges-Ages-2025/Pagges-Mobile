import { View, StyleSheet } from "react-native";
import CancelPostButtons from "../components/review-comments/cancel-post-buttons";
import ReviewTextField from "../components/ReviewTextField/ReviewTextField";
import SelectBook from "../components/review-comments/select-book";
import CheckBoxOptions from "../components/checkbox/CheckBoxOptions";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CreateReviewCommentScreen() {
  const [reviewText, setReviewText] = useState("");
  const [isReviewChecked, setIsReviewChecked] = useState(true);
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = () => {
    if (!reviewText.trim()) return;
    setIsLoading(true);

    // Simula publicação (2s)
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você pode exibir uma Toast, Alert ou navegação
      setReviewText("");
      setIsReviewChecked(false);
      setIsSpoilerChecked(false);
    }, 2000);
  };

  const { theme } = useTheme();

  const backgroundColor = theme.Background;
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <CancelPostButtons
          onPost={handlePublish}
          cancelScreen="searchPage" // ou "book", dependendo do fluxo desejado
        />
      </View>

      <ReviewTextField value={reviewText} onChangeText={setReviewText} />

      <SelectBook />

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
  header:{
   paddingTop: 30,
   paddingBottom: 20
  },
  options:{
    paddingTop: 5,
    paddingBottom: 15
  }
});

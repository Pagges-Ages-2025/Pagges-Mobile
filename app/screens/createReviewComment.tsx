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
      <CancelPostButtons
        onPost={handlePublish}
        cancelScreen="searchPage" // ou "book", dependendo do fluxo desejado
      />

      <ReviewTextField value={reviewText} onChangeText={setReviewText} />

      <SelectBook />

      <CheckBoxOptions
        isReviewChecked={isReviewChecked}
        isSpoilerChecked={isSpoilerChecked}
        onReviewChange={setIsReviewChecked}
        onSpoilerChange={setIsSpoilerChecked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/app/constants/Theme";
import StarRating from "../StarRating/StarRating";
import BooksService from "@/app/services/booksService";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  book: string;
  bookId: number;
  onRate?: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  book,
  bookId,
  onRate,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [rating, setRating] = useState(0);

  const handleRate = async (bookId: number, rating: number) => {
    try {
      console.log("Avaliando livro:", bookId, rating);
      await BooksService().RateBook(bookId, rating);
      if (onRate) {
        onRate();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao avaliar:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Avalie o livro</Text>
          <Text style={styles.bookName}>{book}</Text>

          <StarRating stars={rating} onPressStar={(starIndex) => setRating(starIndex)} />

          <Text style={styles.infoText}>
            Sua avaliação será somada com as demais na nota do livro
          </Text>

          <TouchableOpacity style={styles.button} onPress={async () => {
            try {
              await handleRate(bookId, rating);
              onClose();
            } catch (error) {
            console.error("Erro ao avaliar:", error);
            }
            }}>
            <Text style={styles.buttonText}>Avaliar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "#00000066",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      width: 300,
      backgroundColor: theme.Background,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      position: "relative",
    },
    title: {
      fontWeight: "bold",
      fontSize: 14,
      color: theme.textColorReview,
      marginBottom: 5,
    },
    bookName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.primaryText,
      marginBottom: 15,
    },
    infoText: {
      fontSize: 10,
      color: theme.textColorReview || "#666",
      textAlign: "center",
      marginVertical: 15,
    },
    button: {
      backgroundColor: theme.primary || "#800040",
      paddingVertical: 10,
      paddingHorizontal: 100,
      borderRadius: 15,
      marginTop: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 15,
      zIndex: 1,
    },
    closeText: {
      fontSize: 20,
      color: "#aaa",
    },
  });

export default RatingModal;

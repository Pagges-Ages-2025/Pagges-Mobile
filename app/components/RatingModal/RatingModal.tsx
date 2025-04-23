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
//import StarRating from "../components/StarRating";
//<StarRating rating={rating} onChange={setRating} />

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onRate: () => void;
  bookName: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onRate,
  bookName,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [rating, setRating] = useState(0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Avalie o livro</Text>
          <Text style={styles.bookName}>{bookName}</Text>

          

          <Text style={styles.infoText}>
            Sua avaliação será somada com as demais na nota do livro
          </Text>

          <TouchableOpacity style={styles.button} onPress={onRate}>
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
      fontSize: 16,
      color: theme.primaryText,
      marginBottom: 5,
    },
    bookName: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.primary,
      marginBottom: 15,
    },
    infoText: {
      fontSize: 12,
      color: theme.secondaryText || "#666",
      textAlign: "center",
      marginVertical: 15,
    },
    button: {
      backgroundColor: theme.primary || "#800040",
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 30,
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

import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Image,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type BookSize = "small" | "medium" | "large";

interface CustomBookProps {
  size?: BookSize;
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  photoPath: string;
  bookId?: number; // tirar ? na versao final
}

const CustomBook: React.FC<CustomBookProps> = ({
  size = "medium",
  title,
  onPress,
  containerStyle,
  photoPath = "https://placehold.co/600x400",
  bookId,
}) => {
  const { theme, themeName } = useTheme();


  // Tamanho do Botão
  const sizeStyles = {
    small: {
        height: 150,
        width: 100,
    },
    medium: {
      height: 200,
      width: 140,
    },
    large: {
        height: 260,
        width: 180,
    },
  }[size];
  

  return (
    <TouchableOpacity
      style={[styles.baseBook, containerStyle, sizeStyles]}
      onPress={onPress}
      activeOpacity={0.8}
    >
        <Image source={{uri:photoPath}} style={styles.bookPhoto}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBook: {
    backgroundColor:"blue",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  baseText: {
    textAlign: "center",
  },
  bookPhoto:{
    width:"100%",
    height: "100%"
  }
});

export default CustomBook;

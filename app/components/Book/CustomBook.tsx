import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Image,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type BookSize = "small" | "medium" | "large" | "search";

interface CustomBookProps {
  size?: BookSize;
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  photoPath: string;
  bookId: number;
  toPersonalLibrary?: boolean;
  author?: string;
}

const CustomBook: React.FC<CustomBookProps> = ({
  size = "medium",
  title,
  onPress,
  photoPath = "https://placehold.co/600x400",
  bookId,
  toPersonalLibrary,
  author,
}) => {
  const { theme } = useTheme();

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
    search: {
      height: 80,
    },
  }[size];

  const titleStyle = size === "search" ? styles.searchTitle : styles.baseText;

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={[
          size === "search" ? styles.baseSearch : styles.baseBook,
          sizeStyles,
          {
            backgroundColor:
              size === "search" ? theme.Background : theme.placeholder,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: photoPath }}
          style={size === "search" ? styles.searchBookPhoto : styles.bookPhoto}
        />

        {/* if it is not a personal library, add the text inside */}
        {!toPersonalLibrary && title && (
          <Text style={[titleStyle, { color: theme.primaryText }]}>{title}</Text>
        )}
      </TouchableOpacity>

      {/* If it is a personal library, it adds the text below */}
      {toPersonalLibrary && (
        <>
          {title && (
            <Text style={[styles.bookTitle, { color: theme.secondaryText }]}>
              {/* {title} */}
              {title.substring(0, 12)}
            </Text>
          )}
          {author && (
            <Text style={[styles.bookAuthor, { color: theme.secondaryText }]}>
              {/* {author} */}
              {author.substring(0, 15)}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  baseBook: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  baseSearch: {
    alignItems: "center",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    paddingLeft: 10,
  },
  baseText: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
    position: "absolute",
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  searchTitle: {
    fontSize: 14,
    width: "100%",
    color: "black",
  },
  bookPhoto: {
    width: "100%",
    height: "100%",
  },
  searchBookPhoto: {
    width: 45,
    height: 70,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 12,
    // color: "#666",
    marginTop: 5,
    textAlign: "center",
    fontWeight: "regular",
  },
});

export default CustomBook;

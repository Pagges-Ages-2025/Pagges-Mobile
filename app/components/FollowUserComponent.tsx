import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "./Buttons/CustomButton";
import { Ionicons } from "@expo/vector-icons";

interface FollowUserComponentProps {
  imageUrl: string;
  userName: string;
  isFollowing: boolean;
  onFollowChange: (newState: boolean) => void;
}

export default function FollowUserComponent({
  imageUrl,
  userName,
  isFollowing,
  onFollowChange,
}: FollowUserComponentProps) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      {!imageError && isValidUrl(imageUrl) ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.userImage}
          onError={(e) => {
            console.log("Erro ao carregar imagem:", e.nativeEvent.error);
            setImageError(true);
          }}
        />
      ) : (
        <View style={[styles.userImage, styles.placeholderImage]}>
          <Ionicons name="person" size={24} color={theme.primaryText} />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.primaryText }]}>@{userName}</Text>
      </View>
      <CustomButton
        title={isFollowing ? "Deixar de seguir" : "Seguir"}
        type={isFollowing ? "outlined" : "primary"}
        onPress={() => onFollowChange(!isFollowing)}
        fullWidth={false}
        height={30}
        width={175}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  placeholderImage: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
}); 
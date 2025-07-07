import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SocialAPI from "../../services/socialService";
import CustomButton from "../Buttons/CustomButton";

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
  const [isLoading, setIsLoading] = useState(false);
  const [localIsFollowingState, setLocalIsFollowingState] =
    useState(isFollowing);
  const socialAPI = SocialAPI();

  const handleFollowChange = async (newState: boolean) => {
    try {
      setIsLoading(true);
      if (newState) {
        await socialAPI.followUser(userName);
      } else {
        await socialAPI.unfollowUser(userName);
      }
      setLocalIsFollowingState(newState);
      onFollowChange(newState);
    } catch (error) {
      console.error("Error changing follow state:", error);
      Alert.alert(
        "Erro",
        `Não foi possível ${newState ? "seguir" : "deixar de seguir"} o usuário. Tente novamente.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePress = () => {
    router.push({
      pathname: "/screens/thirdPersonProfile",
      params: { username: userName },
    });
  };

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
      <TouchableOpacity
        style={styles.userInfoContainer}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
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
          <Text style={[styles.userName, { color: theme.primaryText }]}>
            @{userName}
          </Text>
        </View>
      </TouchableOpacity>
      <CustomButton
        title={localIsFollowingState ? "Deixar de seguir" : "Seguir"}
        type={localIsFollowingState ? "outlined" : "primary"}
        onPress={() => handleFollowChange(!localIsFollowingState)}
        fullWidth={false}
        height={30}
        width={175}
        isDisabled={isLoading}
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
  userInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

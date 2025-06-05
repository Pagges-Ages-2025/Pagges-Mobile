// src/components/User/CustomUser.tsx
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface CustomUserProps {
  username: string;
  profile_image: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function CustomUser({
    username,
  profile_image,
  onPress,
}: CustomUserProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {profile_image ? (
        <Image source={{ uri: profile_image }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholderAvatar}>
          <Text style={styles.placeholderText}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{username}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

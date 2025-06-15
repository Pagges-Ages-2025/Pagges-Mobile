import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import { useTheme } from "../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

import FollowUser from "../components/Follow-User/FollowUserComponent";
import { UserFollower } from "../models/UserFollower";
import SocialService from "../services/socialService";
import { FlatList } from "react-native-gesture-handler";
import { base64Uri } from "../utils/imageUtils";

const Followers: React.FC = () => {
  const { otherUserId } = useLocalSearchParams();

  const { theme, themeName } = useTheme();

  const [followers, setFollowers] = useState<UserFollower[]>();

  const loadFollower = async () => {
    try {
      if (otherUserId == null) {
        const data = await SocialService().getUserFollowers();
        setFollowers(data);
      } else {
        const data = await SocialService().getFollowersFromOtherUser(
          Number(otherUserId)
        );
        setFollowers(data);
      }
    } catch {}
  };

  useEffect(() => {
    loadFollower();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={styles.containerView}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={themeName === "dark" ? theme.white : theme.black}
            onPress={router.back}
          />
        </TouchableOpacity>
        <NunitoText
          style={[
            styles.h1,
            { color: themeName === "dark" ? theme.white : theme.primary },
          ]}
        >
          {Strings.followersPage}
        </NunitoText>
      </View>

      {followers && (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={followers}
          renderItem={({ item }) => {
            return (
              <FollowUser
                userName={item.username}
                imageUrl={item.profileImage ? base64Uri(item.profileImage) : ""}
                isFollowing={item.imFollowing}
                onFollowChange={() => {}}
              />
            );
          }}
        ></FlatList>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 28,
    fontWeight: "900",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  containerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  genreList: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 15,
    justifyContent: "center",
    paddingBottom: 20,
  },
  buttonWrapper: {
    alignSelf: "center",
    width: 250,
    bottom: 40,
    marginTop: 50,
  },
});

function showErrorModal(title: string, message: string, type: string) {
  console.warn(`[${type.toUpperCase()}] ${title}: ${message}`);
}

export default Followers;

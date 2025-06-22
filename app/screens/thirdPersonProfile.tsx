import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Biography from "../components/Biography/Biography";
import ProfileHeader from "../components/Profile/ProfileHeader";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";
import { User } from "../models/User";
import UserAPI from "../services/profileService";
import { base64Uri } from "../utils/imageUtils";

import { Ionicons } from "@expo/vector-icons";
import AchievementsGrid from "../components/Achievements/AchievementsGrid";
import PostCard from "../components/Cards/PostCard";
import NunitoText from "../components/Texts/NunitoText";
import { Genre } from "../models/Genre";
import { Post } from "../models/Post";
import PostService from "../services/postService";
import SocialAPI from "../services/socialService";

export default function ThirdPersonProfileScreen() {
  const [data, setData] = useState<User>();
  const { theme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userGenres, setUserGenres] = useState<Genre[]>([]);
  const { username } = useLocalSearchParams();
  const [offSetFollowers, setOffSetFollowers] = useState<number>(0);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const PostAPI = PostService();

  const thirdPersonUsername = useMemo(
    () => (Array.isArray(username) ? username[0] : username),
    [username]
  );
  const [stats, setStats] = useState<{ readBooks: number; readKms: number }>({
    readBooks: 0,
    readKms: 0,
  });

  const onPressFollow = () => {
    if (isFollowing) {
      SocialAPI()
        .unfollowUser(thirdPersonUsername)
        .then(() => {
          const x = 1;
          setIsFollowing(!isFollowing);
          setOffSetFollowers((prev) => prev - 1);
        })
        .catch((error: any) => {
          console.error("Error unfollowing user:", error);
        });
    } else {
      SocialAPI()
        .followUser(thirdPersonUsername)
        .then(() => {
          setIsFollowing(!isFollowing);
          setOffSetFollowers((prev) => prev + 1);
        })
        .catch((error: any) => {
          console.error("Error following user:", error);
        });
    }
  };

  const fetchThirdPersonProfile = async () => {
    UserAPI()
      .getThirdPersonProfile(thirdPersonUsername)
      .then((response: User) => {
        setData(response);
        setUserGenres(response.favoriteGenres);
        setStats({
          readBooks: response.readBooks,
          readKms: response.readKm,
        });
        setOffSetFollowers(response?.friendsNumber ?? 0);
      })
      .catch((error: any) => {
        console.error("Erro ao buscar perfil:", error);
      });
  };

  const fetchIsFollowingUser = async () => {
    SocialAPI()
      .isFollowing(thirdPersonUsername)
      .then((response: boolean) => {
        setIsFollowing(response);
      });
  };

  const fetchProfilePosts = async () => {
    try {
      const response = await PostAPI.getPostsByUsername(thirdPersonUsername);
      setProfilePosts(response);
    } catch (error) {
      console.error("Erro ao buscar posts do perfil:", error);
    }
  };

  useEffect(() => {
    fetchThirdPersonProfile();
    fetchIsFollowingUser();
    fetchProfilePosts();
  }, [username]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.Background }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton}>
        <Ionicons
          name="return-up-back-outline"
          size={30}
          color={theme.black}
          onPress={router.back}
        />
      </TouchableOpacity>

      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <ProfileHeader
          marginStart={30}
          profileImageUrl={
            data?.profileImage ? base64Uri(data.profileImage) : undefined
          }
          name={data?.name || "Perfil"}
          isAuthor={data?.isAuthor || false}
          genres={userGenres}
          bEdit={false}
          isEditMode={false}
          following={isFollowing}
          onPressFollow={onPressFollow}
          onPressEditGenres={() => {}}
        />

        <View style={styles.statsContainer}>
          <UserStats
            kmLidos={stats.readKms}
            livros={stats.readBooks}
            ranking={data?.ranking_position || 0}
            seguidores={offSetFollowers}
            onSeguidoresClick={() => {
              router.push({
                pathname: "/screens/followers",
                params: { otherUserId: data?.id },
              });
            }}
          />
        </View>
        <View style={styles.biographyContainer}>
          <Biography
            biographyText={data?.biography || ""}
            onBioChange={() => {}}
          />
        </View>

        <View style={styles.achievementContainer}>
          <AchievementsGrid />
        </View>

        <View style={styles.postsContainer}>
          <NunitoText style={[styles.postsTitle, { color: theme.primaryText }]}>
            Posts de {data?.name || "Usuário"}
          </NunitoText>
          {profilePosts.map((post, index) => (
            <View key={post.postId} style={styles.postItem}>
              <PostCard
                title={post.title ? post.title : ""}
                subtitle={post.text}
                bookcover={post.googleImageUrl}
                username={data?.name || "Usuário"}
                profileImage={data?.profileImage}
                bSpoiler={post.isSpoiler || false}
                repost={0}
                likes={post.likedBy}
                comments={post.comments}
                onPressUser={() => {
                  // This is already the user's profile page, so no navigation needed
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 20,
    top: 40,
    zIndex: 1000,
  },
  achievementContainer: {
    marginBottom: 15,
    marginHorizontal: 30,
    marginTop: 10,
  },
  biographyContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  libraryTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  libraryTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  postsContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  postItem: {
    marginBottom: 20,
  },
  statsContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
});

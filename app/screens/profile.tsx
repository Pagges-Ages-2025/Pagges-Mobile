import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import UserAPI from "@/app/services/profileService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Achievement from "../components/Achievements/Achievement";
import Biography from "../components/Biography/Biography";
import CustomButton from "../components/Buttons/CustomButton";
import NunitoText from "../components/Texts/NunitoText";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";
import { Genre } from "../models/Genre";
import axiosInstance from "../services/axios-instance-singleton";
import { base64Uri } from "../utils/imageUtils";
import { Post } from "../models/Post";
import PostService from "../services/postService";
import PostCard from "../components/Cards/PostCard";
import { ReviewComment } from "../components/review-comments/review-comments";

const getToken = async () => {
  const userToken = await AsyncStorage.getItem("userToken");
  return userToken;
};

export default function ProfileScreen() {
  const [data, setData] = useState<User>();
  const [userGenres, setUserGenres] = useState<Genre[]>([]);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const { theme } = useTheme();
  const router = useRouter();
  const PostAPI = PostService();

  const [stats, setStats] = useState<{ readBooks: number; readKms: number }>({
    readBooks: 0,
    readKms: 0,
  });

  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const fetchUserGenres = async () => {
    try {
      const response = await axiosInstance.get("/user-genres/user");
      setUserGenres(response.data.data);
      console.log("Gêneros atualizados:", response.data.data);
    } catch (error) {
      console.error("Erro ao buscar os gêneros do usuário:", error);
    }
  };

  useEffect(() => {
    const fetchProfilePosts = async () => {
      const userToken = await getToken();
      try {
        const response = await PostAPI.getPostsByProfile();
        setProfilePosts(response);
      } catch (error) {
        console.error("Erro ao buscar posts do perfil:", error);
      }
    };
    fetchProfilePosts();
  }, []);

  const fetchProfile = async () => {
    UserAPI()
      .getProfile()
      .then((response: User) => {
        setData(response);
      })
      .catch((error: any) => {});
  };

  const fetchStats = async () => {
    UserAPI()
      .getUserStatistics()
      .then((response: { readBooks: number; readKms: number }) => {
        setStats(response);
      })
      .catch((error: any) => {});
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchStats();
      fetchUserGenres();
    }, [])
  );

  const handleEditProfile = async () => {
    const token = await getToken();

    if (token && data) {
      router.push({
        pathname: "/screens/editProfile",
        params: {
          userToken: token,
          profileName: data.name,
          profileBiography: data.biography ?? "",
        },
      });
    }
  };

  const handleConfig = async () => {
    router.push({
      pathname: "/screens/configuration",
    });
  };

  const navigateToLibrary = (tabIndex: number) => {
    router.push({
      pathname: "/screens/personalLibrary",
      params: { pageIndex: tabIndex },
    });
  };

  const handleBioChange = async (newBio: string) => {
    UserAPI()
      .updateBio(newBio)
      .then((response: User) => {
        console.log("Bio atualizada com sucesso:", response); // TODO: notificar usuário com mensagem na tela
      })
      .catch((error) => {
        console.error("Erro ao atualizar bio:", error);
      });
  };

  function findPostById(posts: Post[], postId: number): Post | undefined {
    for (const post of posts) {
      if (post.postId === postId) return post;
      if (post.child) {
        const found = findPostById(post.child, postId);
        if (found) return found;
      }
    }
    return undefined;
  }

  const togglePostExpansion = async (postId: number) => {
    const post = findPostById(profilePosts, postId);
    if (post && !post.child) {
      const response = await PostAPI.getPostsByParentId(post.postId);
      function updatePostChildren(posts: Post[]): Post[] {
        return posts.map((p) => {
          if (p.postId === postId) {
            return { ...p, child: response };
          } else if (p.child) {
            return { ...p, child: updatePostChildren(p.child) };
          } else {
            return p;
          }
        });
      }
      setProfilePosts((prevPosts) => updatePostChildren(prevPosts));
    }
    setExpandedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev.filter((id) => id !== postId), postId]
    );
  };

  const childPost = (parentId: number) => {
    const parent = findPostById(profilePosts, parentId);
    if (!parent || !parent.child) return null;
    return parent.child.map((post: Post) => (
      <View key={post.postId}>
        <ReviewComment
          text={post.text}
          photoPostAuthor={post.googleImageUrl}
          fullNamePostAuthor={post.username}
          likesNumber={post.likedBy}
          datePost={
            typeof post.createdAt === "string"
              ? post.createdAt
              : new Date(post.createdAt).toLocaleDateString()
          }
          repostNumber={0}
          commentsNumber={post.comments}
          onPress={() => togglePostExpansion(post.postId)}
        />
        {expandedPosts.includes(post.postId) && (
          <View style={{ marginLeft: 20 }}>
            {childPost(post.postId)}
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.Background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <ProfileHeader
          marginStart={30}
          profileImageUrl={
            data?.profileImage ? base64Uri(data.profileImage) : undefined
          }
          name={data?.name || "Seu Perfil"}
          isAuthor={data?.isAuthor || false}
          genres={userGenres}
          bEdit={true}
          onPressEdit={handleEditProfile}
          bConfig={true}
          onPressConfig={handleConfig}
          isEditMode={false}
          onPressEditGenres={() =>
            router.push({
              pathname: "/screens/favoriteGenre",
              params: { from: "edit" },
            })
          }
        />

        <View style={styles.statsContainer}>
          <UserStats
            // kmLidos={data?.readKm || 0}
            kmLidos={stats.readKms}
            livros={stats.readBooks}
            ranking={data?.ranking_position || 0}
            seguidores={data?.friendsNumber || 0}
            onSeguidoresClick={() => {
              router.push({
                pathname: "/screens/followers",
                params: { otherUserId: null },
              });
            }}
          />
        </View>
        <View style={styles.biographyContainer}>
          <Biography
            biographyText={data?.biography || ""}
            onBioChange={handleBioChange}
          />
        </View>

        {/* Biblioteca pessoal buttons - Now placed above achievements */}
        <View style={styles.libraryButtonsContainer}>
          <NunitoText
            style={[styles.libraryTitle, { color: theme.primaryText }]}
          >
            Biblioteca Pessoal
          </NunitoText>

          <View style={styles.libraryTabsContainer}>
            <CustomButton
              title={"Quero Ler"}
              onPress={() => navigateToLibrary(0)}
              fullWidth={false}
              size="small"
              type="outlined"
              height={30}
            />
            <CustomButton
              title={"Lendo"}
              onPress={() => navigateToLibrary(1)}
              fullWidth={false}
              size="small"
              type="outlined"
              height={30}
            />
            <CustomButton
              title={"Lidos"}
              onPress={() => navigateToLibrary(2)}
              fullWidth={false}
              type="outlined"
              size="small"
              height={30}
            />
          </View>
        </View>

        <View style={styles.achievementContainer}>
          <Achievement />
        </View>
        
        <View>
          {profilePosts.map((post) => (
            <View key={post.postId}>
              <PostCard
                title={post.title ? post.title : ""}
                subtitle={post.text}
                bookcover={post.googleImageUrl}
                username={post.username}
                bSpoiler={post.isSpoiler || false}
                repost={0}
                likes={post.likedBy}
                comments={post.comments}
                onPress={() => togglePostExpansion(post.postId)}
              />
              {expandedPosts.includes(post.postId) && (
                <View style={{ marginLeft: 20 }}>
                  {childPost(post.postId)}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  achievementContainer: {
    marginBottom: 20,
    marginHorizontal: 30,
    marginTop: 20,
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
  libraryButtonsContainer: {
    marginBottom: 30,
    marginHorizontal: 30,
    marginTop: 10,
  },
  libraryTab: {
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  libraryTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  libraryTabsContainer: {
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  libraryTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  statsContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
});

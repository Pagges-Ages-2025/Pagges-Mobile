import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectionButton from "../components/Buttons/SelectionButton";
import PostCard from "../components/Cards/PostCard";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { Post } from "../models/Post";
import PostService from "../services/postService";

const Social: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<
    "para-voce" | "seguindo"
  >("para-voce");
  const [forYouPosts, setForYouPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const PostAPI = PostService();

  const fetchForYouPosts = async () => {
    setLoading(true);
    try {
      const posts = await PostAPI.getForYouPosts();
      setForYouPosts(posts);
    } catch (error) {
      console.error("Erro ao buscar posts para você:", error);
      setForYouPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
    setLoading(true);
    try {
      const posts = await PostAPI.getFollowingPosts();
      setFollowingPosts(posts);
    } catch (error) {
      console.error("Erro ao buscar posts dos usuários seguidos:", error);
      setFollowingPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection === "para-voce") {
      fetchForYouPosts();
    } else if (selectedSection === "seguindo") {
      fetchFollowingPosts();
    }
  }, [selectedSection]);

  const handleSectionChange = (section: "para-voce" | "seguindo") => {
    setSelectedSection(section);
  };

  const handleUserPress = (username: string) => {
    router.push({
      pathname: "/screens/thirdPersonProfile",
      params: { username },
    });
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      title={item.bookTitle || ""}
      subtitle={item.text}
      bookcover={item.googleImageUrl}
      username={item.username}
      profileImage={item.profileImage}
      likes={item.likedBy}
      repost={0}
      comments={item.comments}
      bSpoiler={item.isSpoiler || false}
      onPressUser={() => handleUserPress(item.username)}
    />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <NunitoText
            style={[styles.emptyStateText, { color: theme.secondaryText }]}
          >
            Carregando posts...
          </NunitoText>
        </View>
      );
    }

    const currentPosts =
      selectedSection === "para-voce" ? forYouPosts : followingPosts;
    const sectionName =
      selectedSection === "para-voce"
        ? "para você"
        : "dos usuários que você segue";

    if (currentPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <NunitoText
            style={[styles.emptyStateText, { color: theme.secondaryText }]}
          >
            Nenhum post encontrado {sectionName}
          </NunitoText>
        </View>
      );
    }

    return (
      <FlatList
        data={currentPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.postId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
      edges={[]}
    >
      <View style={styles.content}>
        <NunitoText style={[styles.title, { color: theme.primary }]}>
          Pagges
        </NunitoText>
        <StaticSearchBar
          toRoute="/screens/searchSocialPage"
          placeholder="Pesquisar leitores..."
        />
        <View style={styles.selectionContainer}>
          <SelectionButton
            title="Para você"
            isSelected={selectedSection === "para-voce"}
            isDisable={false}
            onSelectChange={() => handleSectionChange("para-voce")}
          />
          <SelectionButton
            title="Seguindo"
            isSelected={selectedSection === "seguindo"}
            isDisable={false}
            onSelectChange={() => handleSectionChange("seguindo")}
          />
        </View>
        <View style={styles.postsContainer}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    flex: 1,
    paddingTop: 30,
    width: "90%",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  postsContainer: {
    flex: 1,
    marginTop: 20,
  },
  postsList: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default Social;

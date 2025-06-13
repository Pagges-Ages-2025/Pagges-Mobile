import { useEffect, useMemo, useState } from "react";
import UserAPI from "../services/profileService";
import { User } from "../models/User";
import { useTheme } from "../context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { base64Uri } from "../utils/imageUtils";
import UserStats from "../components/UserStats/UserStats";
import Biography from "../components/Biography/Biography";

import Achievement from "../components/Achievements/Achievement";
import { Genre } from "../models/Genre";
import SocialAPI from "../services/socialService";

export default function ThirdPersonProfileScreen() {
  const [data, setData] = useState<User>();
  const { theme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userGenres, setUserGenres] = useState<Genre[]>([]);
  const { username } = useLocalSearchParams();
  const [offSetFollowers, setOffSetFollowers] = useState<number>(0);
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
          setOffSetFollowers(prev => prev - 1)
        })
        .catch((error: any) => {
          console.error("Error unfollowing user:", error);
        });
    } else {
      SocialAPI()
        .followUser(thirdPersonUsername)
        .then(() => {
          setIsFollowing(!isFollowing);
          setOffSetFollowers(prev => prev + 1);
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

  useEffect(() => {
    fetchThirdPersonProfile();
    fetchIsFollowingUser();
  }, [username]);

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
            ranking={data?.ranking || 0}
            amigos={offSetFollowers}
          />
        </View>
        <View style={styles.biographyContainer}>
          <Biography
            biographyText={data?.biography || ""}
            onBioChange={() => {}}
          />
        </View>

        <View style={styles.achievementContainer}>
          <Achievement />
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
  libraryTabText: {
    fontSize: 14,
    fontWeight: "500",
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

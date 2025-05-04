import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import { useEffect, useState } from "react";
import UserAPI from "@/app/services/profileService";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View, StyleSheet } from "react-native";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Biography from "../components/Biography/Biography";
import Achievement from "../components/Achievements/Achievement";
import { useRouter } from "expo-router";
import { base64Uri } from "../utils/imageUtils";

const getToken = async () => {
  const userToken = await AsyncStorage.getItem("userToken");
  return userToken;
};

export default function ProfileScreen() {
  const [data, setData] = useState<User>();
  const { theme } = useTheme();
  const router = useRouter();

  const [stats, setStats] = useState<{ readBooks: number; readKms: number }>({
    readBooks: 0,
    readKms: 0,
  });  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:3000/personal-library/getUserStatistics`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            // "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpZCI6MSwiaWF0IjoxNzQ2Mzc2MzQwLCJleHAiOjE3NDY0NjI3NDB9.qHYM2FNTzv-2jYFZS3Vd3h9VzynXAe8ItFog0yLrlrs'
          },
        });
  
        const data = await res.json();

        setStats({
          readBooks: data.readBooks,
          readKms: data.readKms,
        });

      } catch (error) {
        console.error("Erro ao buscar estatísticas do usuário:", error);
      }
    };
  
    fetchStats();
  }, []);
  

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      if (token) {
        UserAPI()
          .getProfile(token)
          .then((response: User) => {
            setData(response);
          })
          .catch((error: any) => {
          });
      }
    };
    fetchProfile();
  }, []);

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
  

  const handleBioChange = async (newBio: string) => {
    const token = await getToken();
    if (token) {
      UserAPI()
        .updateBio(token, newBio)
      .then((response: User) => {
        console.log("Bio atualizada com sucesso:", response); // TODO: notificar usuário com mensagem na tela
        })
        .catch((error) => {
          console.error("Erro ao atualizar bio:", error);
        });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <ProfileHeader
          marginStart={30}
          profileImageUrl={
            data?.profileImage
              ? base64Uri(data.profileImage)
              : undefined
          }
          name={data?.name || "Seu Perfil"}
          isAuthor={data?.isAuthor || false}
          bEdit={true}
          onPressEdit={handleEditProfile}
        />
        <View style={styles.statsContainer}>
          <UserStats
            // kmLidos={data?.readKm || 0}
            kmLidos={stats.readKms}
            livros={stats.readBooks}
            ranking={data?.ranking || 0}
            amigos={data?.friendsNumber || 0}
          />
        </View>
        <View style={styles.biographyContainer}>
          <Biography biographyText={data?.biography || ""} onBioChange={handleBioChange}/>
        </View>
        <View style={styles.achievementContainer}>
          <Achievement />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  biographyContainer: {
    marginHorizontal: 30,
    marginTop: 20,
  },
  achievementContainer: {
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
  },
});

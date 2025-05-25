import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import { useEffect, useState, useCallback } from "react";
import UserAPI from "@/app/services/profileService";
import axiosInstance from "../services/axios-instance-singleton";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Biography from "../components/Biography/Biography";
import Achievement from "../components/Achievements/Achievement";
import { useRouter, useFocusEffect } from "expo-router";
import { base64Uri } from "../utils/imageUtils";
import NunitoText from "../components/Texts/NunitoText";
import CustomButton from "../components/Buttons/CustomButton";
import { Genre } from "../models/Genre";

const getToken = async () => {
  const userToken = await AsyncStorage.getItem("userToken");
  return userToken;
};

export default function ProfileScreen() {
  const [data, setData] = useState<User>();
  const [userGenres, setUserGenres] = useState<Genre[]>([]);
  const { theme } = useTheme();
  const router = useRouter();

  const [stats, setStats] = useState<{ readBooks: number; readKms: number }>({
    readBooks: 0,
    readKms: 0,
  });

  const fetchUserGenres = async () => {
    try {
      const response = await axiosInstance.get('/user-genres/user');
      setUserGenres(response.data.data);
      console.log("Gêneros atualizados:", response.data.data);
    } catch (error) {
      console.error("Erro ao buscar os gêneros do usuário:", error);
    }
  };

  const fetchProfile = async () => {
    UserAPI()
      .getProfile()
      .then((response: User) => {
        setData(response);
      })
      .catch((error: any) => { });
  };

  const fetchStats = async () => {
    UserAPI()
      .getUserStatistics()
      .then((response: { readBooks: number; readKms: number }) => {
        setStats(response);
      })
      .catch((error: any) => { });
  };

  // Atualiza dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchStats();
      fetchUserGenres();
    }, [])
  );

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchUserGenres();
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
          isEditMode={false}
          onPressEditGenres={() => router.push({
            pathname: "/screens/favoriteGenre",
            params: { from: "edit" },
          })}
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
          <Biography
            biographyText={data?.biography || ""}
            onBioChange={handleBioChange}
          />
        </View>

        {/* Biblioteca pessoal buttons - Now placed above achievements */}
        <View style={styles.libraryButtonsContainer}>
          <NunitoText style={[styles.libraryTitle, { color: theme.primaryText }]}>
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
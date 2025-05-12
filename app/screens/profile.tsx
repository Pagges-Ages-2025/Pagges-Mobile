import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import { useEffect, useState } from "react";
import UserAPI from "@/app/services/profileService";
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
import { useRouter } from "expo-router";
import { base64Uri } from "../utils/imageUtils";
import NunitoText from "../components/Texts/NunitoText";

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
      UserAPI()
        .getUserStatistics()
        .then((response: { readBooks: number; readKms: number }) => {
          setStats(response);
        })
        .catch((error: any) => {});
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      UserAPI()
        .getProfile()
        .then((response: User) => {
          setData(response);
        })
        .catch((error: any) => {});
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
    >
      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <ProfileHeader
          marginStart={30}
          profileImageUrl={
            data?.profileImage ? base64Uri(data.profileImage) : undefined
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
          <Biography
            biographyText={data?.biography || ""}
            onBioChange={handleBioChange}
          />
        </View>

        {/* Biblioteca pessoal buttons - Now placed above achievements */}
        <View style={styles.libraryButtonsContainer}>
          <NunitoText style={styles.libraryTitle}>
            Biblioteca Pessoal
          </NunitoText>
          <View style={styles.libraryTabsContainer}>
            <TouchableOpacity
              style={[styles.libraryTab, { backgroundColor: theme.Background }]}
              onPress={() => navigateToLibrary(0)}
            >
              <NunitoText
                style={[styles.libraryTabText, { color: theme.primaryText }]}
              >
                Lidos
              </NunitoText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.libraryTab, { backgroundColor: theme.Background }]}
              onPress={() => navigateToLibrary(1)}
            >
              <NunitoText
                style={[styles.libraryTabText, { color: theme.primaryText }]}
              >
                Quero Ler
              </NunitoText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.libraryTab, { backgroundColor: theme.Background }]}
              onPress={() => navigateToLibrary(2)}
            >
              <NunitoText
                style={[styles.libraryTabText, { color: theme.primaryText }]}
              >
                Lendo
              </NunitoText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.achievementContainer}>
          <Achievement />
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

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
  libraryButtonsContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  libraryTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  libraryTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    padding: 3,
  },
  libraryTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },
  libraryTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import { useEffect, useState } from "react";
import UserAPI from "@/app/services/profileService";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View, StyleSheet } from "react-native";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
  const userToken = await AsyncStorage.getItem("userToken");
  return userToken;
};

export default function ProfileScreen() {
  const [data, setData] = useState<User>();
  const { theme } = useTheme();

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

  console.log("Current data state:", data);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <ProfileHeader
          marginStart={30}
          profileImageUrl="https://upload.wikimedia.org/wikipedia/pt/6/62/Kermit_the_Frog.jpg"
          name={data?.name || "Seu Perfil"}
          isAuthor={data?.isAuthor || false}
        />
        <View style={styles.statsContainer}>
          <UserStats
            kmLidos={data?.readKm || 0}
            livros={data?.readBooks || 0}
            ranking={data?.ranking || 0}
            amigos={data?.friendsNumber || 0}
          />
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
});

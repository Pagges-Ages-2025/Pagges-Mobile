import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { User } from "@/app/models/User";
import { useEffect, useState } from "react";
import UserAPI from "@/app/api/ProfileService";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import UserStats from "../components/UserStats/UserStats";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [data, setData] = useState<User>();
  const { theme } = useTheme();

  useEffect(() => {
    if (email) {
      console.log("Fetching profile for email:", email);
      UserAPI()
        .getProfile(email)
        .then((response: User) => {
          console.log("API Response:", response);
          setData(response);
        })
        .catch((error: any) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [email]);

  console.log("Current data state:", data);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.Background }}>
      <ProfileHeader
        marginStart={30}
        profileImageUrl="https://upload.wikimedia.org/wikipedia/pt/6/62/Kermit_the_Frog.jpg"
        name={data?.name || ""}
        isAuthor={data?.isAuthor || false}
      />
      <View style={{ marginHorizontal: 30, marginTop: 20 }}>
        <UserStats
          kmLidos={data?.readKm || 0}
          livros={data?.readBooks || 0}
          ranking={data?.ranking || 0}
          amigos={data?.friendsNumber || 0}
        />
      </View>
    </ScrollView>
  );
}

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLoadFonts from "./hooks/useLoadFonts";
import NunitoText from "./components/Texts/NunitoText";

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useLoadFonts();

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        router.replace("/screens/splash");
      } else {
        router.replace("/screens/personalLibrary");
      }
    };

    if (fontsLoaded) {
      checkUserToken();
    }
  }, [fontsLoaded, router]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#9C0F5F" />
        <NunitoText>Carregando...</NunitoText>
      </View>
    );
  }

  return null;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import NunitoText from "./components/Texts/NunitoText";
import useLoadFonts from "./hooks/useLoadFonts";

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useLoadFonts();

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        router.replace("/screens/splash");
      } else {
        router.replace("/screens/splash");
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

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import useLoadFonts from "./hooks/useLoadFonts";

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useLoadFonts();

  useEffect(() => {
    if (fontsLoaded) {
      const timeout = setTimeout(() => {
        router.replace("/screens/searchPage");
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [fontsLoaded, router]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> {/*View eh tipo uma div*/}
        <ActivityIndicator size="large" color="#9C0F5F" />
      </View>
    );
  }

  return null;
}

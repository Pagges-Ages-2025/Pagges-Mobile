// index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { jwtDecode } from "jwt-decode";
import NunitoText from "./components/Texts/NunitoText";
import useLoadFonts from "./hooks/useLoadFonts";

type JwtPayload = { exp: number };

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useLoadFonts();

  useEffect(() => {
    if (!fontsLoaded) return;

    (async () => {
      router.replace("/screens/splash");

      // set 1.5 second timeout' to avoid flickering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        try {
          const { exp } = jwtDecode<JwtPayload>(token);
          const now = Date.now() / 1000;
          console.log("Token exp:", exp);

          if (exp > now) {
            // token still valid
            console.log("Token is valid");
            router.replace("/screens/home");
            return;
          } else {
            // token expired
            await AsyncStorage.removeItem("userToken");
          }
        } catch {
          // malformed token
          await AsyncStorage.removeItem("userToken");
        }
      }

      // no token or expired ⇒ splash
      router.replace("/screens/splash");
    })();
  }, [fontsLoaded, router]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C0F5F" />
        <NunitoText>Carregando...</NunitoText>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

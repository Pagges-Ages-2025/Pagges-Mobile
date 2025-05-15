import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import NunitoText from "../components/Texts/NunitoText";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      asdahsbdjhasbdjahsbd
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    lottieRef.current?.play();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/screens/welcome");
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <NunitoText style={styles.title}>Pagges</NunitoText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9C0F5F",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 90,
    fontWeight: "bold",
    color: "#F5E2C8",
    marginBottom: 40,
    fontFamily: "Nunito", 
  },
  lottie: {
    width: 200,
    height: 200,
  },
});


import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import CustomButton from "../components/Buttons/CustomButton";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    lottieRef.current?.play();
  }, []);

  const navigateTo = (screen: "login" | "register") => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/screens/${screen}`);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Pagges</Text>
        <Text style={styles.subtitle}>
          Descubra um mundo de histórias ao seu alcance
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton title={"Entrar"} onPress={() => navigateTo("login")} />
          <CustomButton
            title={"Cadastrar"}
            onPress={() => navigateTo("register")}
            type="outlined"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9C0F5F",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    backgroundColor: "#9C0F5F",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9C0F5F",
  },
  outlineButtonText: {
    color: "#9C0F5F",
    fontSize: 16,
    fontWeight: "600",
  },
});

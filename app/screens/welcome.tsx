import React, { useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import CustomButton from "../components/Buttons/CustomButton";
import ImageCartoon from "../assets/images/backgroundWelcome.png";
import NunitoText from "../components/Texts/NunitoText";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lottieRef = useRef<LottieView>(null);

  useFocusEffect(
    useCallback(() => {
      // Reset valores
      fadeAnim.setValue(0);
      slideAnim.setValue(50);

      // Executa animações ao focar
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

      // Opcional: reset ao desfocar
      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      };
    }, [])
  );

  const navigateTo = (screen: "login" | "register" | "tests/teste") => {
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
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <NunitoText style={styles.logotitle}>Pagges</NunitoText>
        <Image source={ImageCartoon} style={styles.logo} />
        <NunitoText style={styles.title}>
          Sua nova comunidade de leitura
        </NunitoText>
        <NunitoText style={styles.subtitle}>
          Leia, escreva, comente e interaja sempre que desejar
        </NunitoText>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={"Entrar"}
            fontWeight="bold"
            onPress={() => navigateTo("login")}
          />
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigateTo("register")}
          >
            <NunitoText style={styles.registerLinkText}>
              Não possui uma conta?
            </NunitoText>
            <NunitoText
              style={[styles.registerLinkText, { fontWeight: "bold" }]}
            >
              Inscreva-se
            </NunitoText>
          </TouchableOpacity>
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
  logo: {
    width: 320,
    height: 320,
    resizeMode: "contain",
    marginBottom: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logotitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9C0F5F",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#474545",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#474545",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  registerLink: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 4,
  },
  registerLinkText: {
    color: "#666",
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
});
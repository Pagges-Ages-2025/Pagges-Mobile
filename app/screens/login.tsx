import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/Buttons/CustomButton";
import NunitoText from "../components/Texts/NunitoText";
import { PaggesTextInput } from "../components/Inputs/TextInput";
import Strings from "../constants/Strings";
import AuthAPI from "../services/auth";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const lottieRef = useRef<LottieView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmitLoginButton = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const responseData = await AuthAPI().executeLoginUserRequest({
        email,
        password,
      });

      await AsyncStorage.setItem("userToken", responseData.accessToken);
      await AsyncStorage.setItem("userEmail", email);

      router.replace("/screens/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.status === 401
            ? "Usuário ou senha inválido"
            : "Falha ao fazer login"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.Background }]}
        scrollEnabled={false}
      >
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
            <NunitoText style={styles.title}>Pagges</NunitoText>
            <NunitoText style={styles.subtitle}>
              Bem-vindo de volta, leitor(a)!
            </NunitoText>

            <LottieView
              ref={lottieRef}
              source={require("../assets/animations/login.json")}
              style={styles.lottie}
              autoPlay={true}
              loop={true}
            />

            <PaggesTextInput
              style={styles.inputContainer}
              placeholder={Strings.emailOrUsernamePlaceholder}
              value={email}
              onChangeText={setEmail}
              leftIconName="person-outline"
            />

            <PaggesTextInput
              style={styles.inputContainer}
              placeholder={Strings.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              leftIconName="lock-closed-outline"
              rightIconName={showPassword ? "eye-outline" : "eye-off-outline"}
              isRightIconEnabled={true}
              isSecureTextEntry={!showPassword}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <NunitoText style={styles.forgotPasswordText}>
                {Strings.forgotPassword}
              </NunitoText>
            </TouchableOpacity>

            {error && (
              <NunitoText
                style={{ color: "red", marginBottom: 16, textAlign: "center" }}
              >
                {error}
              </NunitoText>
            )}

            <CustomButton
              title={isLoading ? "Entrando..." : "Entrar"}
              onPress={handleSubmitLoginButton}
              isDisabled={isLoading}
            />

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigateTo("register")}
            >
              <NunitoText style={styles.registerLinkText}>
                Não possui uma conta?
              </NunitoText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#9C0F5F",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    width: "100%",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
  illustration: {
    height: 150,
    marginBottom: 30,
    width: 200,
  },
  input: {
    color: "#333",
    flex: 1,
    fontFamily: "Nunito",
    fontSize: 16,
    height: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  lottie: {
    height: 300,
    width: 300,
  },
  registerLink: {
    marginTop: 10,
  },
  registerLinkText: {
    color: "#666",
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  subtitle: {
    color: "#333",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    color: "#9C0F5F",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

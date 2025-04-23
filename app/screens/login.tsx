import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import CustomButton from "../components/Buttons/CustomButton";
import NunitoText from "../components/Texts/NunitoText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { PaggesTextInput } from "../components/Texts/TextInput";
import Strings from "../constants/Strings";

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

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:3000/auth/login`, {
        email,
        password,
      });

      const data = response.data;

      await AsyncStorage.setItem("userToken", data.accessToken);
      await AsyncStorage.setItem("userEmail", email);

      router.replace("/screens/searchPage");
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
        contentContainerStyle={styles.scrollContainer}
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
              onPress={handleLogin}
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
  scrollContainer: {
    flexGrow: 1,
  },
  lottie: {
    width: 300,
    height: 300,
  },
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
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9C0F5F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  illustration: {
    width: 200,
    height: 150,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#333",
    fontSize: 16,
    fontFamily: "Nunito",
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
  button: {
    backgroundColor: "#9C0F5F",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 10,
  },
  registerLinkText: {
    color: "#666",
    fontSize: 14,
  },
});

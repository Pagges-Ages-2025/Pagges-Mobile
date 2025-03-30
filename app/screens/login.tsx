import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  GestureResponderEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import CustomButton from "../components/Buttons/CustomButton";
import NunitoText from "../components/Texts/NunitoText";
import SearchBar, { Book } from "../components/SearchBar/SearchBar";

export default function LoginScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const lottieRef = useRef<LottieView>(null);

  const books: Book[] = [
    { id: "1", title: "1984", author: "George Orwell" },
    { id: "2", title: "O Senhor dos Anéis", author: "J.R.R. Tolkien" },
    { id: "3", title: "Dom Quixote", author: "Miguel de Cervantes" },
    { id: "4", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry" },
    { id: "5", title: "Cem Anos de Solidão", author: "Gabriel García Márquez" },
  ];

  const handleSelectBook = (book: Book) => {
    console.log("Livro selecionado:", book);
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
      <ScrollView contentContainerStyle={styles.scrollContainer} scrollEnabled={false}>
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
            <NunitoText style={styles.subtitle}>Bem-vindo de volta, leitor(a)!</NunitoText>

            <LottieView
              ref={lottieRef}
              source={require("../assets/animations/login.json")}
              style={styles.lottie}
              autoPlay={true}
              loop={true}
            />
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#A9A8A9"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail ou nome de usuário"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#A9A8A9"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#A9A8A9"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <NunitoText style={styles.forgotPasswordText}>Esqueceu a senha?</NunitoText>
            </TouchableOpacity>

            <SearchBar books={books} onSelectBook={handleSelectBook}></SearchBar>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigateTo("register")}
            >
              <NunitoText style={styles.registerLinkText}>Não possui uma conta?</NunitoText>
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#A9A8A9",
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#333",
    fontSize: 16,
    fontFamily: "Nunito"
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

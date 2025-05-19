import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
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
import { PaggesTextInput } from "../components/Texts/TextInput";
import Strings from "../constants/Strings";
import AuthAPI from "../services/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("reader");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string>("");

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

  useEffect(() => {
    const nameValid = fullName.length > 5;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length > 0 && password == confirmPassword;
    setIsFormValid(nameValid && emailValid && passwordValid);
  }, [fullName, email, password, confirmPassword]);

  const handleSubmit = async () => {
    try {
      const responseData = await AuthAPI().executeRegisterUserRequest({
        email,
        password,
        name: fullName,
        username,
        isAuthor: userType === "author",
      });

      await AsyncStorage.setItem("userToken", responseData.accessToken);
      await AsyncStorage.setItem("userEmail", email);

      router.replace({pathname: "/screens/favoriteGenre", params:{from: "register"}});
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    }
  };

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
            <NunitoText style={styles.welcomeText}>Bem-vindo à</NunitoText>
            <NunitoText style={styles.title}>Pagges</NunitoText>

            <View style={styles.form}>
              <View style={styles.inputsContainer}>
                <PaggesTextInput
                  placeholder={Strings.fullNamePlaceholder}
                  value={fullName}
                  leftIconName="person"
                  onChangeText={setFullName}
                />

                <PaggesTextInput
                  placeholder={Strings.usernamePlaceholder}
                  value={username}
                  leftIconName="at"
                  onChangeText={setUsername}
                />

                <PaggesTextInput
                  placeholder={Strings.emailPlaceholder}
                  value={email}
                  leftIconName="mail-outline"
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <PaggesTextInput
                  placeholder={Strings.passwordPlaceholder}
                  value={password}
                  leftIconName="lock-closed-outline"
                  rightIconName={
                    showPassword ? "eye-outline" : "eye-off-outline"
                  }
                  isRightIconEnabled={true}
                  isSecureTextEntry={!showPassword}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  onChangeText={setPassword}
                />

                <PaggesTextInput
                  placeholder={Strings.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  leftIconName="lock-closed-outline"
                  rightIconName={
                    showConfirmPassword ? "eye-outline" : "eye-off-outline"
                  }
                  isRightIconEnabled={true}
                  isSecureTextEntry={!showConfirmPassword}
                  onRightIconClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  onChangeText={setConfirmPassword}
                />

                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setUserType("reader")}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        userType === "reader" && styles.radioButtonSelected,
                      ]}
                    >
                      {userType === "reader" && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <NunitoText style={styles.radioLabel}>
                      Sou leitor(a)
                    </NunitoText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setUserType("author")}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        userType === "author" && styles.radioButtonSelected,
                      ]}
                    >
                      {userType === "author" && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <NunitoText style={styles.radioLabel}>
                      Sou autor(a)
                    </NunitoText>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <View
                  style={[
                    styles.checkbox,
                    termsAccepted && styles.checkboxSelected,
                  ]}
                >
                  {termsAccepted && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <NunitoText style={styles.termsText}>
                  Declaro que li e concordo com os{" "}
                  <NunitoText style={styles.termsLink}>
                    Termos de Uso
                  </NunitoText>{" "}
                  e a{" "}
                  <NunitoText style={styles.termsLink}>
                    Política de Privacidade
                  </NunitoText>
                </NunitoText>
              </TouchableOpacity>

              <View style={{ marginTop: 30 }}>
                {error != "" && (
                  <NunitoText
                    style={{
                      color: "red",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </NunitoText>
                )}
                <CustomButton
                  title={"Cadastrar"}
                  onPress={handleSubmit}
                  isDisabled={!isFormValid}
                />
              </View>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigateTo("login")}
              >
                <NunitoText style={styles.loginLinkText}>
                  Já possui uma conta?{" "}
                  <NunitoText style={styles.loginLinkHighlight}>
                    Login
                  </NunitoText>
                </NunitoText>
              </TouchableOpacity>
            </View>
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
  checkbox: {
    alignItems: "center",
    borderColor: "#A9A8A9",
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: "#9C0F5F",
  },
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    width: "100%",
  },
  eyeIcon: {
    padding: 10,
  },
  form: {
    width: "100%",
  },
  input: {
    color: "#333",
    flex: 1,
    fontFamily: "Nunito",
    fontSize: 16,
    height: "100%",
  },
  inputContainer: {
    alignItems: "center",
    borderColor: "#A9A8A9",
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 10,
  },
  loginLinkHighlight: {
    color: "#9C0F5F",
    fontWeight: "500",
  },
  loginLinkText: {
    color: "#666",
    fontSize: 14,
  },
  radioButton: {
    alignItems: "center",
    borderColor: "#A9A8A9",
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    marginRight: 8,
    width: 20,
  },
  radioButtonInner: {
    backgroundColor: "#9C0F5F",
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioButtonSelected: {
    borderColor: "#9C0F5F",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
    width: "100%",
  },
  radioLabel: {
    color: "#333",
    fontSize: 14,
  },
  radioOption: {
    alignItems: "center",
    flexDirection: "row",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  termsContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  termsLink: {
    color: "#9C0F5F",
    textDecorationLine: "underline",
  },
  termsText: {
    color: "#666",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: "#9C0F5F",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 30,
  },
  welcomeText: {
    color: "#333",
    fontSize: 18,
  },
});

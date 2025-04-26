import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/Buttons/CustomButton";
import NunitoText from "../components/Texts/NunitoText";
import { PaggesTextInput } from "../components/Texts/TextInput";
import Strings from "../constants/Strings";
import axios from "axios";

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
    const passwordValid = (password.length > 0 && password == confirmPassword);
    setIsFormValid(nameValid && emailValid && passwordValid);

  }, [fullName, email, password, confirmPassword]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:3000/auth/register`, {email, password, name : fullName, username,  isAuthor: userType === 'reader' ? false : true})
      console.log(response.data);
    } catch (error) {
      console.error(error);
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
                <CustomButton title={"Cadastrar"} onPress={handleSubmit} isDisabled = {!isFormValid} />
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
  scrollContainer: {
    flexGrow: 1,
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
    paddingVertical: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9C0F5F",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#A9A8A9",
    borderRadius: 30,
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
    fontFamily: "Nunito",
  },
  eyeIcon: {
    padding: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A9A8A9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: "#9C0F5F",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#9C0F5F",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A9A8A9",
    marginRight: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#9C0F5F",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#9C0F5F",
    textDecorationLine: "underline",
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
  loginLink: {
    alignSelf: "center",
    marginTop: 10,
  },
  loginLinkText: {
    color: "#666",
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: "#9C0F5F",
    fontWeight: "500",
  },
});

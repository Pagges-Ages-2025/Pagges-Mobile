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
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <Text style={styles.welcomeText}>Bem-vindo à</Text>
            <Text style={styles.title}>Pagges</Text>
            
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#9C0F5F" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome Completo"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="at" size={20} color="#9C0F5F" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome de usuário"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.radioContainer}>
                <TouchableOpacity 
                  style={styles.radioOption} 
                  onPress={() => setUserType("reader")}
                >
                  <View style={[
                    styles.radioButton, 
                    userType === "reader" && styles.radioButtonSelected
                  ]}>
                    {userType === "reader" && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Sou leitor(a)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.radioOption} 
                  onPress={() => setUserType("author")}
                >
                  <View style={[
                    styles.radioButton, 
                    userType === "author" && styles.radioButtonSelected
                  ]}>
                    {userType === "author" && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Sou autor(a)</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9C0F5F" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#9C0F5F" style={styles.inputIcon} />
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
                    color="#9C0F5F" 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#9C0F5F" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#9C0F5F" 
                  />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.termsContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <View style={[
                  styles.checkbox, 
                  termsAccepted && styles.checkboxSelected
                ]}>
                  {termsAccepted && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text style={styles.termsText}>
                  Declaro que li e concordo com os{" "}
                  <Text style={styles.termsLink}>Termos de Uso</Text> e a{" "}
                  <Text style={styles.termsLink}>Política de Privacidade</Text>
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.button} onPress={() => {}}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.loginLink} 
                onPress={() => navigateTo("login")}
              >
                <Text style={styles.loginLinkText}>
                  Já possui uma conta? <Text style={styles.loginLinkHighlight}>Login</Text>
                </Text>
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
    fontSize: 42,
    fontWeight: "bold",
    color: "#9C0F5F",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#9C0F5F",
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
  },
  eyeIcon: {
    padding: 10,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
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
    borderColor: "#9C0F5F",
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
    borderColor: "#9C0F5F",
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
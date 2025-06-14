import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "@/app/components/Buttons/CustomButton";
import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import { base64Uri } from "../utils/imageUtils";
import UserAPI from "../services/profileService";

export default function ConfigurationScreen() {
  const { theme, themeName, setThemeName } = useTheme();
  const router = useRouter();
  const [data, setData] = useState<User>();

  const fetchProfile = async () => {
    UserAPI()
      .getProfile()
      .then((response: User) => {
        setData(response);
      })
      .catch((error: any) => {});
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userEmail");
      router.replace("/screens/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleTheme = () => {
    setThemeName(themeName === "dark" ? "light" : "dark");
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons
          name="return-up-back-outline"
          size={30}
          color={theme.black}
          onPress={router.back}
        />
      </TouchableOpacity>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.Background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <ProfileHeader
            marginStart={30}
            profileImageUrl={
              data?.profileImage ? base64Uri(data.profileImage) : undefined
            }
            name={data?.name.toString() || ""}
            isAuthor={false}
            isEditMode={false}
            onPressEditGenres={() => {}}
          />

          <View style={styles.formContainer}>
            <CustomButton
              //title={Strings.editGenres}
              title={"Alterar modo " + themeName}
              onPress={toggleTheme}
              size="small"
              type={"primary"}
            />
            <CustomButton
              title={"Sair"}
              onPress={handleLogout}
              size="small"
              type={"outlinedSecondary"}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  TextInputContainer: {
    marginVertical: 10,
  },
  backButton: {
    left: 20,
    position: "absolute",
    top: 50,
    zIndex: 10,
  },
  charCounter: {
    alignSelf: "flex-end",
    fontSize: 12,
    marginBottom: 60,
    marginRight: 20,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    alignSelf: "center",
    flex: 1,
    gap: 20,
    paddingVertical: "15%",
    width: "90%",
  },
});

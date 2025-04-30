import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "@/app/components/Buttons/CustomButton";
import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { PaggesTextInput } from "../components/Texts/TextInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserAPI from "@/app/services/profileService";
import ErrorModal from "@/app/components/Modals/ErrorModal";
import Strings from "../constants/Strings";

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { userToken, profileName, profileBiography } = useLocalSearchParams<{
    userToken?: string;
    profileName?: string;
    profileBiography?: string;
  }>();

  const [name, setName] = useState<string>(profileName?.toString() || "");
  const [bio, setBio] = useState<string>(profileBiography?.toString() || "");
  const [bioCharCount, setBioCharCount] = useState<number>(bio.length);
  const [changesMade, setChangesMade] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalType, setModalType] = useState<"error" | "warning">("error");

  const showErrorModal = (
    title: string,
    description: string,
    type: "error" | "warning" = "error"
  ) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalType(type);
    setModalVisible(true);
  };

  useEffect(() => {
    setChangesMade(false);
  }, []);

  const handleInputChange = (text: string, type: "name" | "bio") => {
    if (type === "name") setName(text);
    else {
      if (text.length <= 200) {
        setBio(text);
        setBioCharCount(text.length);
      }
    }

    const nameChanged = type === "name" && text !== profileName;
    const bioChanged = type === "bio" && text !== profileBiography;
    setChangesMade(nameChanged || bioChanged);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      if (!userToken) {
        showErrorModal(Strings.errorTitle, Strings.tokenNotFound);
        return;
      }

      const updateData: { name?: string; biography?: string } = {};
      if (name && name !== profileName) updateData.name = name;
      if (bio && bio !== profileBiography) updateData.biography = bio;

      if (!updateData.name && !updateData.biography) {
        showErrorModal(Strings.warningTitle, Strings.noChangesDetected, "warning");
        return;
      }

      await UserAPI().updateProfile(
        userToken,
        updateData.name,
        updateData.biography
      );

      setChangesMade(false);
      router.push(`/screens/profile`);
    } catch (error: any) {
      console.error(error);
      showErrorModal(
        "Erro",
        error.response?.data?.message || Strings.unexpectedError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Ionicons
        name="arrow-undo-circle"
        size={42}
        style={styles.backButton}
        onPress={() => router.back()}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.Background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <ProfileHeader
            marginStart={30}
            name={profileName?.toString() || ""}
            isAuthor={false}
            bEditPicture={true}
            onPressCameraIcon={() =>
              console.log("Ícone de câmera pressionado!")
            }
          />

          <View style={styles.formContainer}>
            <PaggesTextInput
              style={[styles.TextInputContainer, { height: 60 }]}
              placeholder={Strings.namePlaceholder}
              value={name}
              onChangeText={(text) => handleInputChange(text, "name")}
              leftIconName="person-outline"
            />

            <PaggesTextInput
              style={[styles.TextInputContainer, { height: 200 }]}
              placeholder={Strings.bioPlaceholder}
              value={bio}
              onChangeText={(text) => handleInputChange(text, "bio")}
              leftIconName="document-text-outline"
              multiline={true}
            />
            <Text style={[styles.charCounter, { color: theme.primaryText }]}>
              {bioCharCount}/200
            </Text>

            <CustomButton
              title={loading ? Strings.saving : Strings.save}
              onPress={handleSaveChanges}
              size="large"
              type={changesMade ? "primary" : "outlined"}
              isDisabled={!changesMade || loading}
            />
          </View>
        </View>
      </ScrollView>

      <ErrorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        description={modalDescription}
        type={modalType}
      />
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
  container: {
    flex: 1,
  },
  formContainer: {
    alignSelf: "center",
    flex: 1,
    paddingVertical: "15%",
    width: "90%",
  },
  charCounter: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 60,
    fontSize: 12,
  },
});

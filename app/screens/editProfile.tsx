import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "@/app/components/Buttons/CustomButton";
import ProfileHeader from "@/app/components/Profile/ProfileHeader";
import { PaggesTextInput } from "../components/Inputs/TextInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserAPI from "@/app/services/profileService";
import ErrorModal from "@/app/components/Modals/ErrorModal";
import Strings from "../constants/Strings";
import * as ImagePicker from "expo-image-picker";
import NunitoText from "../components/Texts/NunitoText";
import { Genre } from "../models/Genre";
import axiosInstance from "../services/axios-instance-singleton";

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
  const [userGenres, setUserGenres] = useState<Genre[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalType, setModalType] = useState<"error" | "warning">("error");

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUserGenres = async () => {
      try {
        const response = await axiosInstance.get('/user-genres/user');
        setUserGenres(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar os gêneros do usuário:", error);
      }
    };
  
    fetchUserGenres();
  }, []);

  useEffect(() => {
    console.log("image changed" + image);
  }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setChangesMade(true);
    }
  };

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

      if (!updateData.name && !updateData.biography && !image) {
        console.log("no changes detected");
        showErrorModal(
          Strings.warningTitle,
          Strings.noChangesDetected,
          "warning"
        );
        return;
      }

      if (updateData.name || updateData.biography) {
        await UserAPI().updateProfile(updateData.name, updateData.biography);
      }
      if (image) {
        await UserAPI().updateProfileImage(image);
      }

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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-undo-circle" size={42} />
      </TouchableOpacity>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.Background }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <ProfileHeader
            marginStart={30}
            profileImageUrl={image?.uri}
            name={profileName?.toString() || ""}
            isAuthor={false}
            bEditPicture={image ? false : true}
            isEditMode={true}
            onPressCameraIcon={() => pickImage()}
            onPressEditGenres={() =>
              router.push({
                pathname: "/screens/favoriteGenre",
                params: { from: "edit" },
              })
            }
            genres={userGenres || []}
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
    gap: 5,
    paddingVertical: "15%",
    width: "90%",
  },
});

import Strings from "@/app/constants/Strings";
import { Genre } from "@/app/models/Genre";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultProfileHeaderImage from "../../assets/images/default_profile_header_image.png";
import VerifiedIcon from "../../assets/images/ic_verified.svg";
import profileUser from "../../assets/images/profile-user.png";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../Buttons/CustomButton";
import NunitoText from "../Texts/NunitoText";
interface ProfileHeaderProps {
  marginStart: number;
  profileImageUrl?: string;
  name: string;
  isAuthor: boolean;
  bEdit?: boolean;
  following?: boolean;
  isEditMode?: boolean;
  bConfig?: boolean;
  genres?: Genre[];
  onPressFollow?: () => void;
  onPressEdit?: () => void;
  onPressConfig?: () => void;
  onPressCameraIcon?: () => void;
  onPressEditGenres: () => void;
}

const headerImageHeight = 123;
const profileImageSize = 87;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  marginStart,
  profileImageUrl,
  name,
  isAuthor,
  bEdit = false,
  following = undefined,
  isEditMode = false,
  bConfig = false,
  genres,
  onPressFollow,
  onPressEdit,
  onPressConfig,
  onPressCameraIcon,
  onPressEditGenres,
}) => {
  const { theme, themeName } = useTheme();
  const colorsBackground = ["#9E0E53AA", "#F4D06F", "#388383C7"];
  const colorsLabel = ["#FFFFFF", "#000000", "#FFFFFF"];

  const dynamicTextStyle: TextStyle = {
    color: theme.primaryText,
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
    },
    backgroundImage: {
      width: "100%",
      height: headerImageHeight,
      position: "relative",
    },
    profileImage: {
      width: profileImageSize,
      height: profileImageSize,
      marginTop: headerImageHeight * 0.75,
    },
    profileImageContainer: {
      flexDirection: "column",
      flex: 1,
      height: headerImageHeight * 0.85 + profileImageSize,
    },
    editIcon: {
      position: "absolute",
      top: "40%",
      right: "12%",
    },
    configIcon: {
      position: "absolute",
      top: "40%",
      right: "3%",
    },
    genresContainer: {
      flexDirection: "row",
      marginTop: 8,
    },
    name: {
      fontSize: 28,
      fontWeight: 700,
    },
    cameraIconContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: 4,
    },
    cameraIcon: {
      height: 24,
      width: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    username: {
      fontSize: 18,
      fontWeight: 400,
    },
    nameContainer: {
      flex: 1,
      flexDirection: "row",
    },
    nameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 16,
    },
    genreLabel: {
      marginEnd: 8,
    },
    isAuthorContainer: {
      marginLeft: 8,
      marginTop: 4,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    isAuthorText: {
      fontSize: 12,
      fontWeight: 400,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.profileImageContainer}>
        <ImageBackground
          source={DefaultProfileHeaderImage}
          style={styles.backgroundImage}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!isEditMode}
              onPress={onPressCameraIcon}
              style={[styles.profileImage, { marginStart: marginStart }]}
            >
              <Image
                source={
                  profileImageUrl ? { uri: profileImageUrl } : profileUser
                }
                style={{ flex: 1, borderRadius: 50 }}
              />
              {isEditMode && !bEdit && (
                <View style={styles.cameraIconContainer}>
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={24} color={theme.white} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                marginLeft: 16,
                marginTop: 134,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {isEditMode ? (
                <View style={{ paddingLeft: 6 }}>
                  <View
                    style={{
                      borderRadius: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 8,
                    }}
                  >
                    <CustomButton
                      title={Strings.editGenres}
                      onPress={onPressEditGenres}
                      size="small"
                      type={"primary"}
                    />
                  </View>
                </View>
              ) : (
                genres?.map((genre, index) => {
                  const firstWord = genre.genre_name.split(" ")[0];
                  const backgroundColor =
                    colorsBackground[index % colorsBackground.length];
                  const colorsTitle = colorsLabel[index % colorsLabel.length];
                  return (
                    <View
                      key={index}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    >
                      <View
                        style={{
                          backgroundColor,
                          borderRadius: 30,
                          height: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingHorizontal: 12,
                          pointerEvents: "none",
                        }}
                      >
                        <NunitoText
                          style={{
                            color: colorsTitle,
                            fontSize: 14,
                            textAlign: "center",
                          }}
                        >
                          {firstWord}
                        </NunitoText>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
            {bEdit && (
              <TouchableOpacity style={styles.editIcon} onPress={onPressEdit}>
                <Ionicons name="create-outline" size={32} />
              </TouchableOpacity>
            )}
            {bConfig && (
              <TouchableOpacity
                style={styles.configIcon}
                onPress={onPressConfig}
              >
                <Ionicons name="cog-outline" size={32} />
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
      <View style={{ marginStart: marginStart }}>
        <View style={styles.nameRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <NunitoText style={[styles.name, dynamicTextStyle]}>
              {name}
            </NunitoText>
            {isAuthor && (
              <View style={styles.isAuthorContainer}>
                <VerifiedIcon width={16} height={16} fill={theme.primary} />
                <NunitoText style={[styles.isAuthorText, dynamicTextStyle]}>
                  {Strings.author}
                </NunitoText>
              </View>
            )}
          </View>

          {following != undefined && (
            <TouchableOpacity onPress={onPressFollow}>
              <View
                style={{
                  backgroundColor: following
                    ? themeName === "dark"
                      ? theme.Background
                      : theme.white
                    : theme.primary,
                  borderRadius: 30,
                  height: 25,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <NunitoText
                  style={{
                    color: following
                      ? themeName === "dark"
                        ? theme.white
                        : theme.primary
                      : theme.white,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {following ? "Seguindo" : "Seguir"}
                </NunitoText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;

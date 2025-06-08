import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import VerifiedIcon from "../../assets/images/ic_verified.svg";
import Strings from "@/app/constants/Strings";
import DefaultProfileHeaderImage from "../../assets/images/default_profile_header_image.png";
import { Ionicons } from "@expo/vector-icons";
import profileUser from "../../assets/images/profile-user.png";
import { Genre } from "@/app/models/Genre";
import CustomButton from "../Buttons/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
interface ProfileHeaderProps {
  marginStart: number;
  profileImageUrl?: string;
  name: string;
  isAuthor: boolean;
  bEdit?: boolean;
  following?: boolean;
  bEditPicture?: boolean;
  bConfig?: boolean;
  genres?: Genre[];
  isEditMode: boolean;
  onPressFollow?:() => void;
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
  bEditPicture = false,
  bConfig = false,
  genres,
  isEditMode = false,
  onPressFollow,
  onPressEdit,
  onPressConfig,
  onPressCameraIcon,
  onPressEditGenres,
}) => {
  const { theme } = useTheme();
  const colorsBackground = ["#9E0E53AA", "#F4D06F", "#388383C7"];
  const colorsLabel = ["#FFFFFF", "#000000", "#FFFFFF"];

  const dynamicTextStyle: TextStyle = {
    color: theme.primaryText,
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.profileImageContainer}>
        <ImageBackground
          source={DefaultProfileHeaderImage}
          style={styles.backgroundImage}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isEditMode && bEditPicture ? (
              <View
                style={[
                  styles.profileImage,
                  {
                    marginStart: marginStart,
                    backgroundColor: "gray",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onPressCameraIcon}
                  style={styles.cameraIcon}
                >
                  <Ionicons name="camera" size={48} color={theme.white} />
                </TouchableOpacity>
              </View>
            ) : (
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
              </TouchableOpacity>
            )}

            {bEdit && (
              <TouchableOpacity style={styles.editIcon} onPress={onPressEdit}>
                <Ionicons name="create-outline" size={32} />
              </TouchableOpacity>
            )}
            
            {bConfig && (
              <TouchableOpacity style={styles.configIcon} onPress={onPressConfig}>
                <Ionicons name="cog-outline" size={32} />
              </TouchableOpacity>
            )}

            {
              <View
                style={{
                  paddingLeft: 10,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  paddingRight: 6,
                }}
              >
                {bEditPicture ? (
                  <View style={{ paddingLeft: 6 }}>
                    <View
                      style={{
                        borderRadius: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 8,
                        top: "240%",
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
                      <View key={index} style={{ paddingLeft: 10 }}>
                        <View
                          style={{
                            backgroundColor,
                            borderRadius: 30,
                            height: 25,
                            maxWidth: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 8,
                            pointerEvents: "none",
                            top: "240%",
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
            }
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
                backgroundColor: following ? theme.white : theme.primary,
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
                  color: following ? theme.primary : theme.white,
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
  cameraIcon: {
    height: 48,
    width: 48,
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

export default ProfileHeader;

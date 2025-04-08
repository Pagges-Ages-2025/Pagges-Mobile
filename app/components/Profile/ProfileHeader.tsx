import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextStyle,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import VerifiedIcon from "../../assets/images/ic_verified.svg";
import Strings from "@/app/constants/Strings";
import DefaultProfileHeaderImage from "../../assets/images/default_profile_header_image.png";

interface ProfileHeaderProps {
  marginStart: number;
  profileImageUrl: string;
  name: string;
  isAuthor: boolean;
}

const headerImageHeight = 123;
const profileImageSize = 87;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  marginStart,
  profileImageUrl,
  name,
  isAuthor,
}) => {
  const { theme } = useTheme();

  const dynamicTextStyle: TextStyle = {
    color: theme.primaryText,
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <ImageBackground
          source={DefaultProfileHeaderImage}
          style={styles.backgroundImage}
        >
          <Image
            source={{ uri: profileImageUrl }}
            style={[styles.profileImage, { marginStart: marginStart }]}
          />
        </ImageBackground>
      </View>
      <View style={{ marginStart: marginStart }}>
        <View style={styles.nameContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  backgroundImage: {
    width: "100%",
    height: headerImageHeight,
  },
  profileImage: {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: 50,
    marginTop: headerImageHeight * 0.75,
  },
  profileImageContainer: {
    flexDirection: "column",
    flex: 1,
    height: headerImageHeight * 0.75 + profileImageSize,
  },
  genresContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
  },
  username: {
    fontSize: 18,
    fontWeight: 400,
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
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

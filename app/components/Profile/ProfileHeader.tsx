import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextStyle,
} from "react-native";
import FavouriteGenreLabel from "../Labels/FavouriteGenreLabel";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";

interface ProfileHeaderProps {
  marginStart: number;
  profileImageUrl: string;
  backgroundImageUrl: string;
  name: string;
  username: string;
  genres: Array<{
    text: string;
    textColor: string;
    backgroundColor: string;
  }>;
}

const headerImageHeight = 123;
const profileImageSize = 87;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  marginStart,
  profileImageUrl,
  backgroundImageUrl,
  name,
  username,
  genres,
}) => {
  const { theme } = useTheme();

  const dynamicTextStyle: TextStyle = {
    color: theme.primaryText,
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <ImageBackground
          source={{ uri: backgroundImageUrl }}
          style={styles.backgroundImage}
        >
          <Image
            source={{ uri: profileImageUrl }}
            style={[styles.profileImage, { marginStart: marginStart }]}
          />
        </ImageBackground>
        <View
          style={[
            styles.genresContainer,
            { marginStart: marginStart + profileImageSize + 10 },
          ]}
        >
          {genres.map((genre) => (
            <FavouriteGenreLabel
              key={genre.text}
              text={genre.text}
              textColor={genre.textColor}
              backgroundColor={genre.backgroundColor}
              style={styles.genreLabel}
            />
          ))}
        </View>
      </View>
      <View style={{ marginStart: marginStart }}>
        <NunitoText style={[styles.name, dynamicTextStyle]}>{name}</NunitoText>
        <NunitoText style={[styles.username, dynamicTextStyle]}>
          {username}
        </NunitoText>
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
  genreLabel: {
    marginEnd: 8,
  },
});

export default ProfileHeader;

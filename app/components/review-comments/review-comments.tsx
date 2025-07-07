import { base64Uri } from "@/app/utils/imageUtils";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import profile from "../../assets/images/profile.png";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";

type Props = TextInputProps & {
  comment?: boolean;
  byAuthor?: boolean;
  fullNamePostAuthor: string;
  datePost: string;
  text: string;
  photoPostAuthor?: string;
  onPress?: () => void;
  loading?: boolean;
};
interface BookPageProps {
  likesNumber?: number;
  commentsNumber?: number;
  repostNumber?: number;
}

type CombinedProps = Props & BookPageProps;

export const ReviewComment = forwardRef(
  (props: CombinedProps, ref: React.Ref<any>) => {
    const {
      comment,
      byAuthor,
      fullNamePostAuthor,
      datePost,
      text,
      photoPostAuthor,
      likesNumber,
      commentsNumber,
      repostNumber,
      onPress,
      loading = false,
    } = props;
    const { theme } = useTheme();
    const photo = photoPostAuthor
      ? { uri: base64Uri(photoPostAuthor) }
      : profile;
    const textValue =
      comment && text.length > 100 ? text.substring(0, 100) : text;
    const likesNumberValue = likesNumber || 0;
    const commentsNumberValue = commentsNumber || 0;
    const repostNumberValue = repostNumber || 0;

    const calculateDaysAgo = (datePost: string) => {
      const currentDate = new Date();
      const postDate = new Date(datePost);

      if (isNaN(postDate.getTime())) {
        return "Data inválida";
      }

      const timeDifference = currentDate.getTime() - postDate.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

      if (daysDifference < 1) {
        return `Hoje`;
      } else if (daysDifference < 7) {
        return `${daysDifference}d`;
      } else if (daysDifference < 30) {
        const weeks = Math.floor(daysDifference / 7);
        return `${weeks}s`;
      } else if (daysDifference < 365) {
        const months = Math.floor(daysDifference / 30);
        return `${months}m`;
      } else {
        const years = Math.floor(daysDifference / 365);
        return `${years}a`;
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={onPress ? 1 : 1}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.container}>
          {byAuthor && (
            <View
              style={[
                styles.authorBackground,
                { backgroundColor: theme.authorBackgroundComment },
              ]}
            />
          )}
          <View style={styles.authorInfosContainer}>
            <Image source={photo} style={styles.authorPostImage} />
            <NunitoText
              style={[
                styles.authorName,
                { color: byAuthor ? theme.primary : theme.quinaryText },
              ]}
            >
              {fullNamePostAuthor}
            </NunitoText>
            <NunitoText
              style={{ color: "gray", fontSize: 10, paddingHorizontal: 5 }}
            >
              •
            </NunitoText>
            {byAuthor ? (
              <NunitoText style={styles.datePost}>Autor(a)</NunitoText>
            ) : (
              <NunitoText style={styles.datePost}>
                {calculateDaysAgo(datePost)}
              </NunitoText>
            )}
          </View>
          <View
            style={{ paddingLeft: 45, paddingBottom: 15, paddingRight: 15 }}
          >
            <NunitoText
              style={[styles.textPost, { color: theme.textColorReview }]}
              numberOfLines={comment ? 3 : undefined}
            >
              {textValue}
            </NunitoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 45,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="hearto" size={15} color="gray" />
              <NunitoText
                style={[
                  styles.textPost,
                  { paddingLeft: 5, color: theme.textColorReview },
                ]}
              >
                {likesNumberValue}
              </NunitoText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <EvilIcons name="comment" size={22} color="gray" />
              <NunitoText
                style={[
                  styles.textPost,
                  { paddingLeft: 5, color: theme.textColorReview },
                ]}
              >
                {commentsNumberValue}
              </NunitoText>
              {loading && (
                <View style={{ marginLeft: 5 }}>
                  <ActivityIndicator size="small" color="gray" />
                </View>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* achar outro icone de repost */}
              <Feather name="rotate-ccw" size={15} color="gray" />
              <NunitoText
                style={[
                  styles.textPost,
                  { paddingLeft: 5, color: theme.textColorReview },
                ]}
              >
                {repostNumberValue}
              </NunitoText>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(217, 217, 217, 0.5)",
              width: "100%",
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    width: "100%",
    flex: 1,
  },
  authorInfosContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  authorPostImage: {
    width: 35,
    height: 35,
    resizeMode: "cover",
    borderRadius: 50,
    marginRight: 10,
  },
  textPost: {
    // color: "gray",
    fontSize: 14,
    textAlign: "justify",
    fontWeight: "light",
    flexWrap: "wrap",
  },
  datePost: {
    color: "gray",
    fontSize: 15,
    fontWeight: "light",
  },
  authorBackground: {
    position: "absolute",
    top: -10,
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    //backgroundColor: "rgba(156, 15, 83, 0.07)",
  },
});

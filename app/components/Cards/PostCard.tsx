import Strings from "@/app/constants/Strings";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { base64Uri } from "../../utils/imageUtils";
import NunitoText from "../Texts/NunitoText";

type FontWeight = "light" | "regular" | "semibold" | "bold";

interface PostCardProps {
  title: string;
  subtitle: string;
  bookcover?: string;
  username: string;
  profileImage?: string;
  likes: number;
  repost: number;
  comments: number;
  bSpoiler: boolean;
  fontWeight?: FontWeight;
  onPressRepost?: () => void;
  onPressLike?: () => void;
  onPressOptions?: () => void;
  onPress?: () => void;
  onPressUser?: () => void;
}

const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
  light: "300",
  regular: "400",
  semibold: "600",
  bold: "700",
};

const PostCard: React.FC<PostCardProps> = ({
  title,
  subtitle,
  bookcover,
  username,
  profileImage,
  likes,
  repost,
  comments,
  bSpoiler: initialSpoiler,
  fontWeight = "regular",
  onPressRepost,
  onPressLike,
  onPressOptions,
  onPress,
  onPressUser,
}) => {
  const { theme } = useTheme();
  const [bSpoiler, setBSpoiler] = useState(initialSpoiler);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLikePress = () => {
    setLiked(!liked);
    onPressLike?.();
  };

  const renderSpoilerOverlay = () => {
    if (!bSpoiler) return null;

    return (
      <TouchableOpacity
        onPress={() => setBSpoiler(false)}
        style={[
          styles.spoilerOverlay,
          { backgroundColor: theme.spoilerOverlay },
        ]}
        activeOpacity={0.9}
      >
        <View style={styles.spoilerContent}>
          <Ionicons
            name="warning"
            size={32}
            color={theme.spoilerText}
            style={styles.spoilerIcon}
          />
          <NunitoText
            style={[styles.spoilerTitle, { color: theme.spoilerText }]}
          >
            {Strings.spoilerWarning}
          </NunitoText>
          <NunitoText
            style={[styles.spoilerSubtitle, { color: theme.spoilerText }]}
          >
            {Strings.spoilerWarningSecondary}
          </NunitoText>
          <NunitoText style={[styles.spoilerTap, { color: theme.spoilerText }]}>
            Toque para revelar
          </NunitoText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    const shouldTruncate = subtitle.length > 120;
    const displayText =
      shouldTruncate && !isExpanded
        ? `${subtitle.substring(0, 120).trim()}...`
        : subtitle;

    return (
      <View style={styles.contentContainer}>
        <NunitoText
          style={[styles.subtitle, { color: theme.primaryText }]}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {displayText}
        </NunitoText>

        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.expandButton}
            activeOpacity={0.7}
          >
            <NunitoText style={[styles.expandText, { color: theme.primary }]}>
              {isExpanded ? "Ver menos" : "Ver mais"}
            </NunitoText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.Background }]}
      activeOpacity={onPress ? 0.95 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[styles.card, { backgroundColor: theme.postCardBackground }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={onPressUser}
            activeOpacity={onPressUser ? 0.7 : 1}
            disabled={!onPressUser}
          >
            {profileImage ? (
              <Image
                source={{ uri: base64Uri(profileImage) }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[styles.avatar, { backgroundColor: theme.quaternary }]}
              >
                <Ionicons name="person" size={16} color={theme.primary} />
              </View>
            )}
            <View style={styles.userText}>
              <NunitoText
                style={[styles.username, { color: theme.primaryText }]}
              >
                {username}
              </NunitoText>
              <NunitoText
                style={[styles.bookTitle, { color: theme.secondaryText }]}
              >
                {title}
              </NunitoText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressOptions}
            style={styles.optionsButton}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={theme.tertiaryText}
            />
          </TouchableOpacity>
        </View>

        {/* Book Cover and Content */}
        <View style={styles.mainContent}>
          {bookcover && (
            <Image
              source={{ uri: bookcover }}
              style={styles.bookCover}
              resizeMode="cover"
            />
          )}

          <View style={styles.textContainer}>{renderContent()}</View>
        </View>

        {/* Interaction Buttons */}
        <View style={styles.interactions}>
          <TouchableOpacity
            style={styles.interactionButton}
            onPress={onPressRepost}
            activeOpacity={0.7}
          >
            <Ionicons
              name="repeat-outline"
              size={20}
              color={theme.tertiaryText}
            />
            <NunitoText
              style={[styles.interactionText, { color: theme.tertiaryText }]}
            >
              {repost}
            </NunitoText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.interactionButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={20}
              color={liked ? theme.primary : theme.tertiaryText}
            />
            <NunitoText
              style={[
                styles.interactionText,
                { color: liked ? theme.primary : theme.tertiaryText },
              ]}
            >
              {likes}
            </NunitoText>
          </TouchableOpacity>
        </View>

        {/* Spoiler Overlay */}
        {renderSpoilerOverlay()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userText: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: "400",
  },
  optionsButton: {
    padding: 4,
  },
  mainContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
  },
  expandButton: {
    marginTop: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: "600",
  },
  interactions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  interactionText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  spoilerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  spoilerIcon: {
    marginBottom: 12,
  },
  spoilerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  spoilerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  spoilerTap: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.8,
  },
});

export default PostCard;

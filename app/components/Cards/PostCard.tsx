import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import Strings from "@/app/constants/Strings";

type FontWeight = "light" | "regular" | "semibold" | "bold";

interface PostCardProps {
  title: string;
  subtitle: string;
  bookcover?: string;
  username: string;
  likes: number;
  repost: number;
  comments: number;
  bSpoiler: boolean;
  fontWeight?: FontWeight;
  onPressComment?: () => void;
  onPressRepost?: () => void;
  onPressLike?: () => void;
  onPressOptions?: () => void;
  onPress?: () => void; // Adiciona onPress para o card inteiro
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
  likes,
  repost,
  comments,
  bSpoiler: initialSpoiler,
  fontWeight = "regular",
  onPressComment,
  onPressRepost,
  onPressLike,
  onPressOptions,
  onPress, // Novo
}) => {
  const { theme } = useTheme();
  const [bSpoiler, setBSpoiler] = useState(initialSpoiler);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const primaryTextColor = theme.primaryText;
  const secondaryTextColor = theme.tertiaryText;
  const postCardBackgroundColor = theme.postCardBackground;
  const iconDefaultColor = theme.primaryText;
  const iconActiveColor = theme.iconColor;
  const spoilerBackgroundColor = theme.spoilerOverlay;
  const spoilerTextColor = theme.spoilerText;
  const lineColor = theme.iconColor;

  const textStyle: TextStyle = {
    color: primaryTextColor,
    fontWeight: fontWeightMap[fontWeight],
  };

  const dynamicCardStyle = {
    backgroundColor: postCardBackgroundColor,
    ...(isExpanded ? {} : { height: 150 }),
  };

  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} disabled={!onPress}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Image style={styles.image} source={{ uri: bookcover }} />
          <View style={[styles.bookInfoContainer, dynamicCardStyle]}>
            {bSpoiler && (
              <TouchableOpacity
                onPress={() => setBSpoiler(false)}
                style={[
                  styles.overlay,
                  { backgroundColor: spoilerBackgroundColor },
                ]}
              >
                <View>
                  <NunitoText
                    style={[styles.spoiler, { color: spoilerTextColor }]}
                  >
                    {Strings.spoilerWarning}
                  </NunitoText>
                  <NunitoText
                    style={[styles.spoiler, { color: spoilerTextColor }]}
                  >
                    {Strings.spoilerWarningSecondary}
                  </NunitoText>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.topLine}>
              <NunitoText numberOfLines={1} style={[textStyle, styles.titleBook]}>
                {title}
              </NunitoText>
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={iconDefaultColor}
                onPress={onPressOptions}
              />
            </View>
            <NunitoText
              style={[styles.authorName, { color: secondaryTextColor }]}
            >
              {username}
            </NunitoText>
            <View style={[styles.line, { backgroundColor: lineColor }]} />

            {subtitle.length > 100 ? (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
              >
                {isExpanded ? (
                  <View>
                    <NunitoText style={[textStyle, styles.subtitle]}>
                      {subtitle}
                    </NunitoText>
                    <NunitoText style={[styles.readMore, textStyle]}>
                      {Strings.readLess}
                    </NunitoText>
                  </View>
                ) : (
                  <View style={styles.subtitleExpand}>
                    <NunitoText
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[textStyle, styles.subtitle]}
                    >
                      {subtitle.substring(0, 60).trim()}
                    </NunitoText>
                    <NunitoText style={[styles.readMore, textStyle]}>
                      {Strings.readMore}
                    </NunitoText>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <NunitoText style={[textStyle, styles.subtitle]}>
                {subtitle}
              </NunitoText>
            )}

            <View style={styles.interactionButtons}>
              <IconButton
                icon="chatbubble-outline"
                label={comments}
                color={iconDefaultColor}
                onPress={onPressComment}
                textStyle={textStyle}
              />
              <IconButton
                icon="repeat-outline"
                label={repost}
                color={iconDefaultColor}
                onPress={onPressRepost}
                textStyle={textStyle}
              />
              <IconButton
                icon={liked ? "heart" : "heart-outline"}
                label={likes}
                color={liked ? iconActiveColor : iconDefaultColor}
                onPress={() => {
                  setLiked(!liked);
                  onPressLike?.();
                }}
                textStyle={textStyle}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const IconButton = ({
  icon,
  label,
  color,
  onPress,
  textStyle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: number;
  color: string;
  onPress?: () => void;
  textStyle: TextStyle;
}) => (
  <TouchableOpacity style={styles.buttonColumn} onPress={onPress}>
    <Ionicons name={icon} size={20} color={color} />
    <NunitoText style={textStyle}>{label}</NunitoText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  authorName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  bookInfoContainer: {
    borderRadius: 25.6,
    justifyContent: "flex-start",
    padding: 15,
    width: "75%",
  },
  buttonColumn: {
    alignItems: "center",
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
  },
  cardContainer: {
    flexDirection: "row",
    width: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    width: "100%",
  },
  image: {
    borderRadius: 25,
    height: 150,
    marginRight: 10,
    width: 95,
  },
  interactionButtons: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "flex-end",
    marginTop: 10,
  },
  line: {
    height: 1,
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    borderRadius: 25.6,
    justifyContent: "center",
    zIndex: 2,
  },
  readMore: {
    fontWeight: "bold",
    marginTop: 4,
  },
  spoiler: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    paddingTop: 4,
    textAlign: "justify",
  },
  subtitleExpand: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  titleBook: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  topLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 8,
  },
});

export default PostCard;

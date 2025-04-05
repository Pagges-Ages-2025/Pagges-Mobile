import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import NunitoText from "../Texts/NunitoText";

interface FavouriteGenreLabelProps {
  style?: StyleProp<ViewStyle>;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const FavouriteGenreLabel: React.FC<FavouriteGenreLabelProps> = ({
  style,
  text,
  textColor,
  backgroundColor,
}) => {
  return (
    <View
      style={[style, styles.container, { backgroundColor: backgroundColor }]}
    >
      <NunitoText
        style={[styles.text, { color: textColor }]}
        allowFontScaling={false}
      >
        {text}
      </NunitoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "baseline",
  },
  text: {
    fontSize: 12,
    fontWeight: 400,
  },
});

export default FavouriteGenreLabel;

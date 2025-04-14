import React from "react";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";

type Color = 'primary' | 'secondary';

interface CancelPostProps {
  isFollowing: boolean;
  color?: Color;
  size?: number;
  onFollowChange: (newState: boolean) => void;
}

export default function CancelPost({
  isFollowing,
  color = 'primary',
  size = 40,
  onFollowChange,
}: CancelPostProps) {
  const { theme } = useTheme();

  function onPress() {
    onFollowChange(!isFollowing);
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          {
            width: 150,
            height:100,
            backgroundColor: "white"
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <NunitoText style={[styles]}>
          {"Cancel"}
        </NunitoText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          {
            width: 50,
            height:30,
            backgroundColor: "#366C6C",
            alignContent: "center"
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <NunitoText style={[]}>
          {"Post"}
        </NunitoText>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  baseText: {
    textAlign: "center",
  },
});

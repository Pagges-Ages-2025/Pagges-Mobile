import React from "react";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Color = 'primary' | 'secondary';

interface FollowButtonProps {
  isFollowing: boolean;
  color?: Color;
  size?: number;
  onFollowChange: (newState: boolean) => void;
}

export default function FollowButton({
  isFollowing,
  color = 'primary',
  size = 40,
  onFollowChange,
}: FollowButtonProps) {
  const { theme } = useTheme();

  function onPress() {
    onFollowChange(!isFollowing);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <SimpleLineIcons
        name={isFollowing ? "user-unfollow" : "user-follow"}
        size={size}
        color={color === 'secondary' ? theme.secondary : theme.primary}
      />
    </TouchableOpacity>
  );
}

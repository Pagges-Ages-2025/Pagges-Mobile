import React from "react";
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Color = 'primary' | 'secondary';

interface EditProfileButtonProps {
  color?: Color;
  size?: number;
  onPress?: () => void;
}

export default function EditProfileButton({
  color = 'primary',
  size = 40,
  onPress,
}: EditProfileButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons
        name="square-edit-outline"
        size={size}
        color={color === 'secondary' ? theme.secondary : theme.primary}
      />
    </TouchableOpacity>
  );
}

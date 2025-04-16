import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";

type ButtonType = "primary" | "outlined" | "secondary" | "outlinedSecondary";
type ButtonSize = "small" | "medium" | "large";
type FontWeight = "light" | "regular" | "semibold" | "bold";

interface SelectionButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  isSelect?: boolean;
  fontWeight?: FontWeight;
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  height?: number;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  type = "outlined",
  size = "medium",
  fontWeight = "regular",
  title,
  onPress,
  containerStyle,
  textStyle,
  isSelect = false,
  height,
}) => {
  const { theme, themeName } = useTheme();
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = (event: GestureResponderEvent) => {
    setIsSelected(!isSelected);
    onPress?.(event);
  };

  const isOutlined = type === "outlined";
  const isSecondary = type === "secondary";
  const isOutlinedSecondary = type === "outlinedSecondary";

  const sizeStyles = {
    small: {
      height: 40,
      paddingHorizontal: 20,
      fontSize: 14,
    },
    medium: {
      height: 50,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    large: {
      height: 60,
      paddingHorizontal: 28,
      fontSize: 18,
    },
  }[size];

  const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
    light: "300",
    regular: "500",
    semibold: "700",
    bold: "900",
  };

  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: isSelected
      ? theme.primary
      : isOutlined || isOutlinedSecondary
        ? "transparent"
        : isSecondary
          ? theme.secondary
          : theme.primary,
    borderColor: isOutlined
      ? theme.primary
      : isOutlinedSecondary
        ? theme.secondary
        : undefined,
    borderWidth: isOutlined || isOutlinedSecondary ? 2 : undefined,
    height: height ?? sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    alignSelf: "flex-start", // 👈 importante pra permitir largura dinâmica
  };

  const dynamicTextStyle: TextStyle = {
    color:
      isOutlined || isOutlinedSecondary
        ? isSelected
          ? theme.white
          : themeName === "dark"
            ? theme.primaryText
            : isOutlined
              ? theme.primary
              : theme.secondary
        : "white",
    fontSize: sizeStyles.fontSize,
    fontWeight: fontWeightMap[fontWeight],
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, dynamicButtonStyle, containerStyle]}
      onPress={handlePress}
      disabled={isSelect}
      activeOpacity={0.8}
    >
      <NunitoText style={[styles.baseText, dynamicTextStyle, textStyle]}>
        {title}
      </NunitoText>
    </TouchableOpacity>
  );
};

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

export default SelectionButton;
import React from "react";
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

type ButtonType = "primary" | "outlined" | "secondary";
type ButtonSize = "small" | "medium" | "large";
type FontWeight = "light" | "regular" | "semibold" | "bold";

interface CustomButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  fontWeight?: FontWeight;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "primary",
  size = "medium",
  fontWeight = "regular",
  title,
  onPress,
  containerStyle,
  textStyle,
}) => {
  const { theme, themeName } = useTheme();


  // Tipos de botão
  const isOutlined = type === "outlined";
  const isSecondary = type === "secondary";

  // Tamanho do Botão
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

  // Fontes do botão
  const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
    light: "300",
    regular: "500",
    semibold: "700",
    bold: "900",
  };

  // Estilos dinâmicos do botão
  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: isOutlined
      ? "transparent"
      : isSecondary
      ? theme.secondary
      : theme.primary,
    borderColor: isOutlined ? theme.primary : undefined,
    borderWidth: isOutlined ? 2 : undefined,
    height: sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
  };

  const dynamicTextStyle: TextStyle = {
    color: isOutlined
      ? themeName === "dark"
        ? theme.primaryText
        : theme.primary
      : "white",
    fontSize: sizeStyles.fontSize,
    fontWeight: fontWeightMap[fontWeight],
  };
  

  return (
    <TouchableOpacity
      style={[styles.baseButton, dynamicButtonStyle, containerStyle]}
      onPress={onPress}
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
    width: "100%",
  },
  baseText: {
    textAlign: "center",
  },
});

export default CustomButton;

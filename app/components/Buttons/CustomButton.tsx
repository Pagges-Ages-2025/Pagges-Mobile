/* eslint-disable react-native/no-inline-styles */
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

// Tipos de variações do botão
type ButtonType = "primary" | "outlined" | "secondary" | "outlinedSecondary";
type ButtonSize = "small" | "medium" | "large";
type FontWeight = "light" | "regular" | "semibold" | "bold";

interface CustomButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  isDisabled?: boolean;
  fullWidth?: boolean;
  fontWeight?: FontWeight;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /**
   * ✅ Propriedades opcionais que permitem definir
   *    a largura e a altura do botão manualmente.
   */
  width?: number | string;
  height?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "primary",
  size = "medium",
  fontWeight = "regular",
  title,
  onPress,
  containerStyle,
  textStyle,
  isDisabled = false,
  fullWidth = true,
  width,
  height,
}) => {
  const { theme, themeName } = useTheme();

  // Verifica o tipo do botão
  const isOutlined = type === "outlined";
  const isSecondary = type === "secondary";
  const isOutlinedSecondary = type === "outlinedSecondary";

  // Define estilos para cada tamanho
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

  // Mapeia o fontWeight para valores de fontWeight do React Native
  const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
    light: "300",
    regular: "500",
    semibold: "700",
    bold: "900",
  };

  // Estilo dinâmico do botão
  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: isOutlined
      ? "transparent"
      : isOutlinedSecondary
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
    /**
     * ✅ Se 'height' não for fornecido, usa a altura definida
     *    pela prop 'size'. Caso contrário, substitui pela prop 'height'.
     */
    height: height ?? sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
  };

  // Estilo dinâmico do texto
  const dynamicTextStyle: TextStyle = {
    color: isOutlined
      ? themeName === "dark"
        ? theme.primaryText
        : theme.primary
      : isOutlinedSecondary
      ? themeName === "dark"
        ? theme.primaryText
        : theme.secondary
      : "white",
    fontSize: sizeStyles.fontSize,
    fontWeight: fontWeightMap[fontWeight],
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        dynamicButtonStyle,
        containerStyle,
        {
          width: width ?? (fullWidth ? "100%" : "30%"),
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
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

export default CustomButton;
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonType = "primary" | "outlined" | "secondary";

interface CustomButtonProps {
  /** Tipo do botão:
   * primary - Botão preenchido (default)
   * outlined - Botão contornado (outline)
   * secondary - Botão secundário (ex.: fundo branco com borda verde)
   */
  type?: ButtonType;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "primary",
  title,
  onPress,
  containerStyle,
  textStyle,
}) => {
  let buttonStyle = styles.filledButton;
  let buttonTextStyle = styles.filledButtonText;

  if (type === "outlined") {
    buttonStyle = styles.outlineButton;
    buttonTextStyle = styles.outlineButtonText;
  } else if (type === "secondary") {
    buttonStyle = styles.secondaryButton;
    buttonTextStyle = styles.secondaryButtonText;
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, containerStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filledButton: {
    backgroundColor: "#9C0F5F",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  filledButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9C0F5F",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  outlineButtonText: {
    color: "#9C0F5F",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#9C0F5F",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomButton;

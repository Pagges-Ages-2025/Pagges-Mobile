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

type ButtonType = "primary" | "outlined" ;

interface SelectionButtonProps {
  type?: ButtonType;
  isSelect?: boolean;
  title: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  type = "outlined",
  title,
  
}) => {
  const { theme, themeName } = useTheme();
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    setIsSelected((x)=>x=!x)
  };

  const isOutlined = type === "outlined";


  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: isSelected
      ? theme.primary
      : isOutlined 
        ? "transparent"
          : theme.primary,
    borderColor: isOutlined
      ? theme.primary
        : undefined,
    borderWidth: isOutlined ? 2 : undefined,
    height: 40,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  };

  const dynamicTextStyle: TextStyle = {
    color:
      isOutlined
        ? isSelected
          ? theme.white
          : themeName === "dark"
            ? theme.primaryText
            : isOutlined
              ? theme.primary
              : theme.secondary
        : "white",
    fontSize: 14,
    fontWeight: "regular",
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, dynamicButtonStyle]}
      onPress={handlePress}
     
      activeOpacity={0.8}
    >
      <NunitoText style={[styles.baseText, dynamicTextStyle]}>
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

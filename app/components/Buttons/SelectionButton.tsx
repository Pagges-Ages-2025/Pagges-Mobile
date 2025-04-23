import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";

interface SelectionButtonProps {
  title: string;
  isSelected: boolean;
  onSelectChange: (selected: boolean) => void;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  title,
  isSelected,
  onSelectChange,
}) => {
  const { theme, themeName } = useTheme();

  const handlePress = () => {
    onSelectChange(!isSelected);
  };

  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: isSelected ? theme.primary : "transparent",
    borderColor: theme.primary,
    borderWidth: 2,
    height: 40,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  };

  const dynamicTextStyle: TextStyle = {
    color: isSelected
      ? theme.white
      : themeName === "dark"
        ? theme.primaryText
        : theme.primary,

    fontSize: 14,
    fontWeight: "900",
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

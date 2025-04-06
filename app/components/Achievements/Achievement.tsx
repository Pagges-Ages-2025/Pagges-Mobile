import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface CustomButtonProps {
  color?: string;
  backgroundColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  color,
  backgroundColor,
}) => {
  const { theme } = useTheme();

  const dynamicStyles = () => ({
    borderColor: color || theme.iconColor,
    backgroundColor: backgroundColor || theme.quaternary,
  });

  const dynamicIconStyles = () => ({
    color: color || theme.iconColor,
  });

  return (
    <TouchableOpacity style={[styles.iconeArea, dynamicStyles()]}>
      <Ionicons name="ribbon" size={30} style={dynamicIconStyles()}></Ionicons>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconeArea: {
    alignItems: "center",
    borderRadius: 60,
    borderWidth: 2,
    height: 60,
    justifyContent: "center",
    padding: 10,
    width: 60,
  },
});

export default CustomButton;

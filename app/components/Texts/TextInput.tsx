import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface PaggesTextInputIconNameProps {
  style?: StyleProp<ViewStyle>;
  placeholder: string;
  value: string;
  leftIconName?: IoniconsName;
  rightIconName?: IoniconsName;
  isRightIconEnabled?: boolean;
  isSecureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  onRightIconClick?: () => void;
}

const PaggesTextInput: React.FC<PaggesTextInputIconNameProps> = ({
  style,
  placeholder,
  value,
  leftIconName,
  rightIconName,
  isRightIconEnabled = true,
  isSecureTextEntry = false,
  onChangeText,
  onRightIconClick,
}) => {
  const { theme } = useTheme();
  return (
    <PaggesTextInputCustomIcons
      style={style}
      placeholder={placeholder}
      value={value}
      leftIcon={
        leftIconName && (
          <Ionicons
            name={leftIconName}
            size={24}
            color={theme.placeholder}
            style={styles.leftIcon}
          />
        )
      }
      rightIcon={
        rightIconName && (
          <TouchableOpacity
            disabled={!isRightIconEnabled}
            onPress={onRightIconClick}
          >
            <Ionicons
              name={rightIconName}
              size={24}
              color={theme.placeholder}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )
      }
      isSecureTextEntry={isSecureTextEntry}
      onChangeText={onChangeText}
    />
  );
};

interface PaggesTextInputCustomIconsProps {
  style?: StyleProp<ViewStyle>;
  placeholder: string;
  value: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isSecureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}

const PaggesTextInputCustomIcons: React.FC<PaggesTextInputCustomIconsProps> = ({
  style,
  placeholder,
  value,
  leftIcon,
  rightIcon,
  isSecureTextEntry = false,
  onChangeText,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[style, styles.inputContainer, { borderColor: theme.placeholder }]}
    >
      {leftIcon}
      <TextInput
        style={[styles.input, { color: theme.primaryText }]}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
        numberOfLines={1}
        onChangeText={onChangeText}
        autoCapitalize="none"
        secureTextEntry={isSecureTextEntry}
      />
      {rightIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
  },
  leftIcon: {
    margin: 12,
  },
  rightIcon: {
    margin: 12,
  },
  input: {
    flex: 1,
  },
});

export { PaggesTextInput, PaggesTextInputCustomIcons };

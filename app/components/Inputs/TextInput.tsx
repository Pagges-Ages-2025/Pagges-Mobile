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
  multiline?: boolean;
  leftIconName?: IoniconsName;
  rightIconName?: IoniconsName;
  isRightIconEnabled?: boolean;
  isSecureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  onRightIconClick?: () => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad";
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
  keyboardType = "default",
  multiline = false,
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
            style={[styles.icon, multiline && styles.iconMultiline]}
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
              style={[styles.icon, multiline && styles.iconMultiline]}
            />
          </TouchableOpacity>
        )
      }
      isSecureTextEntry={isSecureTextEntry}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  );
};

interface PaggesTextInputCustomIconsProps {
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  placeholder: string;
  value: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isSecureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "url";
}

const PaggesTextInputCustomIcons: React.FC<PaggesTextInputCustomIconsProps> = ({
  style,
  placeholder,
  value,
  leftIcon,
  rightIcon,
  isSecureTextEntry = false,
  onChangeText,
  keyboardType = "default",
  multiline = false,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        style, 
        styles.inputContainer, 
        { borderColor: theme.placeholder },
        multiline && styles.multilineContainer
      ]}
    >
      {leftIcon}
      <TextInput
        style={[
          styles.input, 
          { color: theme.primaryText },
          multiline && styles.multilineInput
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
        numberOfLines={multiline ? undefined : 1}
        onChangeText={onChangeText}
        autoCapitalize="none"
        secureTextEntry={isSecureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {rightIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: 12,
  },
  iconMultiline: {
    marginTop: 12,
  },
  input: {
    flex: 1,
  },
  inputContainer: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  multilineInput: {
    height: "100%",
    paddingBottom: 12,
    paddingTop: 12,
  },
});

export { PaggesTextInput, PaggesTextInputCustomIcons };

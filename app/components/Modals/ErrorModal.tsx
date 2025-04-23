import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";
import CustomButton from "../Buttons/CustomButton";

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: "error" | "warning";
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  onClose,
  title,
  description,
  type,
}) => {
  const { theme } = useTheme();
  const color = type === "error" ? theme.errorColor : theme.tertiary;
  const iconName = type === "error" ? "closecircleo" : "warning";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.Background,
              borderColor: color,
              borderWidth: 3,
            },
          ]}
        >
          <AntDesign
            name={iconName}
            size={50}
            style={{ paddingBottom: 15 }}
            color={color}
          />

          <NunitoText
            style={[
              styles.title,
              { color: color, fontWeight: "bold", fontSize: 26 },
            ]}
          >
            {title}
          </NunitoText>

          <NunitoText
            style={[styles.description, { color: color, fontWeight: "regular", fontSize: 20 }]}
          >
            {description}
          </NunitoText>

          <CustomButton
            title="Fechar"
            onPress={onClose}
            containerStyle={{ backgroundColor: color }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
  },
  title: {
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ErrorModal;

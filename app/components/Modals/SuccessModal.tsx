import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../Buttons/CustomButton";
import NunitoText from "../Texts/NunitoText";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  action?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title,
  description,
  action = "Fechar",
}) => {
  const { theme } = useTheme();

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
              borderColor: theme.successColor || "#4CAF50",
              borderWidth: 3,
            },
          ]}
        >
          <AntDesign
            name="checkcircleo"
            size={50}
            style={{ paddingBottom: 15 }}
            color={theme.successColor || "#4CAF50"}
          />

          <NunitoText
            style={[
              styles.title,
              {
                color: theme.successColor || "#4CAF50",
                fontWeight: "bold",
                fontSize: 26,
              },
            ]}
          >
            {title}
          </NunitoText>

          <NunitoText
            style={[
              styles.description,
              {
                color: theme.primaryText,
                fontWeight: "regular",
                fontSize: 18,
              },
            ]}
          >
            {description}
          </NunitoText>

          <CustomButton
            title={action}
            onPress={onClose}
            containerStyle={{
              backgroundColor: theme.successColor || "#4CAF50",
              marginTop: 10,
            }}
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
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default SuccessModal;

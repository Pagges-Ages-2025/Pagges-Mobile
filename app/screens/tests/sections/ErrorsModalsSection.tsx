import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import ErrorModal from "../../../components/Modals/ErrorModal";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useTheme } from "../../../context/ThemeContext";

const ErrorsModalsSection = () => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <Section
      title="Modais de Erro"
      isOpen={open}
      onToggle={toggle}
      type="title"
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Abrir Modal de Erro"
            onPress={() => setErrorVisible(true)}
            containerStyle={{ backgroundColor: theme.errorColor }}
          />

          <CustomButton
            title="Abrir Modal de Aviso"
            onPress={() => setWarningVisible(true)}
            containerStyle={{ backgroundColor: theme.tertiary }}
          />
        </View>

        {/* Modal de Erro */}
        <ErrorModal
          visible={errorVisible}
          onClose={() => setErrorVisible(false)}
          title="Erro"
          description="Não foi possível atualizar a imagem"
          type="error"
        />

        {/* Modal de Aviso */}
        <ErrorModal
          visible={warningVisible}
          onClose={() => setWarningVisible(false)}
          title="Aviso"
          description="Esta ação não pode ser desfeita. Tem certeza?"
          type="warning"
        />
      </View>
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
});

export default ErrorsModalsSection; 
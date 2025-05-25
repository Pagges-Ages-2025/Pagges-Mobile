import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import NunitoText from "../components/Texts/NunitoText";
import CustomButton from "../components/Buttons/CustomButton";
import ErrorModal from "../components/Modals/ErrorModal";
import DailyCheckModal from "../components/Modals/DailyCheckModal";
import { useTheme } from "../context/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import ChallangesAPI from "../services/challanges";

interface Alternatives {
  answer: string;
  alternative_id: number;
}

interface DailyChallengeProps {
  visible: boolean;
  onClose: () => void;
  question: string;
  alternatives: Alternatives[];
  points: number;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({
  visible,
  onClose,
  question,
  alternatives,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(
    null
  );
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errormessage, setErrorMessage] = useState<string>(
    "Selecione uma alternativa antes de confirmar."
  );

  const handleSelect = (index: number) => {
    setSelectedAlternative(index);
  };

  const handleConfirm = async () => {
    if (selectedAlternative === null) {
      setShowErrorModal(true);
      return;
    }

    const isAnswerCorrect = await ChallangesAPI().checkAnswar(
      alternatives[selectedAlternative].alternative_id
    );

    setIsCorrect(isAnswerCorrect);
    if(isCorrect == null) {
        setErrorMessage("Ja respondeu o desafio diario");
        setShowErrorModal(true);
    }
    setShowResult(true);
  };

  const handleClose = () => {
    setSelectedAlternative(null);
    setShowResult(false);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={[styles.container, { backgroundColor: theme.Background }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleClose}>
            <AntDesign name="arrowleft" size={30} color={theme.primary} />
          </TouchableOpacity>

          <View style={styles.challengeWrapperContainer}>
            <View style={styles.headerOverlayContainer}>
              <View
                style={[
                  styles.headerBackground,
                  { backgroundColor: theme.Background },
                ]}
              >
                <NunitoText style={[styles.header, { color: "black" }]}>
                  Desafio 21
                </NunitoText>
              </View>
            </View>

            <View
              style={[
                styles.desafioContainer,
                { borderColor: theme.secondary },
              ]}
            >
              <View style={styles.questionContainer}>
                <NunitoText
                  style={[styles.question, { color: theme.primaryText }]}
                >
                  {question}
                </NunitoText>
              </View>

              <View style={styles.alternativesContainer}>
                {alternatives.map((alternative, index) => (
                  <CustomButton
                    key={index}
                    title={alternative.answer}
                    onPress={() => handleSelect(index)}
                    type={
                      selectedAlternative === index
                        ? "secondary"
                        : "outlinedSecondary"
                    }
                    size="large"
                  />
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <CustomButton
                title="Confirmar"
                onPress={handleConfirm}
                type="secondary"
                size="large"
              />
            </View>
          </View>

          {isCorrect && <DailyCheckModal
            visible={showResult}
            onClose={() => {
              handleClose();
            }}
            isCorrect={isCorrect!}
          />}

          <ErrorModal
            visible={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            title="Atenção"
            description={errormessage}
            type="warning"
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  alternativesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  backButton: {
    left: 20,
    position: "absolute",
    top: 40,
    zIndex: 10,
  },
  challengeWrapperContainer: {
    paddingTop: 20,
    position: "relative",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  desafioContainer: {
    borderRadius: 30,
    borderWidth: 4,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  footer: {
    marginBottom: 40,
    marginTop: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
  },
  headerBackground: {
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
  },
  headerOverlayContainer: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  question: {
    fontSize: 20,
    marginBottom: 40,
    textAlign: "center",
  },
  questionContainer: {
    padding: 20,
  },
});

export default DailyChallenge;

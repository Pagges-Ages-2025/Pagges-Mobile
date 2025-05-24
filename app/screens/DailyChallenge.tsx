import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import NunitoText from "../components/Texts/NunitoText";
import CustomButton from "../components/Buttons/CustomButton";
import ErrorModal from "../components/Modals/ErrorModal";
import DailyCheckModal from "../components/Modals/DailyCheckModal";
import { useTheme } from "../context/ThemeContext";
import { AntDesign } from "@expo/vector-icons";

interface Alternative {
    text: string;
    isCorrect: boolean;
}

interface DailyChallengeProps {
    visible: boolean;
    onClose: () => void;
    question: string;
    alternatives: Alternative[];
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({
    visible,
    onClose,
    question,
    alternatives,
}) => {
    const { theme } = useTheme();
    const router = useRouter();
    const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

    const handleSelect = (index: number) => {
        setSelectedAlternative(index);
    };

    const handleConfirm = () => {
        if (selectedAlternative === null) {
            setShowErrorModal(true);
            return;
        }

        const isAnswerCorrect = alternatives[selectedAlternative].isCorrect;
        setIsCorrect(isAnswerCorrect);
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
                            <View style={[styles.headerBackground, { backgroundColor: theme.Background }]}>
                                <NunitoText style={[styles.header, { color: 'black' }]}>
                                    Desafio 21
                                </NunitoText>
                            </View>
                        </View>
                        
                        <View style={[styles.desafioContainer, { borderColor: theme.secondary }]}>
                            <View style={styles.questionContainer}>
                                <NunitoText style={[styles.question, { color: theme.primaryText }]}>
                                    {question}
                                </NunitoText>
                            </View>

                            <View style={styles.alternativesContainer}>
                                {alternatives.map((alternative, index) => (
                                    <CustomButton
                                        key={index}
                                        title={alternative.text}
                                        onPress={() => handleSelect(index)}
                                        type={selectedAlternative === index ? "secondary" : "outlinedSecondary"}
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

                    <DailyCheckModal
                        visible={showResult}
                        onClose={handleClose}
                        isCorrect={isCorrect}
                    />
                    
                    <ErrorModal
                        visible={showErrorModal}
                        onClose={() => setShowErrorModal(false)}
                        title="Atenção"
                        description="Selecione uma alternativa antes de confirmar."
                        type="warning"
                    />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
    },
    challengeWrapperContainer: {
        position: 'relative',
        paddingTop: 20,
    },
    headerOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center',
    },
    headerBackground: {
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: "center",
    },
    header: {
        fontSize: 36,
        fontWeight: "bold",
    },
    desafioContainer: {
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 4,
        paddingVertical: 40,
    },
    questionContainer: {
        padding: 20,
    },
    question: {
        fontSize: 20,
        marginBottom: 40,
        textAlign: "center",
    },
    alternativesContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    footer: {
        marginTop: 20,
        marginBottom: 40,
    }
});

export default DailyChallenge; 
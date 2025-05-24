import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NunitoText from "../Texts/NunitoText";
import CustomButton from "../Buttons/CustomButton";
import { useTheme } from "../../context/ThemeContext";

interface DailyCheckModalProps {
    visible: boolean;
    onClose: () => void;
    isCorrect: boolean;
    points?: number;
}

const DailyCheckModal: React.FC<DailyCheckModalProps> = ({
    visible,
    onClose,
    isCorrect,
    points = 50,
}) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.resultContainer, { backgroundColor: theme.Background, borderColor: theme.secondary }]}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: isCorrect ? "#4CAF50" : "#F44336" }
                        ]}
                    >
                        {isCorrect ? (
                            <AntDesign name="check" size={60} color="white" />
                        ) : (
                            <AntDesign name="close" size={60} color="white" />
                        )}
                    </View>

                    <NunitoText
                        style={[
                            styles.resultTitle,
                            { color: isCorrect ? "#4CAF50" : "#F44336", fontSize: 30 }
                        ]}
                    >
                        {isCorrect ? `+${points} pontos` : "Tente novamente amanhã..."}
                    </NunitoText>

                    <NunitoText
                        style={[
                            styles.resultSubtitle,
                            { color: isCorrect ? "#4CAF50" : "#F44336", fontSize: 24 }
                        ]}
                    >
                        {isCorrect ? "Parabéns!" : ""}
                    </NunitoText>

                    <CustomButton
                        title="Fechar"
                        onPress={onClose}
                        containerStyle={{
                            backgroundColor: isCorrect ? "#4CAF50" : "#F44336",
                            marginTop: 20
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        padding: 40,
        borderRadius: 30,
        borderWidth: 4,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    resultTitle: {
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    resultSubtitle: {
        marginBottom: 20,
    },
});

export default DailyCheckModal; 
import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from "../../context/ThemeContext";
import NunitoText from '../Texts/NunitoText';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  content?: string;
  nameBook?: string;
  onRate?: (rating: number) => void
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, content, nameBook, onRate }) => {
    const { theme } = useTheme();
    const [selectedStars, setSelectedStars] = useState(0);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalView, { backgroundColor: theme.quinaryText }]}>
            <View style={styles.headPopUp}>
                <NunitoText style={styles.text}>{content}</NunitoText>
                <Pressable
                    onPress={onClose}
                >
                    <EvilIcons name="close" size={22} color="gray" />
                </Pressable>
            </View>
          <NunitoText style={styles.titleBook}>{nameBook}</NunitoText>

            <View style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedStars(index + 1)}
                >
                    <AntDesign 
                        name={index < selectedStars ? "star" : "staro"} 
                        size={40} 
                        color={index < selectedStars ? theme.starColor : "gray"}
                    />
              </TouchableOpacity> 
            ))}
          </View>

            <View style={styles.buttonContainer}> 
                <Pressable
                    onPress={() => {
                        onRate?.(selectedStars)
                        onClose()
                    }}
                    disabled={selectedStars === 0}
                    style={[styles.button, { backgroundColor: selectedStars === 0? 'gray' : theme.primary }]}
                >
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <NunitoText style={[styles.buttonText, { color: theme.quinaryText }]}>Avaliar</NunitoText>
                    </View>
                </Pressable>
            </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center'
  },
  text: {
    marginBottom: 5,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 10
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleBook:{
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 5,
    paddingBottom: 30,
  },
  headPopUp: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingLeft: "35%"
  },
  buttonContainer: {
    width: "100%", 
    justifyContent: 'center'
    },
});

export default CustomModal;

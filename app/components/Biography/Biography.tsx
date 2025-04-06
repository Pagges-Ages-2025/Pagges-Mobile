import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "@/app/constants/Theme";
import { Feather } from "@expo/vector-icons";

interface BiographyProps {
  biographyText: string;
}

const Biography: React.FC<BiographyProps> = ({ biographyText }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [editing, setEditing] = useState(false);
  const [bioText, setBioText] = useState(biographyText);

  const saveBiography = () => {
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {editing ? (
        <>
          <View style={styles.header}>
            <NunitoText style={styles.title}>Biografia</NunitoText>
          </View>
          <TextInput
            style={styles.input}
            multiline
            value={bioText}
            onChangeText={setBioText}
            maxLength={250}
          />
          <TouchableOpacity onPress={saveBiography} style={styles.saveButton}>
            <NunitoText style={styles.saveText}>Salvar</NunitoText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <NunitoText style={styles.title}>Biografia</NunitoText>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Feather name="edit" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
          <NunitoText style={styles.bio}>{bioText}</NunitoText>
        </>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.secondaryText,
    },
    bio: {
      fontSize: 16,
      color: theme.secondaryText,
      lineHeight: 22,
      textAlign: "justify",
    },
    input: {
      borderColor: theme.secondaryText,
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      minHeight: 80,
      fontSize: 16,
      color: theme.secondaryText,
    },
    saveButton: {
      marginTop: 8,
      alignSelf: "flex-end",
      backgroundColor: theme.secondaryText,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    saveText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

export default Biography;

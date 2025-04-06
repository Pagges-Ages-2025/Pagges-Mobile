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
  const [originalBio, setOriginalBio] = useState(biographyText); // novo estado

  const startEditing = () => {
    setOriginalBio(bioText); // salva o texto antes da edição
    setEditing(true);
  };

  const saveBiography = () => {
    setEditing(false);
  };

  const cancelEditing = () => {
    setBioText(originalBio); // desfaz alterações
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NunitoText style={styles.title}>Biografia</NunitoText>
        {editing ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={cancelEditing}>
              <Feather name="x" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveBiography}>
              <Feather name="check" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Feather name="edit" size={18} color={theme.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {editing ? (
        <TextInput
          style={styles.input}
          multiline
          value={bioText}
          onChangeText={setBioText}
          maxLength={250}
          placeholder="Escreva sua biografia..."
          placeholderTextColor={theme.secondaryText}
        />
      ) : (
        <NunitoText style={styles.bio}>{bioText}</NunitoText>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 0,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      color: theme.secondaryText,
    },
    bio: {
      fontSize: 15,
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
      fontSize: 15,
      color: theme.secondaryText,
      textAlignVertical: "top", // garante que o texto fique no topo
      fontFamily: "Nunito-Regular", // <- garanta que essa fonte está carregada no projeto
    },
    actionButtons: {
      flexDirection: "row",
      columnGap: 10,
    },
  });

export default Biography;

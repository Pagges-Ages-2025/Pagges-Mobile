import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import FavouriteGenreLabel from "../../../components/Labels/FavouriteGenreLabel";
import { useTheme } from "../../../context/ThemeContext";

const GenreLabelSection = () => {
  const { theme } = useTheme();
  
  const [open, setOpen] = useState({
    labels: false,
    themed: true,
    custom: true,
    sizes: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Labels de Gênero"
      isOpen={open.labels}
      onToggle={() => toggle("labels")}
      type="title"
    >
      <Section
        title="Cores do Tema"
        isOpen={open.themed}
        onToggle={() => toggle("themed")}
      >
        <View style={styles.container}>
          <FavouriteGenreLabel
            text="Fantasia"
            textColor={theme.white}
            backgroundColor={theme.primary}
          />
          <FavouriteGenreLabel
            text="Ficção Científica"
            textColor={theme.white}
            backgroundColor={theme.secondary}
          />
          <FavouriteGenreLabel
            text="Romance"
            textColor={theme.white}
            backgroundColor={theme.tertiary}
          />
        </View>
      </Section>

      <Section
        title="Cores Personalizadas"
        isOpen={open.custom}
        onToggle={() => toggle("custom")}
      >
        <View style={styles.container}>
          <FavouriteGenreLabel
            text="Terror"
            textColor="#FFFFFF"
            backgroundColor="#FF0000"
          />
          <FavouriteGenreLabel
            text="Aventura"
            textColor="#003300"
            backgroundColor="#90EE90"
          />
          <FavouriteGenreLabel
            text="Mistério"
            textColor="#FFD700"
            backgroundColor="#4B0082"
          />
          <FavouriteGenreLabel
            text="História"
            textColor="#000000"
            backgroundColor="#FFB6C1"
          />
        </View>
      </Section>

      <Section
        title="Diferentes Tamanhos de Texto"
        isOpen={open.sizes}
        onToggle={() => toggle("sizes")}
      >
        <View style={styles.container}>
          <FavouriteGenreLabel
            text="Texto Curto"
            textColor={theme.white}
            backgroundColor={theme.primary}
          />
          <FavouriteGenreLabel
            text="Texto com Tamanho Médio Aqui"
            textColor={theme.white}
            backgroundColor={theme.secondary}
          />
          <FavouriteGenreLabel
            text="Texto Bem Longo Para Testar o Comportamento do Componente"
            textColor={theme.white}
            backgroundColor={theme.tertiary}
          />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 10,
  },
});

export default GenreLabelSection; 
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import PostCard from "../../../components/Cards/PostCard";
import { useTheme } from "../../../context/ThemeContext";

const PostCardSection = () => {
  const { theme } = useTheme();
  
  const [open, setOpen] = useState({
    cards: false,
    normal: true,
    spoiler: true,
    expanded: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <Section
      title="Cards de Post"
      isOpen={open.cards}
      onToggle={() => toggle("cards")}
      type="title"
    >
      <Section
        title="Card Normal"
        isOpen={open.normal}
        onToggle={() => toggle("normal")}
      >
        <View style={styles.container}>
          <PostCard
            title="O Pequeno Príncipe"
            subtitle="Uma história encantadora sobre amizade e amor."
            bookcover="https://m.media-amazon.com/images/I/41afCn3PQUL._SY445_SX342_.jpg"
            username="@leitor_aventureiro"
            likes={42}
            repost={12}
            comments={8}
            bSpoiler={false}
            fontWeight="regular"
            onPressComment={handlePress}
            onPressRepost={handlePress}
            onPressLike={handlePress}
            onPressOptions={handlePress}
          />
        </View>
      </Section>

      <Section
        title="Card com Spoiler"
        isOpen={open.spoiler}
        onToggle={() => toggle("spoiler")}
      >
        <View style={styles.container}>
          <PostCard
            title="Game of Thrones"
            subtitle="Não acredito que o Ned Stark morreu! Essa cena foi impactante e mudou completamente o rumo da história. A forma como George R.R. Martin construiu essa reviravolta foi brilhante."
            bookcover="https://m.media-amazon.com/images/I/51BHUR6hZaL._SY445_SX342_.jpg"
            username="@fã_de_fantasia"
            likes={156}
            repost={45}
            comments={67}
            bSpoiler={true}
            fontWeight="semibold"
            onPressComment={handlePress}
            onPressRepost={handlePress}
            onPressLike={handlePress}
            onPressOptions={handlePress}
          />
        </View>
      </Section>

      <Section
        title="Card com Texto Longo"
        isOpen={open.expanded}
        onToggle={() => toggle("expanded")}
      >
        <View style={styles.container}>
          <PostCard
            title="Dom Casmurro"
            subtitle="A obra-prima de Machado de Assis é uma narrativa envolvente que explora temas como ciúme, amor e traição. A complexidade psicológica de Bentinho e a enigmática Capitu criam uma trama que deixa o leitor constantemente questionando a verdade por trás dos acontecimentos. O estilo único do autor, com sua ironia refinada e análise profunda da sociedade brasileira do século XIX, torna este livro um clássico atemporal da literatura."
            bookcover="https://m.media-amazon.com/images/I/41c3W5JxDVL._SY445_SX342_.jpg"
            username="@literatura_br"
            likes={89}
            repost={23}
            comments={34}
            bSpoiler={false}
            fontWeight="bold"
            onPressComment={handlePress}
            onPressRepost={handlePress}
            onPressLike={handlePress}
            onPressOptions={handlePress}
          />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
});

export default PostCardSection; 
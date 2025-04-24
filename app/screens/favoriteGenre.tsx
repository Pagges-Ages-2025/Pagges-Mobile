import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, GestureResponderEvent } from "react-native";
import { useTheme } from "../context/ThemeContext";
import NunitoText from "../components/Texts/NunitoText";
import Strings from "../constants/Strings";
import SelectionButton from "../components/Buttons/SelectionButton";
import CustomButton from "../components/Buttons/CustomButton";

const FavoriteGenre: React.FC = () => {
  const { theme, themeName } = useTheme();
  const gener = [
    "Família",
    "Ficção Científica",
    "Romance",
    "Terror",
    "Noir",
    "Histórico",
    "Fantasia",
    "Drama",
    "Suspense",
    "Documentário",
    "Guerra",
    "Comédia",
    "Thriller Psicológico",
    "Aventura",
    "Musical",
    "Crime",
    "Policial",
    "Animação",
    "Esporte",
    "Biografia",
    "Ação",
    "Faroeste",
    "Super-herói",
    "Mistério",
  ];
  const toggleSelection = (title: string) => {
    if (selectedItens.length < 3 || selectedItens.includes(title)) {
      setSelectedItens((iten) =>
        iten.includes(title)
          ? iten.filter((x) => x !== title)
          : [...iten, title]
      );
    }
  };
  const [selectedItens, setSelectedItens] = useState<string[]>([]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <View style={[styles.containerView]}>
        <NunitoText style={[styles.h1, { color:themeName==="dark" ?theme.white :theme.primary }]}>
          {Strings.genreTitle}
        </NunitoText>
      </View>
      <View
        style={{
          flexDirection: "row",
          columnGap: 10,
          rowGap: 15,
          flexWrap: "wrap",
          paddingInline: 15,
          justifyContent: "center",
          marginBottom: 80
        }}
      >
        {gener.map((title) => (
          <SelectionButton
            title={title}
            isSelected={selectedItens.includes(title)}
            key={title}
            onSelectChange={() => toggleSelection(title)}
            isDisable={selectedItens.length==3 && !selectedItens.includes(title)}
          />
        ))}    
        </View>
        <View style={{alignSelf: "center" , width: 250, bottom:40, position: "absolute" }}>    
        <CustomButton title={"Salvar"} size="small" fontWeight="bold" onPress={function (event: GestureResponderEvent): void {
          throw new Error("Function not implemented.");
        } }
        />  
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 28,
    fontWeight: "900",
  },
  containerView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 40,
  },
  buttonView:{
    justifyContent: "center",
    marginTop: 70,
    marginBottom: 40,
    
  }
});

export default FavoriteGenre;

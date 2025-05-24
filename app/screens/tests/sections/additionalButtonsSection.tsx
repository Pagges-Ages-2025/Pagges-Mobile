import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import EditProfileButton from "../../../components/Buttons/EditProfileButton";
import FollowButton from "../../../components/Buttons/FollowButton";
import SelectionButton from "../../../components/Buttons/SelectionButton";
import { useTheme } from "../../../context/ThemeContext";

const AdditionalButtonsSection = () => {
  const { theme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const [open, setOpen] = useState({
    buttons: false,
    editProfile: true,
    follow: true,
    selection: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Botões Adicionais"
      isOpen={open.buttons}
      onToggle={() => toggle("buttons")}
      type="title"
    >
      <Section
        title="Botão de Editar Perfil"
        isOpen={open.editProfile}
        onToggle={() => toggle("editProfile")}
      >
        <View style={styles.grid}>
          <EditProfileButton size={24} />
          <EditProfileButton size={32} color="secondary" />
          <EditProfileButton size={40} />
        </View>
      </Section>

      <Section
        title="Botão de Seguir"
        isOpen={open.follow}
        onToggle={() => toggle("follow")}
      >
        <View style={styles.grid}>
          <FollowButton 
            isFollowing={isFollowing} 
            onFollowChange={setIsFollowing}
            size={24}
          />
          <FollowButton 
            isFollowing={isFollowing} 
            onFollowChange={setIsFollowing}
            size={32}
            color="secondary"
          />
          <FollowButton 
            isFollowing={isFollowing} 
            onFollowChange={setIsFollowing}
            size={40}
          />
        </View>
      </Section>

      <Section
        title="Botão de Seleção"
        isOpen={open.selection}
        onToggle={() => toggle("selection")}
      >
        <View style={styles.grid}>
          <SelectionButton 
            title="Normal"
            isSelected={isSelected}
            onSelectChange={setIsSelected}
            isDisable={false}
          />
          <SelectionButton 
            title="Selecionado"
            isSelected={true}
            onSelectChange={() => {}}
            isDisable={false}
          />
          <SelectionButton 
            title="Desabilitado"
            isSelected={false}
            onSelectChange={() => {}}
            isDisable={true}
          />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
});

export default AdditionalButtonsSection; 
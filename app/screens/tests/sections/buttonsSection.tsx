// sections/ButtonSection.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CustomButton from "@/app/components/Buttons/CustomButton";
import Section from "../components/section";

const ButtonSection = () => {
  const [open, setOpen] = useState({
    buttons: true,
    size: true,
    type: true,
    fontWeight: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Botões"
      isOpen={open.buttons}
      onToggle={() => toggle("buttons")}
      type="title"
    >
      <Section
        title="Tamanho (size)"
        isOpen={open.size}
        onToggle={() => toggle("size")}
      >
        <View style={styles.grid}>
          <CustomButton title="Small" size="small" onPress={() => {}} />
          <CustomButton title="Medium" size="medium" onPress={() => {}} />
          <CustomButton title="Large" size="large" onPress={() => {}} />
        </View>
      </Section>

      <Section
        title="Tipo (type)"
        isOpen={open.type}
        onToggle={() => toggle("type")}
      >
        <View style={styles.grid}>
          <CustomButton title="Primary" type="primary" onPress={() => {}} />
          <CustomButton title="Outlined" type="outlined" onPress={() => {}} />
          <CustomButton title="Secondary" type="secondary" onPress={() => {}} />
        </View>
      </Section>

      <Section
        title="Peso da fonte (fontWeight)"
        isOpen={open.fontWeight}
        onToggle={() => toggle("fontWeight")}
      >
        <View style={styles.grid}>
          <CustomButton title="Light" fontWeight="light" onPress={() => {}} />
          <CustomButton title="Regular" fontWeight="regular" onPress={() => {}} />
          <CustomButton title="Bold" fontWeight="bold" onPress={() => {}} />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  
});

export default ButtonSection;

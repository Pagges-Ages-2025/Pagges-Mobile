import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
import CheckBoxOptions from "../../../components/checkbox/CheckBoxOptions";
import { useTheme } from "../../../context/ThemeContext";
import NunitoText from "../../../components/Texts/NunitoText";

const CheckboxSection = () => {
  const { theme } = useTheme();
  
  const [open, setOpen] = useState({
    checkboxes: false,
    interactive: true,
    states: true,
  });

  const [interactiveState, setInteractiveState] = useState({
    review: false,
    spoiler: false,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Checkboxes"
      isOpen={open.checkboxes}
      onToggle={() => toggle("checkboxes")}
      type="title"
    >
      <Section
        title="Checkboxes Interativos"
        isOpen={open.interactive}
        onToggle={() => toggle("interactive")}
      >
        <View style={styles.container}>
          <CheckBoxOptions
            isReviewChecked={interactiveState.review}
            isSpoilerChecked={interactiveState.spoiler}
            onReviewChange={(checked) => 
              setInteractiveState(prev => ({ ...prev, review: checked }))
            }
            onSpoilerChange={(checked) => 
              setInteractiveState(prev => ({ ...prev, spoiler: checked }))
            }
          />
          <View style={styles.stateDisplay}>
            <NunitoText style={{ color: theme.primaryText }}>
              Estado atual:
            </NunitoText>
            <NunitoText style={{ color: theme.primaryText }}>
              Review: {interactiveState.review ? "Marcado" : "Desmarcado"}
            </NunitoText>
            <NunitoText style={{ color: theme.primaryText }}>
              Spoiler: {interactiveState.spoiler ? "Marcado" : "Desmarcado"}
            </NunitoText>
          </View>
        </View>
      </Section>

      <Section
        title="Estados Pré-definidos"
        isOpen={open.states}
        onToggle={() => toggle("states")}
      >
        <View style={styles.container}>
          <View style={styles.stateContainer}>
            <NunitoText style={{ color: theme.primaryText }}>
              Ambos Desmarcados:
            </NunitoText>
            <CheckBoxOptions
              isReviewChecked={false}
              isSpoilerChecked={false}
              onReviewChange={() => {}}
              onSpoilerChange={() => {}}
            />
          </View>

          <View style={styles.stateContainer}>
            <NunitoText style={{ color: theme.primaryText }}>
              Review Marcado:
            </NunitoText>
            <CheckBoxOptions
              isReviewChecked={true}
              isSpoilerChecked={false}
              onReviewChange={() => {}}
              onSpoilerChange={() => {}}
            />
          </View>

          <View style={styles.stateContainer}>
            <NunitoText style={{ color: theme.primaryText }}>
              Spoiler Marcado:
            </NunitoText>
            <CheckBoxOptions
              isReviewChecked={false}
              isSpoilerChecked={true}
              onReviewChange={() => {}}
              onSpoilerChange={() => {}}
            />
          </View>

          <View style={styles.stateContainer}>
            <NunitoText style={{ color: theme.primaryText }}>
              Ambos Marcados:
            </NunitoText>
            <CheckBoxOptions
              isReviewChecked={true}
              isSpoilerChecked={true}
              onReviewChange={() => {}}
              onSpoilerChange={() => {}}
            />
          </View>
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
  stateDisplay: {
    marginTop: 20,
    gap: 5,
  },
  stateContainer: {
    marginBottom: 20,
    gap: 10,
  },
});

export default CheckboxSection; 
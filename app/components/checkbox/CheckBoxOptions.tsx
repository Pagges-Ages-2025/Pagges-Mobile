import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Checkbox from "expo-checkbox";
import NunitoText from "../Texts/NunitoText";
import Strings from "@/app/constants/Strings";

const CheckBoxOptions = () => {
  const [isReviewChecked, setIsReviewChecked] = useState(false);
  const [isSpoilerChecked, setIsSpoilerChecked] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isReviewChecked}
          onValueChange={() => setIsReviewChecked(!isReviewChecked)}
          color={isReviewChecked ? theme.successColor : undefined}
          style={styles.checkbox}
        />
        <NunitoText style={[styles.label, { color: theme.primaryText }]}>
          {Strings.review}
        </NunitoText>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isSpoilerChecked}
          onValueChange={() => setIsSpoilerChecked(!isSpoilerChecked)}
          color={isSpoilerChecked ? theme.successColor : undefined}
          style={styles.checkbox}
        />
        <NunitoText style={[styles.label, { color: theme.primaryText }]}>
          {Strings.spoilerWarningPlain}
        </NunitoText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    justifyContent: "space-between",
    gap: 6,
  },
  label: {
    fontSize: 14,
  },
  checkbox: {
    borderRadius: 6,
  },
});

export default CheckBoxOptions;

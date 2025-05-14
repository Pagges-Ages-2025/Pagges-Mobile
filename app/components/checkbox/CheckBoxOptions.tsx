// CheckBoxOptions.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Checkbox from "expo-checkbox";
import NunitoText from "../Texts/NunitoText";
import Strings from "@/app/constants/Strings";

interface CheckBoxOptionsProps {
  isReviewChecked: boolean;
  isSpoilerChecked: boolean;
  onReviewChange: (checked: boolean) => void;
  onSpoilerChange: (checked: boolean) => void;
}

const CheckBoxOptions: React.FC<CheckBoxOptionsProps> = ({
  isReviewChecked,
  isSpoilerChecked,
  onReviewChange,
  onSpoilerChange,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isReviewChecked}
          onValueChange={onReviewChange}
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
          onValueChange={onSpoilerChange}
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
  },
  checkboxContainer: {
    flexDirection: "row",
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

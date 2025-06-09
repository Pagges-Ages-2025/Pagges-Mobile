import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // ajuste o path conforme seu projeto
import NunitoText from "../Texts/NunitoText";

type Props = {
  synopsis: string;
};

export const SinopseExpandable: React.FC<Props> = ({ synopsis }) => {
  const [showMoreText, setShowMoreText] = useState(false);
  const { theme } = useTheme();

  return (
    <View>
      <NunitoText
        style={{ color: theme.primaryText, textAlign: 'justify', justifyContent: "center", alignItems: "center" }}
        numberOfLines={showMoreText ? undefined : 3}
      >
        {synopsis}
      </NunitoText>
      <TouchableOpacity onPress={() => setShowMoreText(!showMoreText)}>
        <Text style={{ color: theme.secondary }}>
          {showMoreText ? "Ler menos" : "Ler mais"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

import React from "react";
import { Text, TextProps } from "react-native";

export default function NunitoText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: "Nunito" }, props.style]} />;
}

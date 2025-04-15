import React, { useRef } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";
import { useRouter } from "expo-router";
import CustomButton from "../Buttons/CustomButton";

interface CancelPostProps {
  onPost?: () => void;
}

export default function CancelPost({
  onPost
}: CancelPostProps) {
  const { theme, themeName } = useTheme();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const navigateTo = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/screens/login`); //home (não existe a pagina ainda)
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateTo()} activeOpacity={0.7}>
        <NunitoText style={{
          color:
          themeName === "dark"
          ? theme.primaryText
          : theme.secondaryText,
          fontSize: 16 
        }}>Cancelar</NunitoText>
      </TouchableOpacity>
          
      <CustomButton 
        onPress={() => {onPost}}
        size='small' 
        width={90}
        height={35}
        title="Publicar" 
        type="secondary"  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    height: 40,
  },
});

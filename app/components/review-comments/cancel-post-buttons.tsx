import React, { useCallback } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";
import { useRouter } from "expo-router";
import CustomButton from "../Buttons/CustomButton";
import Strings from "@/app/constants/Strings";

interface CancelPostProps {
  onPost: () => void;
  cancelScreen: "searchPage" | "book";
}

export default function CancelPost({
  onPost,
  cancelScreen
}: CancelPostProps) {
  const { theme, themeName } = useTheme();
  const router = useRouter();

  const navigateTo = useCallback((screen: "searchPage" | "book") => {
    if (screen) {
      router.push(`/screens/${screen}`);
    }
  }, []);
    
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateTo(cancelScreen)} activeOpacity={0.7}>
        <NunitoText style={{
          color:
          themeName === "dark"
          ? theme.primaryText
          : theme.secondaryText,
          fontSize: 16 
        }}>{Strings.cancel}</NunitoText>
      </TouchableOpacity>
          
      <CustomButton 
        onPress={onPost}
        size='small' 
        width={90}
        height={35}
        title={Strings.post} 
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

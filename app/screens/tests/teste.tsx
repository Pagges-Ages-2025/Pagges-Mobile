import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/app/context/ThemeContext";
import ButtonSection from "./sections/buttonsSection";
import AnimationSection from "./sections/animationsSection";
import SearchBarSection from "./sections/searchbarSection";
import BooksSection from "./sections/booksSection";
import CarouselSection from "./sections/carouselSection";
import ColorsSection from "./sections/colorsSection";
import CancelPost from "@/app/components/review-comments/cancel-post-buttons";

export default function TestsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { themeName, setThemeName, theme } = useTheme();

  const [open, setOpen] = useState({
    buttons: true,
    size: true,
    type: true,
    fontWeight: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleTheme = () => {
    setThemeName(themeName === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.Background }}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Botão de troca de tema */}
        <View style={styles.themeToggleContainer}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: theme.borders }]}
          >
            <Ionicons
              name={themeName === "dark" ? "sunny" : "moon"}
              size={24}
              color={theme.primaryText}
            />
          </TouchableOpacity>
        </View>

        {/* Seções */}
        <View style={styles.container}>
          <CancelPost isFollowing={false} onFollowChange={function (newState: boolean): void {
            throw new Error("Function not implemented.");
          } }/>
        </View>

        {/* importar aqui o novo componente para poder testar */}
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  themeToggleContainer: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
});

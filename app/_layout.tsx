import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import NavBar from "./components/Nav/NavBar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>
      <View style={[styles.content, { backgroundColor: theme.Background }]}>
        <Slot />
      </View>
      <NavBar />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

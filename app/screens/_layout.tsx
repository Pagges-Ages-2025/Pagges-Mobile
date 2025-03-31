import { Stack, usePathname, useRouter } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import React from "react";
import { StatusBar, View } from "react-native";

export default function ScreensLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLongPress = ({ nativeEvent }: any) => {
    if (nativeEvent.state === 4) {
      if (pathname !== "screens/tests/teste") {
        router.push("screens/tests/teste" as any);
      } else {
        router.back();
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <InnerLayout onLongPress={handleLongPress} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function InnerLayout({ onLongPress }: { onLongPress: (e: any) => void }) {
  const { themeName } = useTheme();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={themeName === "light" ? "dark-content" : "light-content"}
      />

      <LongPressGestureHandler
        minDurationMs={3000}
        onHandlerStateChange={onLongPress}
      >
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          >
            {/*as rotas sao aqui */}
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="tests/teste" />
          </Stack>
        </View>
      </LongPressGestureHandler>
    </>
  );
}

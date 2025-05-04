import { Stack, usePathname, useRouter } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
} from "react-native-gesture-handler";
import React from "react";
import { StatusBar, View } from "react-native";
import NavBar from "../components/Nav/NavBar";

import { Redirect } from "expo-router";


export default function ScreensLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLongPress = ({ nativeEvent }: any) => {
    // if (nativeEvent.state === 4) {
    //   if (pathname !== "screens/tests/teste") {
    //     router.push("screens/profile" as any);
    //   } else {
    //     router.back();
    //   }
    // }
    router.push("screens/profile" as any);
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
  const pathname = usePathname();

  const removeNavbarFromPageList = [
    "/screens/login", 
    "/screens/register", 
    "/screens/splash",
    "/screens/welcome",
    "/screens/book"
  ];

  const { themeName } = useTheme();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={themeName === "dark" ? "light-content" : "dark-content"}
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
          >{/*as rotas sao aqui */}
            <Stack.Screen name="splash" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="searchPage" />
            <Stack.Screen name="tests/teste" />
            <Stack.Screen name="book"/>
            <Stack.Screen name="personalLibrary" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="createreReviewComment" />
          </Stack>
          {!removeNavbarFromPageList.includes(pathname) && <NavBar />}
        </View>
      </LongPressGestureHandler>
    </>
  );
}

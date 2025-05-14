import { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function useLoadFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        SplashScreen.preventAutoHideAsync(); 
        await Font.loadAsync({
          "Nunito": require("../../assets/fonts/Nunito-VariableFont_wght.ttf"),
        });
      } catch (error) {
        console.error("Erro ao carregar fontes:", error);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}

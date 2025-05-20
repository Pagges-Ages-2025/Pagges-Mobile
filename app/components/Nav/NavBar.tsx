import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import NunitoText from "../Texts/NunitoText";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, themeName, setThemeName } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const backgroundColor = theme.Background;

  useEffect(() => {
    loadUserEmail();
  }, [pathname]);

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    } catch (error) {
      console.error("Error loading user email:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userEmail");
      router.replace("/screens/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleTheme = () => {
    setThemeName(themeName === "dark" ? "light" : "dark");
  };

  const navigationItems = [
    { name: "Home", icon: "home-outline", route: "/screens/home" },
    {
      name: themeName === "dark" ? "Light" : "Dark",
      icon: themeName === "dark" ? "sunny" : "moon",
      action: toggleTheme,
    },
    { name: "Add", icon: "add", route: "/screens/createReviewComment" },
    {
      name: "Sair",
      icon: "log-out-outline",
      action: handleLogout,
    },
    {
      name: "Perfil",
      icon: "person-outline",
      route: userEmail
        ? `/screens/profile?email=${encodeURIComponent(userEmail)}`
        : "/screens/profile",
    },
  ];

  const isCurrentRoute = (route: string | undefined) => {
    if (!route) return false;
    const currentBasePath = pathname.split('?')[0];
    const targetBasePath = route.split('?')[0];
    return currentBasePath === targetBasePath;
  };

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    if (item.action) {
      item.action();
    } else if (item.route && !isCurrentRoute(item.route)) {
      console.log('Navegando para nova página:', item.route);
      router.replace(item.route as any);
    } else if (item.route) {
      console.log('Usuário já está na página:', pathname);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            item.name === "Add" && styles.addButton,
            item.name === "Add" && { backgroundColor: theme.primary },
            isCurrentRoute(item.route) && styles.activeNavItem,
          ]}
          onPress={() => handleNavigation(item)}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={
              item.name === "Add"
                ? theme.Background
                : isCurrentRoute(item.route)
                  ? theme.primary
                  : theme.placeholder
            }
          />
          <NunitoText
            style={[
              styles.navText,
              {
                color:
                  item.name === "Add"
                    ? theme.Background
                    : isCurrentRoute(item.route)
                      ? theme.primary
                      : theme.placeholder,
              },
            ]}
          >
            {item.name}
          </NunitoText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  activeNavItem: {
    borderRadius: 8,
  },
  addButton: {
    borderRadius: 50,
    width: 56,
    height: 56,
    marginTop: -20,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});
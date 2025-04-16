import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NunitoText from '../Texts/NunitoText';
import { useTheme } from '@/app/context/ThemeContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log('userEmail', userEmail);
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
    { name: 'Home', icon: 'home-outline', route: '/screens/searchPage' },
    { 
      name: themeName === 'dark' ? 'Light' : 'Dark', 
      icon: themeName === 'dark' ? 'sunny' : 'moon',
      action: toggleTheme
    },
    { name: 'Add', icon: 'add', route: '/add' },
    { 
      name: 'Sair', 
      icon: 'log-out-outline', 
      action: handleLogout 
    },
    { 
      name: 'Perfil', 
      icon: 'person-outline', 
      route: userEmail ? `/screens/profile?email=${userEmail}` : '/screens/profile'
    },
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            item.name === 'Add' && styles.addButton,
            item.name === 'Add' && { backgroundColor: theme.primary }
          ]}
          onPress={() => handleNavigation(item)}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={
              item.name === 'Add'
                ? theme.Background
                : pathname === item.route
                ? theme.primary
                : theme.placeholder
            }
          />
          <NunitoText
            style={[
              styles.navText,
              {
                color:
                  item.name === 'Add'
                    ? theme.Background
                    : pathname === item.route
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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

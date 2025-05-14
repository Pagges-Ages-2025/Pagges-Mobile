// this search bar has the exact same styles and look as the BookSearch but it is static, when we click it, we will navigate to the searchPage

import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const StaticSearchBar = () => {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/screens/searchPage")}>
                <View
                    style={[
                        styles.searchContainer,
                        // eslint-disable-next-line react-native/no-inline-styles, react-native/no-color-literals
                        {
                            height: 40,
                            borderColor: theme.primary,
                            borderWidth: 1,
                            borderRadius: 15,
                        },
                    ]}
                >
                    <View style={styles.input}>
                        <Text style={{ color: theme.placeholder }}>Buscar Livro...</Text>
                    </View>
                    <View
                        style={styles.searchIconContainer}
                    >
                        <Ionicons name="search" size={20} color="#666" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default StaticSearchBar;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    input: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        paddingLeft: 35,
        paddingRight: 16,
    },
    searchContainer: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    searchIconContainer: {
        height: "100%",
        justifyContent: "center",
        left: 18,
        position: "absolute",
        width: 25,
    }
});
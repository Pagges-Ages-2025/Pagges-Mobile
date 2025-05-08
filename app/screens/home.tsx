
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import StaticSearchBar from "../components/SearchBar/StaticSearchBar";

const Home: React.FC = () => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
            <View style={styles.content}>
                <StaticSearchBar />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        alignSelf: 'center',
        flex: 1,
        paddingTop: 30,
        width: "90%",
    },
});

export default Home;
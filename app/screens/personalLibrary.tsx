import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "../context/ThemeContext";
import NunitoText from '../components/Texts/NunitoText';
import PagerView from 'react-native-pager-view';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const Library = () => {
    const { theme } = useTheme();

    const pagerRef = useRef<PagerView>(null);
    const [actualPage, setActualPage] = useState(0);
  
    const changeBar = (index: number) => {
        setActualPage(index);
        console.log(index)
        
        if (pagerRef.current) {
          pagerRef.current.setPage(index);
        }
    };

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.headerPage}>
                <TouchableOpacity onPress={() => console.log('Back button pressed')} style={styles.circleButton}>
                    <Ionicons
                        name="return-up-back-outline"
                        size={30}
                        color={"#000000"}
                        style={{ paddingRight: 20 }}
                    />
                </TouchableOpacity>
                
                <View style={{ paddingLeft: "13%" }}>
                    <NunitoText style={{ fontSize: 20, color: "#000000", fontWeight: "bold", }}>
                        Biblioteca Pessoal
                    </NunitoText>
                </View>
            </View>

            {/* abas */}
            <View style={styles.tabs}>
                {['Lidos', 'Quero Ler', 'Lendo'].map((nome, index) => (
                    <TouchableOpacity key={index} onPress={() => changeBar(index)} style={styles.button}>
                        <Text style={[styles.textTabs, actualPage === index && styles.activeTab, {color: actualPage === index? "#000000" : "#8C8C8C"}]}>
                            {nome}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.barContainer}>
            <View 
                style={[
                styles.onTopBar,
                {
                    width: actualPage === 1 
                    ? 0.9 * width / 3 
                    : 0.9 * width / 3.5,

                    left: actualPage === 0 
                    ? 0 
                    : actualPage === 1 
                        ? (0.9 * width / 3) 
                        : (0.9 * width / 3) * 2 + ((0.9 * width / 3) - (0.9 * width / 3.5)),
                }
                ]}
            />
            </View>

            <View style={{ flex: 1, width: '100%' }}>
                {actualPage === 0 && (
                    <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    style={{ flex: 1 }}
                    nestedScrollEnabled
                    >
                    {/* <CustomBook
                        size="medium"
                        title="O Alquimista"
                        photoPath="https://static.wixstatic.com/media/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg"
                        onPress={handlePress}
                        bookId={1}
                    />
                    <CustomBook
                        size="small"
                        onPress={handlePress}
                        photoPath="https://m.media-amazon.com/images/I/81ibfYk4qmL.jpg"
                        bookId={0}
                    /> */}
                    </ScrollView>
                )}
                {actualPage === 1 && (
                <View style={styles.centered}>
                    <Text>Quero Ler</Text>
                </View>
                )}
                {actualPage === 2 && (
                <View style={styles.centered}>
                    <Text>Lendo agora</Text>
                </View>
                )}
            </View>
        </View>
    );
};

export default Library;

const styles = StyleSheet.create({
    activeTab: { 
        color: '#000', 
        fontWeight: 'bold' 
    },
    barContainer: {
        alignItems: 'center',
        height: 2,
        justifyContent: 'center',
        position: 'relative',
        width: '90%',
    },
    button: { 
        alignItems: 'center' ,
        paddingBottom: 10,
        paddingHorizontal: 30,
    },
    circleButton: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 3,
        width: 40
    },
    container: {
        backgroundColor: "#F4F4F4", 
        flex: 1,
        width: '100%', 
        alignItems: 'center',
    },
    headerPage: {
        alignItems: 'center', 
        flexDirection: "row", 
        marginTop: 80, 
        paddingLeft: 30, 
        width: '100%'
    },
    onTopBar: {
        alignItems: 'center',
        backgroundColor: '#9D0F54',
        bottom: 0,
        height: 2,
        justifyContent: 'center',
        position: 'absolute',
    },
    tabs: {
        flexDirection: 'row',
        paddingTop: 30, 
    },
    textTabs: { 
        fontSize: 20,
    },     
    scrollContent: {
        alignItems: "center",
        paddingVertical: 20,
        gap: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

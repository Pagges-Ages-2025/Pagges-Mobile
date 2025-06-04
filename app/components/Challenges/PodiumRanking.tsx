import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHomeCarousel from "../Carousel/CustomHomeCarousel"; // seu componente
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Props = {
  // cards: CardItem[];
  route: string;
  onIndexChange?: (index: number) => void;
};

const PodiumRanking = ({ route, onIndexChange }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<any>();

  const handlePress = (route?: string) => {
    if (route) {
      console.log("clicado", route);
      router.push(route as any); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.thirdContainer}>
        <View style={styles.thirdTop} />
        <View style={styles.thirdTopLeft} />
        <View style={styles.thirdTopRight} />
        <View style={styles.thirdColumn} />
      </View>
      <View style={styles.firstContainer}>
        <View style={styles.firstTop} />
        <View style={styles.firstTopLeft} />
        <View style={styles.firstTopRight} />
        <View style={styles.firstColumn} />
      </View>
      
      <View style={styles.secondContainer}>
        <View style={styles.secondTop} />
        <View style={styles.secondTopLeft} />
        <View style={styles.secondTopRight} />
        <View style={styles.secondColumn} />
      </View>
      
    </View>
    
  );
};

export default PodiumRanking;
const blockWidth = 120;
const firstBlockHeight = 190;
const secondBlockHeight = 90;
const thirdBlockHeight = 130;
const topHeight = 20;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'flex-end',   
  },
  
  firstContainer: {
    width: blockWidth,
    height: firstBlockHeight + topHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  firstColumn: {
    width: blockWidth,
    height: firstBlockHeight,
    backgroundColor: '#2e8b8b',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 7

  },
  firstTop: {
    position: 'absolute',
    top: 6.1,
    zIndex: 1,
    backgroundColor: "#3ba9a9",
    width: blockWidth - 31,
    height: 14,  
  },
  
  firstTopRight: {
   position: 'absolute',
    top: 5,
    right: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3ba9a9',

    zIndex: 3,  
  },
  firstTopLeft: {
    position: 'absolute',
    top: 5,
    left: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 15,
    borderRightWidth: 0,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3ba9a9',

    zIndex: 3, 
  },

  secondContainer: {
    width: blockWidth,
    height: secondBlockHeight + topHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  secondColumn: {
    width: blockWidth,
    height: secondBlockHeight,
    backgroundColor: '#2e8b8b',
  },
  secondTop: {
    position: 'absolute',
    top: 6.2,
    left: 0,
    zIndex: 1,
    backgroundColor: "#3ba9a9",
    width: blockWidth - 25,
    height: 14,  
  },
  
  secondTopRight: {
   position: 'absolute',
    top: 5,
    right: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 0,
    borderRightWidth: 25,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3ba9a9',

    zIndex: 3,  
  },
  secondTopLeft: {
    // position: 'absolute',
    // top: 5,
    // left: 0,
    // width: 0,
    // height: 0,
    
    // borderLeftWidth: 20,
    // borderRightWidth: 0,
    // borderBottomWidth: 15,
    
    // borderLeftColor: 'transparent',
    // borderRightColor: 'transparent',
    // borderBottomColor: '#3ba9a9',

    zIndex: 3, 
  },
  
  thirdContainer: {
    width: blockWidth,
    height: thirdBlockHeight + topHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  thirdColumn: {
    width: blockWidth,
    height: thirdBlockHeight,
    backgroundColor: '#2e8b8b',
  },
  thirdTop: {
    position: 'absolute',
    top: 6.2,
    right: 0,
    zIndex: 1,
    backgroundColor: "#3ba9a9",
    width: blockWidth - 25,
    height: 14,  
  },
  
  thirdTopRight: {
  //  position: 'absolute',
  //   top: 5,
  //   right: 0,
  //   width: 0,
  //   height: 0,
    
  //   borderLeftWidth: 0,
  //   borderRightWidth: 25,
  //   borderBottomWidth: 15,
    
  //   borderLeftColor: 'transparent',
  //   borderRightColor: 'transparent',
  //   borderBottomColor: '#3ba9a9',

  //   zIndex: 3,  
  },
  thirdTopLeft: {
    position: 'absolute',
    top: 5,
    left: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3ba9a9',

    zIndex: 3, 
  },
  
});
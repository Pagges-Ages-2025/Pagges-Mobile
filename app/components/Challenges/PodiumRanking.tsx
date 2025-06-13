import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NunitoText from "../Texts/NunitoText";

const { width } = Dimensions.get("window");

interface UserRank {
  name: string;
  image: string;
}

type Props = {
  firstRank: UserRank;
  secondRank: UserRank;
  thirdRank: UserRank;
};

const PodiumRanking = ({ firstRank, secondRank, thirdRank }: Props) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
          
      <View style={styles.secondContainer}>
          <Image
            style={styles.imageCircle} 
            source={require('../../../assets/images/react-logo.png')}
            resizeMode="cover"
          />
        <View style={styles.personName}>
          <NunitoText style={{
              color:theme.primaryText, 
              textAlign:"center",
              fontSize:12,
              fontWeight:'bold'
            }}>
            {secondRank.name}
          </NunitoText>
        </View>
        <View style={styles.secondTop} />
        <View style={styles.secondTopLeft} />
        <View style={styles.secondTopRight} />
        <View style={styles.secondColumn} />
      </View>

      <View style={styles.firstContainer}>
        
        <View>
          <Image
            style={styles.imageCircle} 
            source={require('../../../assets/images/react-logo.png')}
            resizeMode="cover"
          />
            <Image
              style={styles.crown}
              source={require('../../../assets/images/rank_crown.png')}
              resizeMode="contain"
            />
        </View>
        <View style={styles.personName}>
          <NunitoText style={{
              color:theme.primaryText, 
              textAlign:"center",
              fontSize:12,
              fontWeight:'bold'
            }}>
            {firstRank.name}
          </NunitoText>
        </View>
        <View style={styles.firstTop} />
        <View style={styles.firstTopLeft} />
        <View style={styles.firstTopRight} />
        <View style={styles.firstColumn} />
      </View>
      
      <View style={styles.thirdContainer}>
          <Image
            style={styles.imageCircle} 
            source={require('../../../assets/images/react-logo.png')}
            resizeMode="cover"
          />
        <View style={styles.personName}>
          <NunitoText style={{
              color:theme.primaryText, 
              textAlign:"center",
              fontSize:12,
              fontWeight:'bold'
            }}>
            {thirdRank.name}
          </NunitoText>
        </View>
        <View style={styles.thirdTop} />
        <View style={styles.thirdTopLeft} />
        <View style={styles.thirdTopRight} />
        <View style={styles.thirdColumn} />
      </View>
      
    </View>
    
  );
};

export default PodiumRanking;
const blockWidth = 90;
const firstBlockHeight = 130;
const secondBlockHeight = 90;
const thirdBlockHeight = 50;
const topHeight = 20;

const styles = StyleSheet.create({
  container: {
    height: 280,
    // backgroundColor:"red",
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
    backgroundColor: '#3d8181',
  },
  firstTop: {
    position: 'absolute',
    top: 5,
    zIndex: 1,
    backgroundColor: "#3ba9a9",
    width: blockWidth - 30,
    height: 15,  
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
    backgroundColor: '#366c6c',
  },
  secondTop: {
    position: 'absolute',
    top: 6.2,
    right: 0,
    zIndex: 1,
    backgroundColor: "#3e9292",
    width: blockWidth - 24,
    height: 15,  
  },
  
  secondTopRight: {
  },
  secondTopLeft: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 25,
    borderRightWidth: 0,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3e9292',

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
    backgroundColor: '#356a6a',
  },
  thirdTop: {
    position: 'absolute',
    top: 6.2,
    left: 0,
    zIndex: 1,
    backgroundColor: "#3d8f8f",
    width: blockWidth - 25,
    height: 15,  
  },
  
  thirdTopRight: {
   position: 'absolute',
    top: 6,
    right: 0,
    width: 0,
    height: 0,
    
    borderLeftWidth: 0,
    borderRightWidth: 25,
    borderBottomWidth: 15,
    
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3d8f8f',

    zIndex: 3,  
  },
  thirdTopLeft: {
    zIndex: 3, 
  },
  
  imageCircle: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 50, 
    backgroundColor: "white",
    borderColor: "white",
    marginBottom: 5,
  },
  personName:{
    marginBottom: 20,
    paddingRight:5,
    paddingLeft:5
  },
  crown:{
   position: 'absolute',
    top: -40,
    left: -25,
    width: 70,
    height: 70,
    transform: [{ rotate: '-30deg' }] 
  },
    searchBookPhoto: {
    width: 45,
    height: 70,
    borderRadius: 5,
  },
  
});
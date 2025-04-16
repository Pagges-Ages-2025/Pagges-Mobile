import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextStyle,
} from "react-native";
import NunitoText from "../Texts/NunitoText";
import { useTheme } from "../../context/ThemeContext";
import Strings from "@/app/constants/Strings";
import { TextInput } from "react-native";

type FontWeight = "light" | "regular" | "semibold" | "bold";

interface TextFieldProps {
    profile: string;
}

const fontWeightMap: Record<FontWeight, TextStyle["fontWeight"]> = {
  light: "300",
  regular: "400",
  semibold: "600",
  bold: "700",
};

const TextField: React.FC<TextFieldProps> = ({
    profile
}) => {
  const { theme } = useTheme();

  const primaryTextColorplaceholder = theme.textColorReview;
  const primaryTextColor = theme.primaryText;
  const backgroundColor = theme.Background;



  return (
        <View style={[styles.container, {backgroundColor}]}>
                <Image 
                    style={styles.imageArea}
                    source={{ uri: profile }}>
                </Image>
                <TextInput 
                    style={[styles.textArea, {color : primaryTextColor}]} 
                    placeholder="Algo a falar sobre seu livro?"
                    placeholderTextColor={primaryTextColorplaceholder}
                    multiline
                    textAlignVertical="top"/>
        </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:"#ccc",
        minHeight:100
    },
    textArea:{
        flex:1,
        fontSize:16,
        minHeight:80,
        paddingTop:5
    },
    imageArea:{
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    }
  
});

export default TextField;

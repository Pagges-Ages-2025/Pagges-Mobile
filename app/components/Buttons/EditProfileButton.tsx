import React from "react";
import { TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Color = 'primary' | 'secondary';

export default function EditProfileButton(props: {color?: Color, size?: number}){
    const { theme } = useTheme()

    function onPress(){
        console.log("Edit Profile Button Pressed")
    } 
    
    return(
        <TouchableOpacity onPress={onPress}>
           <MaterialCommunityIcons
                name="square-edit-outline"
                size={props.size ? props.size : 40 }
                color= {props.color == 'secondary' ? theme.secondary  : theme.primary}
              />
        </TouchableOpacity>
    )
}
import React from "react";
import { TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EditProfileButton(props: {color?: string, size: number}){
    function onPress(){
        console.log("Edit Profile Button Pressed")
    } 
    
    return(
        <TouchableOpacity onPress={onPress}>
           <MaterialCommunityIcons
                name="square-edit-outline"
                size={20}
                color= {props.color ? props.color : "#A9A8A9"}
              />
        </TouchableOpacity>
    )
}
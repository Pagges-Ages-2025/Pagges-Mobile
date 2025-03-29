import React from "react";
import { TouchableOpacity, Image, GestureResponderEvent } from 'react-native';
import buttonImg from '../../assets/images/EditIcon.png'

export default function ActionButton(){
    function onPress(){
        console.log("Action Button Pressed")
    } 

    return(
        <TouchableOpacity onPress={onPress}>
            <Image source={buttonImg}/>
        </TouchableOpacity>
    )
}
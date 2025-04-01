import React from "react";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import { TouchableOpacity } from "react-native";

export default function FollowButton(props: {isFollowing: boolean, color?: string}){
    function onPress(){
        console.log("Follow Button Pressed")
    } 
    
    return(
        <TouchableOpacity onPress={onPress}>
           <SimpleLineIcons
                name= {props.isFollowing ? "user-following" : "user-follow"}
                size={20}
                color= {props.color ? props.color : "#A9A8A9"}
            />
        </TouchableOpacity>
    )
}
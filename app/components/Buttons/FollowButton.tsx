import React, { useState } from "react";
import SimpleLineIcons from "@expo/vector-icons/build/SimpleLineIcons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Color = 'primary' | 'secondary'; 

export default function FollowButton(props: {isFollowing: boolean, color?: Color, size?: number, onFollowChange: (newState: boolean) => void}){
    const { theme } = useTheme()
    const [ isFollowing, setIsFollowing] = useState(props.isFollowing)
 
    function onPress(){
        console.log("Follow Button Pressed")
        const newState = !isFollowing;
        setIsFollowing(newState);
        props.onFollowChange(newState);
    } 
    
    return(
        <TouchableOpacity onPress={onPress}>
           <SimpleLineIcons
                name= {isFollowing ? "user-unfollow" : "user-follow"}
                size={props.size ? props.size : 40}
                color= {props.color == 'secondary' ? theme.secondary  : theme.primary}
            />
        </TouchableOpacity>
    )
}
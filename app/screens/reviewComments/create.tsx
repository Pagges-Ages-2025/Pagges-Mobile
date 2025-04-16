import NunitoText from "@/app/components/Texts/NunitoText";
import { StyleSheet, View } from "react-native";


export default function AddScreen() {  
  return (
    <View style={[styles.container]}>
        <NunitoText style={[{ color: 'black'}]}>
          Adicionar Resenha / Comentario
        </NunitoText>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height:"100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
  },
});

import NunitoText from "@/app/components/Texts/NunitoText";
import { StyleSheet, View } from "react-native";
import SelectBook from "../components/review-comments/select-book";


export default function CreateReviewCommentScreen() {  
  return (
    <View style={[styles.container]}>
        <NunitoText style={[{ color: 'black'}]}>
          Adicionar Resenha / Comentario
        </NunitoText>
        <View style={styles.selectBook}>
          <SelectBook />
        </View>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: "column", 
  },
  selectBook:{
    flex:1
  }
});
import { StyleSheet, View, Image, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface TextFieldProps {
  profile: string;
}

const TextField: React.FC<TextFieldProps> = ({ profile }) => {
  const { theme } = useTheme();

  const primaryTextColorplaceholder = theme.textColorReview;
  const primaryTextColor = theme.primaryText;
  const backgroundColor = theme.Background;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image style={styles.imageArea} source={{ uri: profile }}></Image>
      <TextInput
        style={[styles.textArea, { color: primaryTextColor }]}
        placeholder="Algo a falar sobre seu livro?"
        placeholderTextColor={primaryTextColorplaceholder}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 10,
    minHeight: 100,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    minHeight: 80,
    paddingTop: 5,
  },
  imageArea: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});

export default TextField;

import { StyleSheet, View, Image, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import defaultImage from "../../assets/images/profile-user.png";
import Strings from "@/app/constants/Strings";

interface ReviewTextFieldProps {
  profileImage?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const ReviewTextField: React.FC<ReviewTextFieldProps> = ({
  profileImage,
  value,
  onChangeText,
}) => {
  const { theme } = useTheme();

  const primaryTextColorplaceholder = theme.textColorReview;
  const primaryTextColor = theme.primaryText;
  const backgroundColor = theme.Background;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        style={styles.imageArea}
        source={profileImage ? { uri: profileImage } : defaultImage}
      ></Image>
      <TextInput
        style={[styles.textArea, { color: primaryTextColor }]}
        placeholder={Strings.placeholderReview}
        placeholderTextColor={primaryTextColorplaceholder}
        multiline
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
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
    minHeight: 200,
    paddingTop: 10,
  },
  imageArea: {
    width: 40,
    height: 40,
    borderRadius: 15,
    marginRight: 10,
  },
});

export default ReviewTextField;

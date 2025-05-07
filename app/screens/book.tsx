/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  GestureResponderEvent,
} from "react-native";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";
import NunitoText from "../components/Texts/NunitoText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import { ReviewComment } from "../components/review-comments/review-comments";
import CustomModal from "../components/review-comments/pop-up-modal";
import CustomButton from "../components/Buttons/CustomButton";
import { router } from "expo-router";
import StaticStars from "../components/StaticStars/StaticStars";
import RatingModal from "../components/RatingModal/RatingModal";

interface ModalBookDetailsProps {
  visible: boolean;
  onClose: () => void;
  rating?: number;
  titulo?: string;
  readersNumber?: number;
  paginas?: number;
  rankingNumber?: string;
  sinopse?: string;
  review?: string;
  author?: string;
  publicationDate?: string;
  genre?: string;
  capa?: string;
  onCreateReview?: () => void;
  onShare?: () => void;
}

export default function ModalBookDetails({
  visible,
  onClose,
  rating = 4.5,
  titulo = "Título do Livro",
  readersNumber = 1000,
  paginas = 300,
  rankingNumber = "10",
  sinopse = "Sinopse do livro...",
  review = "Review do livro...",
  author = "Autor do Livro",
  publicationDate = "2023",
  genre = "Ficção",
  capa = "https://placeholder.com/book",
  onCreateReview,
  onShare,
}: ModalBookDetailsProps) {
  const { theme } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);
  const [showMoreText, setShowMoreText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  const [ratingCount, setRatingCount] = useState(1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const roundedStars = Math.round(currentRating);
  const snapPoints = useMemo(() => ["62%", "85%"], []);

  const MAX_SNAP_POINT_INDEX = 1;

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index > MAX_SNAP_POINT_INDEX) {
        bottomSheetRef.current?.snapToIndex(MAX_SNAP_POINT_INDEX);
        return;
      } else if (index === MAX_SNAP_POINT_INDEX) {
        setIsMaximized(true);
      } else {
        setIsMaximized(false);
      }
    },
    [bottomSheetRef, MAX_SNAP_POINT_INDEX]
  );

  const handleNewRating = (newRating: number) => {
    const total = currentRating * ratingCount;
    const updatedCount = ratingCount + 1;
    const newAverage = (total + newRating) / updatedCount;

    setCurrentRating(newAverage);
    setRatingCount(updatedCount);
  };

  const handleBackPress = () => {
    onClose();
  };

  const handleCreateReview = () => {
    if (onCreateReview) {
      onCreateReview();
    } else {
      setModalVisible(true);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      console.log("Share action");
    }
  };

  const bookStats = [
    { value: readersNumber, label: "Leitores" },
    { value: paginas, label: "Páginas" },
    { value: currentRating?.toFixed(1), label: "Avaliação" },
    { value: `#${rankingNumber}`, label: "Ranking" },
  ];

  const bookActions = [
    {
      label: "Já li",
      onPress: () => {
        console.log("Ação: Já li");
      },
    },
    {
      label: "Estou lendo",
      onPress: () => {
        console.log("Ação: Estou lendo");
      },
    },
    {
      label: "Quero ler",
      onPress: () => {
        console.log("Ação: Quero ler");
      },
    },
  ];

  const BookContent = () => (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: capa }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        <View style={styles.bookContentContainer}>
          {isMaximized ? (
            <View style={{ flexDirection: "row", marginBottom: 0 }}>
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons
                  name="return-up-back-outline"
                  size={30}
                  color={theme.white}
                  style={{ paddingRight: 20 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 10,
                  paddingLeft: 10,
                  width: "85%",
                }}
              >
                <NunitoText
                  style={{
                    color: theme.quinaryText,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {titulo.length > 23 ? titulo?.substring(0, 23) + "..." : titulo}
                </NunitoText>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: 0,
              }}
            >
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons
                  name="return-up-back-outline"
                  size={30}
                  color={theme.white}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={handleCreateReview}
                style={{
                  borderRadius: 15,
                  backgroundColor: theme.primary,
                  width: "35%",
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginRight: 10,
                }}
              >
                <NunitoText
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: theme.white,
                  }}
                >
                  Criar Resenha
                </NunitoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <AntDesign name="export" size={24} color={theme.white} />
              </TouchableOpacity>
            </View>
          )}

          <NunitoText style={[styles.title, { color: theme.white }]}>
            {titulo}
          </NunitoText>
          <NunitoText style={[styles.subtitle, { color: theme.white }]}>
            {author}
          </NunitoText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <NunitoText style={[styles.date, { color: theme.white }]}>
              {publicationDate}
            </NunitoText>
            <NunitoText
              style={{ color: theme.white, paddingHorizontal: 10 }}
            >
              {" "}
              -{" "}
            </NunitoText>
            <NunitoText style={[styles.gender, { color: theme.white }]}>
              {genre}
            </NunitoText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View style={styles.starsContainer}>
            <StaticStars
              rating={rating}
              onPress={() => {setModalVisible(true)}}
              />
            <RatingModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onRate={() => {setModalVisible(false);
              }}
              book={titulo}
            />
            </View>

            <TouchableOpacity
              onPress={handleCreateReview}
              style={{
                borderRadius: 15,
                backgroundColor: theme.quinaryText,
                width: "35%",
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                marginRight: 10
              }}
            >
              <NunitoText
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: theme.quaternaryText,
                }}
              >
                Criar Resenha
              </NunitoText>
            </TouchableOpacity>

          </View>
        </View>

        <GestureHandlerRootView style={styles.container}>
          <BottomSheet
          backgroundStyle={{backgroundColor: theme.Background}}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            onChange={handleSheetChanges}
            enablePanDownToClose={false}
            enableOverDrag={false}
            handleComponent={BottomSheetHandle}
            enableContentPanningGesture={false}
          >
            <BottomSheetScrollView>
              <View style={styles.bookNumbersContainer}>
                {bookStats.map((stat, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 18,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NunitoText
                      style={[
                        styles.bookNumbers,
                        { color: theme.primaryText },
                      ]}
                    >
                      {stat.value}
                    </NunitoText>
                    <NunitoText
                      style={[
                        styles.bookNumbersTitle,
                        { color: theme.primaryText },
                      ]}
                    >
                      {stat.label}
                    </NunitoText>
                  </View>
                ))}
              </View>

              <View style={styles.statusBookContainer}>
                {bookActions.map((action, index) => (

                  <CustomButton width={150} height={30} key={index} title={action.label} onPress={()=>{}} />
                  // <TouchableOpacity
                  //   key={index}
                  //   onPress={action.onPress}
                  //   style={{
                  //     borderRadius: 15,
                  //     backgroundColor: theme.primary,
                  //     width: "25%",
                  //     height: 23,
                  //     alignItems: "center",
                  //     justifyContent: "center",
                  //     flexDirection: "row",
                  //     marginRight: 8,
                  //     marginLeft: 8,
                  //   }}
                  // >
                  //   <Text
                  //     style={{
                  //       fontSize: 12,
                  //       fontWeight: "bold",
                  //       color: theme.quinaryText,
                  //     }}
                  //   >
                  //     {action.label}
                  //   </Text>
                  // </TouchableOpacity>
                ))}
              </View>

              <View>
                <NunitoText
                  style={[styles.secondTitle, { color: theme.primaryText }]}
                >
                  Sinopse
                </NunitoText>
                <NunitoText
                  style={[styles.sinopseText, { color: theme.primaryText }]}
                >
                  {showMoreText ? sinopse : sinopse?.substring(0, 450) + "..."}
                </NunitoText>

                <TouchableOpacity
                  onPress={() => setShowMoreText(!showMoreText)}
                  style={styles.moreAndLessButton}
                >
                  <Text
                    style={[
                      styles.showMoreAndLess,
                      { color: theme.primary },
                    ]}
                  >
                    {showMoreText ? "Mostrar menos" : "Mostrar mais"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{ alignItems: "flex-start", justifyContent: "center" }}
              >
                <NunitoText style={[styles.secondTitle, { paddingBottom: 25, color: theme.primaryText }]}>
                  Principais Resenhas e Comentários
                </NunitoText>

                <ReviewComment
                  comment={true}
                  byAuthor={true}
                  datePost={"30/01/2025"}
                  text={"Amei o livro, muito bom mesmo! Recomendo muito. A história é envolvente e os personagens são bem desenvolvidos."} 
                  fullNamePostAuthor={"Monica Alvarenga"}                />

                <ReviewComment
                  comment={false}
                  byAuthor={false}
                  fullNamePostAuthor={"Monica Alvarenga"}    
                  datePost={"22/08/2024"}
                  text={review}
                />
              </View>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={undefined}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.primary,
                    width: "87%",
                    height: 25,
                    borderRadius: 30,
                  }}
                >
                  <Text style={{ color: theme.quinaryText }}>Acessar mais</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 30 }}></View>

              <NunitoText style={[styles.secondTitle, { paddingBottom: 15, color: theme.primaryText }]}>
                Livros do mesmo autor
              </NunitoText>
              <CustomCarousel
                isHorizontal
                data={[<CustomBook key={1} bookId={0} photoPath={"your-image-path"} />]}
              />

              <View style={{ marginBottom: 15 }}></View>

              <NunitoText style={[styles.secondTitle, { paddingBottom: 15, color: theme.primaryText }]}>
                Livros semelhantes
              </NunitoText>
              <CustomCarousel
                isHorizontal
                data={[<CustomBook key={1} bookId={0} photoPath={"your-image-path"} />]}
              />

              <View style={{ marginBottom: 500 }}></View>
            </BottomSheetScrollView>
          </BottomSheet>
        </GestureHandlerRootView>
      </ImageBackground>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose || router.replace("/screens/searchPage")}
    >
      <BookContent />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "normal",
    marginBottom: 8,
  },
  date: {
    fontSize: 15,
    fontWeight: "normal",
  },
  gender: {
    fontSize: 15,
    fontWeight: "normal",
    marginRight: 10,
  },
  starsContainer: {
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 5,
  },
  bookContentContainer: {
    position: "absolute",
    top: "5%",
    left: "5%",
    right: "5%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  bookNumbers: {
    fontSize: 19,
    fontWeight: "bold",
  },
  bookNumbersTitle: {
    fontSize: 14,
    fontWeight: "regular",
  },
  bookNumbersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  secondTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingLeft: 30,
    paddingBottom: 10,
  },
  sinopseText: {
    fontSize: 14,
    fontWeight: "regular",
    paddingLeft: 30,
    paddingRight: 35,
    textAlign: "justify",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
  },
  showMoreAndLess: {
    fontSize: 14,
    paddingLeft: 30,
    paddingTop: 10,
  },
  moreAndLessButton: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingBottom: 20,
  },
  statusBookContainer: {
    gap: 10,
    transform:"scale(0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
});
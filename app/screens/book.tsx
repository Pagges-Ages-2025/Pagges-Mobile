/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-inline-styles */
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetHandle,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBook from "../components/Book/CustomBook";
import { SinopseExpandable } from "../components/Book/sinopseExpandable";
import CustomButton from "../components/Buttons/CustomButton";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import RatingModal from "../components/RatingModal/RatingModal";
import { ReviewComment } from "../components/review-comments/review-comments";
import StaticStars from "../components/StaticStars/StaticStars";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";

interface ModalBookDetailsProps {
  visible: boolean;
  onClose: () => void;
  rating: number;
  title: string;
  pages?: number;
  readersNumber?: number;
  rankingNumber?: string;
  synopsis: string;
  review: string;
  authors?: string;
  year?: string;
  id: string;
  genre?: string;
  google_image_url?: string;
  onCreateReview?: () => void;
  onShare?: () => void;
}

export default function ModalBookDetails({
  visible,
  onClose,
  rating,
  title,
  readersNumber = 1000,
  pages,
  rankingNumber = "10",
  synopsis,
  review,
  authors,
  year,
  id,
  genre,
  google_image_url,
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

  const updateBookState = async (id: string, state: string) => {
    try {
      // For testing, use this hardcoded token that works in personalLibrary.tsx
      const token =
        (await AsyncStorage.getItem("userToken")) ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpZCI6MSwiaWF0IjoxNzQ2Mzc2MzQwLCJleHAiOjE3NDY0NjI3NDB9.qHYM2FNTzv-2jYFZS3Vd3h9VzynXAe8ItFog0yLrlrs";

      console.log(`Adding book ${id} to ${state} library`);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/personal-library/addBook/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            state: state,
          }),
        }
      );

      if (response.ok) {
        console.log(`Adicionado a ${state} da biblioteca pessoal`);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            `Livro adicionado com sucesso à sua biblioteca`,
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert(
            "Sucesso",
            `Livro adicionado com sucesso à sua biblioteca`
          );
        }
      } else {
        const errorText = await response.text();
        console.error(
          `Erro ao adicionar livro com estado ${state}:`,
          errorText
        );
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Erro ao adicionar livro à biblioteca",
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível adicionar o livro à biblioteca"
          );
        }
      }
    } catch (error) {
      console.error(`Erro ao adicionar livro (${state}):`, error);
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Erro ao adicionar livro à biblioteca",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o livro à biblioteca");
      }
    }
  };

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
    { value: pages, label: "Páginas" },
    { value: currentRating?.toFixed(1), label: "Avaliação" },
    { value: `#${rankingNumber}`, label: "Ranking" },
  ];

  const bookActions = [
    {
      label: "Já li",
      onPress: async () => {
        console.log("Ação: Já li");
        await updateBookState(id, "READ");
      },
    },
    {
      label: "Estou lendo",
      onPress: async () => {
        console.log("Ação: Estou lendo");
        await updateBookState(id, "READING");
      },
    },
    {
      label: "Quero ler",
      onPress: async () => {
        console.log("Ação: Quero ler");
        await updateBookState(id, "TO_BE_READ");
      },
    },
  ];

  const BookContent = () => {
    const [coverImageError, setCoverImageError] = useState(false);

    const processGoogleImageUrl = (url: string | undefined) => {
      if (!url) return undefined;

      try {
        // Ajusta parametros de URL para melhor qualidade e compatibilidade
        let processedUrl = url;

        // Remove parametros que podem causar problemas
        if (url.includes("&edge=curl")) {
          processedUrl = processedUrl.replace("&edge=curl", "");
        }

        // Garante que a URL usa HTTPS
        if (processedUrl.startsWith("http:")) {
          processedUrl = processedUrl.replace("http:", "https:");
        }

        console.log("URL de imagem processada:", processedUrl);
        return processedUrl;
      } catch (error) {
        console.error("Erro ao processar URL da imagem:", error);
        return url;
      }
    };

    const optimizedImageUrl = processGoogleImageUrl(google_image_url);
    const coverImage =
      !coverImageError && optimizedImageUrl
        ? { uri: optimizedImageUrl }
        : require("../assets/images/book-cover.png");

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={coverImage}
          style={styles.backgroundImage}
          onError={(e) => {
            console.log("Error loading book cover:", e.nativeEvent.error);
            setCoverImageError(true);
          }}
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
                    {title.length > 23
                      ? title?.substring(0, 23) + "..."
                      : title}
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
              {title.length > 23 ?
                title.substring(0, 40) + "..."
                : title}
            </NunitoText>
            <NunitoText style={[styles.subtitle, { color: theme.white }]}>
              {authors}
            </NunitoText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <NunitoText style={[styles.date, { color: theme.white }]}>
                {year}
              </NunitoText>
              <NunitoText style={{ color: theme.white, paddingHorizontal: 10 }}>
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
                  onPress={() => {
                    setModalVisible(true);
                  }}
                />
                <RatingModal
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  onRate={() => {
                    setModalVisible(false);
                  }}
                  book={title}
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
                  marginRight: 10,
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
              backgroundStyle={{ backgroundColor: theme.Background }}
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
                    <CustomButton
                      width={150}
                      height={30}
                      key={index}
                      title={action.label}
                      onPress={action.onPress}
                    />
                  ))}
                </View>

                <SinopseExpandable synopsis={synopsis} />

                <View
                  style={{ alignItems: "flex-start", justifyContent: "center" }}
                >
                  <NunitoText
                    style={[
                      styles.secondTitle,
                      { paddingBottom: 25, color: theme.primaryText },
                    ]}
                  >
                    Principais Resenhas e Comentários
                  </NunitoText>

                  <ReviewComment
                    comment={true}
                    byAuthor={true}
                    datePost={"30/01/2025"}
                    text={
                      "Amei o livro, muito bom mesmo! Recomendo muito. A história é envolvente e os personagens são bem desenvolvidos."
                    }
                    fullNamePostAuthor={"Monica Alvarenga"}
                  />

                  <ReviewComment
                    comment={false}
                    byAuthor={false}
                    fullNamePostAuthor={"Monica Alvarenga"}
                    datePost={"22/08/2024"}
                    text={
                      "Memórias da Meia-Noite é um romance de Sidney Sheldon que mistura mistério, drama e uma boa dose de suspense. A história gira em torno de Katherine, uma mulher marcada por tragédias pessoais e uma vida cheia de reviravoltas. Ela se vê envolvida em uma trama que desafia sua compreensão de confiança, vingança e sobrevivência, enquanto tenta descobrir os segredos obscuros de seu passado e lidar com as consequências de suas escolhas.Com o estilo característico de Sheldon, a narrativa é envolvente e cheia de surpresas, mantendo o leitor na expectativa até o final. A trama é recheada de personagens complexos e dilemas emocionais, explorando temas como o perdão, a vingança e os jogos de poder. A escrita é fluída, o ritmo é rápido e as reviravoltas são sempre inesperadas. É uma história que prende o leitor até a última página, com um final impactante."
                    }
                  />
                </View>

                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
                    <Text style={{ color: theme.quinaryText }}>
                      Acessar mais
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 30 }}></View>

                <NunitoText
                  style={[
                    styles.secondTitle,
                    { paddingBottom: 15, color: theme.primaryText },
                  ]}
                >
                  Livros do mesmo autor
                </NunitoText>
                <CustomCarousel
                  isHorizontal
                  data={[
                    <CustomBook
                      key={1}
                      bookId={0}
                      photoPath={require("../assets/images/book-cover.png")}
                    />,
                  ]}
                />

                <View style={{ marginBottom: 15 }}></View>

                <NunitoText
                  style={[
                    styles.secondTitle,
                    { paddingBottom: 15, color: theme.primaryText },
                  ]}
                >
                  Livros semelhantes
                </NunitoText>
                <CustomCarousel
                  isHorizontal
                  data={[
                    <CustomBook
                      key={1}
                      bookId={0}
                      photoPath={require("../assets/images/book-cover.png")}
                    />,
                  ]}
                />

                <View style={{ marginBottom: 500 }}></View>
              </BottomSheetScrollView>
            </BottomSheet>
          </GestureHandlerRootView>
        </ImageBackground>
      </View>
    );
  };

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
    textAlign: "justify",
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
    transform: "scale(0.8)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
});

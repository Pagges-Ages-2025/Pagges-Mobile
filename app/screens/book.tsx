import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BookCover from "../assets/images/book-cover.png";
import NunitoText from "../components/Texts/NunitoText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import CustomButton from "../components/Buttons/CustomButton";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CustomCarousel from "../components/Carousel/CustomCarousel";
import CustomBook from "../components/Book/CustomBook";
import { ReviewComment } from "../components/review-comments/review-comments";
import { Modal, Pressable } from "react-native";
import CustomModal from "../components/review-comments/pop-up-modal";

interface BookPageProps {
  rating: number;
  name: string;
  readersNumber: number;
  pagesNumber: number;
  rankingNumber: string;
}

export default function BookPage({
  rating,
  name,
  readersNumber,
  pagesNumber,
  rankingNumber,
}: BookPageProps) {
  const { theme } = useTheme();
  const ratingValue = rating || 3.5;
  const nameValue = name || "Memórias da Meia-Noite";
  const readersNumberValue = readersNumber || 1.201;
  const pagesNumberValue = pagesNumber || 201;
  const rankingNumberValue = rankingNumber || "1";
  const synopsis =
    "Catherine começa a ter vislumbres do passado, flashes de memórias fragmentadas que desafiam a névoa imposta sobre sua mente. Aos poucos, os rostos de Larry Douglas e Noelle Page ressurgem em sua consciência, assim como a sensação de perigo e traição que a assombra mesmo sem compreender completamente o motivo. No convento isolado onde vive, as freiras percebem sua inquietação crescente. O instinto de sobrevivência de Catherine a impulsiona a buscar respostas, e um dia, ao encontrar uma notícia antiga em um jornal amarelado deixado na biblioteca do convento, um nome chama sua atenção: Constantin Demiris. Embora não consiga lembrar de tudo, a simples leitura daquele nome desperta nela uma sensação de medo e repulsa inexplicáveis.";
  const review =
    "O Homem de Giz, de C.J. Tudor, é um thriller psicológico envolvente que mistura passado e presente para revelar um mistério sombrio e perturbador. Com uma narrativa que lembra os clássicos de Stephen King, o livro nos transporta para a infância de Eddie Adams, um garoto de 12 anos que, junto com seus amigos, vive em uma pequena cidade inglesa. Eles criam um código secreto usando desenhos de bonecos de giz para se comunicarem, mas o jogo inocente se torna um pesadelo quando encontram um corpo mutilado na floresta. Trinta anos depois, Eddie tenta esquecer os traumas do passado, até que recebe um envelope contendo um desenho idêntico aos de sua infância. Logo, eventos estranhos começam a acontecer, e antigos segredos vêm à tona. A história é contada em capítulos alternados entre 1986 e 2016, criando uma atmosfera de mistério e tensão constante.";
  const [isMaximized, setIsMaximized] = useState(false);
  const [showMoreText, setShowMoreText] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(ratingValue);
  const [ratingCount, setRatingCount] = useState(1);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const roundedStars = Math.round(ratingValue);
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

  const BottomSheetHandle = () => (
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
    </View>
  );

  const bookStats = [
    { value: readersNumberValue, label: "Leitores" },
    { value: pagesNumberValue, label: "Páginas" },
    { value: currentRating.toFixed(1), label: "Avaliação" },
    { value: `#${rankingNumberValue}`, label: "Ranking" },
  ];

  const bookActions = [
    {
      label: "Já li",
      onPress: () => {
        /* lógica futura */
      },
    },
    {
      label: "Estou lendo",
      onPress: () => {
        /* lógica futura */
      },
    },
    {
      label: "Quero ler",
      onPress: () => {
        /*lLógica futura */
      },
    },
  ];

  const handleNewRating = (newRating: number) => {
    const total = currentRating * ratingCount;
    const updatedCount = ratingCount + 1;
    const newAverage = (total + newRating) / updatedCount;

    setCurrentRating(newAverage);
    setRatingCount(updatedCount);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={BookCover} style={styles.backgroundImage}>
        {/* <ImageBackground source={{uri:photoPath}} style={styles.backgroundImage}> */}
        <View style={styles.overlay} />

        {/* Conteúdo escrito */}
        <View style={styles.bookContentContainer}>
          {isMaximized ? (
            <View style={{ flexDirection: "row", marginBottom: 0 }}>
              <Ionicons
                name="return-up-back-outline"
                size={30}
                color={theme.quinaryText}
                style={{ paddingRight: 20 }}
              />
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
                  {nameValue.length > 23
                    ? nameValue.substring(0, 23) + "..."
                    : nameValue}
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
              <Ionicons
                name="return-up-back-outline"
                size={30}
                color={theme.quinaryText}
              />
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  // Lógica
                }}
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
                    color: theme.quinaryText,
                  }}
                >
                  Criar Resenha
                </NunitoText>
              </TouchableOpacity>
              <AntDesign name="export" size={24} color={theme.quinaryText} />
            </View>
          )}
          <NunitoText style={[styles.title, { color: theme.quinaryText }]}>
            Memórias da Meia-Noite
          </NunitoText>
          <NunitoText style={[styles.subtitle, { color: theme.quinaryText }]}>
            Julia Polastrie
          </NunitoText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <NunitoText style={[styles.date, { color: theme.quinaryText }]}>
              26 de junho, 1997
            </NunitoText>
            <NunitoText
              style={{ color: theme.quinaryText, paddingHorizontal: 10 }}
            >
              -
            </NunitoText>
            <NunitoText style={[styles.gender, { color: theme.quinaryText }]}>
              Fantasia
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
              {Array.from({ length: 5 }).map((_, index) => (
                <AntDesign
                  key={index}
                  name={index < roundedStars ? "star" : "staro"}
                  size={20}
                  color={
                    index < roundedStars ? theme.starColor : theme.quinaryText
                  }
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
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

            <CustomModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              content="Avalie o livro"
              nameBook={nameValue}
              onRate={handleNewRating}
            />
          </View>
        </View>

        {/* bottom sheet */}
        <GestureHandlerRootView style={styles.container}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            onChange={handleSheetChanges}
            enablePanDownToClose={false}
            enableOverDrag={false}
            handleComponent={BottomSheetHandle}
            enableContentPanningGesture={false}
          >
            {/* conteúdo do bottom sheet */}
            <BottomSheetScrollView>
              <ScrollView>
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
                          { color: theme.quaternaryText },
                        ]}
                      >
                        {stat.value}
                      </NunitoText>
                      <NunitoText
                        style={[
                          styles.bookNumbersTitle,
                          { color: theme.quaternaryText },
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
                      key={index}
                      title={action.label}
                      onPress={() => {}}
                      fullWidth={false}
                      width={140}
                      height={30}
                    />
                  ))}
                </View>

                <View>
                  <NunitoText
                    style={[
                      styles.secondTitle,
                      { color: theme.quaternaryText },
                    ]}
                  >
                    Sinopse
                  </NunitoText>
                  <NunitoText
                    style={[
                      styles.synopsisText,
                      { color: theme.quaternaryText },
                    ]}
                  >
                    {showMoreText
                      ? synopsis
                      : synopsis.substring(0, 450) + "..."}
                  </NunitoText>

                  <TouchableOpacity
                    onPress={() => setShowMoreText(!showMoreText)}
                    style={styles.moreAndLessButton}
                  >
                    <Text
                      style={[
                        styles.showMoreAndLess,
                        { color: theme.quaternaryText },
                      ]}
                    >
                      {showMoreText ? "Mostrar menos" : "Mostrar mais"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{ alignItems: "flex-start", justifyContent: "center" }}
                >
                  <NunitoText
                    style={[styles.secondTitle, { paddingBottom: 25 }]}
                  >
                    Principais Resenhas e Comentários
                  </NunitoText>

                  <ReviewComment
                    comment={true}
                    byAuthor={true}
                    fullNamePostAuthor={"Luisa Marques"}
                    datePost={"30/01/2025"}
                    text={
                      "Amei o livro, muito bom mesmo! Recomendo muito. A história é envolvente e os personagens são bem desenvolvidos."
                    }
                  />

                  <ReviewComment
                    comment={false}
                    byAuthor={false}
                    fullNamePostAuthor={"Monica Alvarenga"}
                    datePost={"22/08/2024"}
                    text={review}
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

                <NunitoText style={[styles.secondTitle, { paddingBottom: 15 }]}>
                  Livros do mesmo autor
                </NunitoText>
                <CustomCarousel
                  isHorizontal
                  data={[
                    <CustomBook
                      photoPath={
                        "https://static.wixstatic.com/media/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg/v1/fill/w_480,h_768,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg"
                      }
                    />,
                    <CustomBook
                      photoPath={
                        "https://f.i.uol.com.br/fotografia/2023/04/13/16813903606437fb18c8902_1681390360_1x1_md.jpg"
                      }
                    />,
                    <CustomBook
                      photoPath={
                        "https://ocapista.com.br/imgs/capas/capa_livro_fantasia.jpg"
                      }
                    />,
                  ]}
                />

                <View style={{ marginBottom: 15 }}></View>

                <NunitoText style={[styles.secondTitle, { paddingBottom: 15 }]}>
                  Livros semelhantes
                </NunitoText>
                <CustomCarousel
                  isHorizontal
                  data={[
                    <CustomBook
                      photoPath={
                        "https://static.wixstatic.com/media/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg/v1/fill/w_480,h_768,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/31a549_7dffb191bffa440686e5a148b8e042d9~mv2.jpg"
                      }
                    />,
                    <CustomBook
                      photoPath={
                        "https://f.i.uol.com.br/fotografia/2023/04/13/16813903606437fb18c8902_1681390360_1x1_md.jpg"
                      }
                    />,
                    <CustomBook
                      photoPath={
                        "https://ocapista.com.br/imgs/capas/capa_livro_fantasia.jpg"
                      }
                    />,
                  ]}
                />

                <View style={{ marginBottom: 500 }}></View>
              </ScrollView>
            </BottomSheetScrollView>
          </BottomSheet>
        </GestureHandlerRootView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
    justifyContent: "flex-start",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 5,
  },
  bookContentContainer: {
    position: "absolute",
    top: "9%",
    left: "5%",
    right: "5%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  ratingValue: {
    paddingHorizontal: 10,
    fontSize: 18,
  },
  smallTitle: {
    position: "absolute",
    top: "9%",
    alignItems: "center",
    width: "100%",
    paddingRight: 5,
    paddingLeft: 30,
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
  synopsisText: {
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
    gap:10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 20,
    transform: "scale(0.8)"
  },
});

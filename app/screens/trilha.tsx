import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import pointImage from '../assets/images/level.png';
import { Challange } from '../models/Challanges';
import ChallangesAPI from '../services/challanges';
import DailyChallenge from './DailyChallenge';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path } from 'react-native-svg';
import NunitoText from '../components/Texts/NunitoText';

import ActiveLevel from "../assets/images/activeLevel.png"
import cloud from "../assets/images/cloud.png"
import book1 from "../assets/images/background/book1.png"
import book2 from "../assets/images/background/book2.png"
import book3 from "../assets/images/background/book3.png"
import book4 from "../assets/images/background/book4.png"

const { width, height } = Dimensions.get('window');
const POINT_SIZE = 80;
const CURVE_AMPLITUDE = 100;
const POINTS_PER_SECTION = 4;
const LINE_WIDTH = 5;
const POINT_OFFSET = 30;

const Trilha = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const correctAnswers = Number(params.correctAnswers) || 0;
  const [challangeData, setChallangeData] = useState<Challange>();
  const [showChallange, setShowChallange] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useTheme();

  // Calcular qual bloco de 40 o usuário deve ver
  const currentBlock = Math.floor(correctAnswers / 40);
  const startLevel = currentBlock * 40 + 1; // Primeiro nível do bloco atual
  const endLevel = startLevel + 39; // Último nível do bloco atual (sempre 40 níveis)

  // Posicionar o scroll na parte inferior quando a página carregar
  useEffect(() => {
    const totalHeight = height * 10;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: totalHeight,
        animated: false
      });
    }, 100);
  }, []);

  useEffect(() => {
    console.log("RESPOSTAS CORRETAS da trilha:", correctAnswers);
    console.log("Bloco atual:", currentBlock);
    console.log("Níveis mostrados:", startLevel, "até", endLevel);
  }, [correctAnswers, currentBlock, startLevel, endLevel])

  // Função para calcular a posição X baseada na posição Y
  const calculateX = (y: number, totalHeight: number) => {
    return Math.sin((y / totalHeight) * Math.PI * 20) * CURVE_AMPLITUDE;
  };

  // Função para gerar livros decorativos nos cantos
  const generateDecorativeBooks = () => {
    const books = [book1, book2, book3, book4];
    const totalHeight = height * 10;
    const decorativeBooks = [];
    const numBooks = 35; // Mais livros para preencher melhor

    for (let i = 0; i < numBooks; i++) {
      const y = (i / numBooks) * totalHeight + Math.random() * (totalHeight / numBooks); // Distribui melhor verticalmente
      const trailX = calculateX(y, totalHeight);
      const bookImage = books[Math.floor(Math.random() * books.length)];
      
      // Criar diferentes "camadas" de profundidade
      const layer = Math.floor(Math.random() * 3); // 0, 1, 2 (fundo, meio, frente)
      let scale, baseSize;
      
      switch (layer) {
        case 0: // Fundo - livros menores e mais transparentes
          scale = 0.6 + Math.random() * 0.3; // 0.6 - 0.9
          baseSize = { width: 80, height: 120 };
          break;
        case 1: // Meio - tamanho médio
          scale = 0.8 + Math.random() * 0.4; // 0.8 - 1.2
          baseSize = { width: 120, height: 180 };
          break;
        case 2: // Frente - livros maiores
          scale = 1.0 + Math.random() * 0.5; // 1.0 - 1.5
          baseSize = { width: 140, height: 210 };
          break;
        default:
          scale = 1.0;
          baseSize = { width: 120, height: 180 };
      }
      
      // Posicionamento melhorado
      const isLeft = Math.random() > 0.5;
      const safeDistance = 140 + (layer * 20); // Distância varia por camada
      
      let x;
      if (isLeft) {
        // Lado esquerdo - múltiplas zonas
        const zones = [
          { min: 15, max: width * 0.15 }, // Muito na borda
          { min: width * 0.05, max: width * 0.25 }, // Zona intermediária
          { min: width * 0.1, max: Math.max(50, width / 2 + trailX - safeDistance) } // Próximo da trilha
        ];
        const zone = zones[Math.floor(Math.random() * zones.length)];
        x = zone.min + Math.random() * Math.max(20, zone.max - zone.min);
      } else {
        // Lado direito - múltiplas zonas
        const minRightX = width / 2 + trailX + safeDistance;
        const zones = [
          { min: minRightX, max: width * 0.75 }, // Próximo da trilha
          { min: width * 0.75, max: width * 0.9 }, // Zona intermediária
          { min: width * 0.85, max: width - 15 } // Muito na borda
        ];
        
        const validZones = zones.filter(zone => zone.min < zone.max);
        if (validZones.length > 0) {
          const zone = validZones[Math.floor(Math.random() * validZones.length)];
          x = zone.min + Math.random() * (zone.max - zone.min);
        } else {
          // Fallback para lado esquerdo
          x = 15 + Math.random() * Math.max(20, width / 2 + trailX - safeDistance - 15);
        }
      }

      const rotation = (Math.random() - 0.5) * 50; // Rotação mais variada
      const opacity = layer === 0 ? 0.4 + Math.random() * 0.3 : 0.6 + Math.random() * 0.4;

      decorativeBooks.push({
        id: i,
        x,
        y,
        image: bookImage,
        rotation,
        scale,
        layer,
        baseSize,
        opacity,
      });
    }

    // Ordenar por layer para renderizar na ordem correta (fundo primeiro)
    return decorativeBooks.sort((a, b) => a.layer - b.layer);
  };

  const decorativeBooks = generateDecorativeBooks();

  // Função para gerar a trilha e os pontos
  const generateTrailAndPoints = () => {
    const totalHeight = height * 10;
    const numPoints = 1000;
    let path = '';
    let firstPoint = true;
    const points = [];
    const sections = 10;

    // Gerar pontos da trilha
    for (let i = 0; i < numPoints; i++) {
      const y = totalHeight - (i * (totalHeight / numPoints));
      const x = calculateX(y, totalHeight);

      if (firstPoint) {
        path += `M ${width / 2 + x} ${y}`;
        firstPoint = false;
      } else {
        path += ` L ${width / 2 + x} ${y}`;
      }
    }

    // Gerar pontos de desafio (sempre 40 pontos, mas com números do bloco atual)
    for (let section = 0; section < sections; section++) {
      for (let i = 0; i < POINTS_PER_SECTION; i++) {
        const y = totalHeight - (section * height + (height / POINTS_PER_SECTION) * i);
        const x = calculateX(y, totalHeight);
        const positionInBlock = section * POINTS_PER_SECTION + i; // 0-39
        const levelNumber = startLevel + positionInBlock; // Número real do nível
        const locked = levelNumber > correctAnswers + 1;
        points.push({ x, y, locked, levelNumber });
      }
    }

    return { path, points };
  };

  const { path, points: challengePoints } = generateTrailAndPoints();

  const handlePointPress = async (levelNumber: number) => {
    // Só permite acessar níveis que o usuário já desbloqueou
    if (levelNumber > correctAnswers + 1) {
      console.log(`Nível ${levelNumber} ainda não desbloqueado. Máximo permitido: ${correctAnswers + 1}`);
      return;
    }

    try {
      console.log(`Acessando nível ${levelNumber} do bloco ${currentBlock + 1}`);
      try {
        const response = await ChallangesAPI().getCurrentChallange();
        setChallangeData(response);
        setShowChallange(true);
      } catch (error) {
        console.warn(`Não foi possível buscar desafio do nível ${levelNumber}. Usando desafio atual.`);
        const currentChallenge = await ChallangesAPI().getCurrentChallange();
        setChallangeData(currentChallenge);
        setShowChallange(true);
      }
    } catch (error) {
      console.error("Erro ao buscar desafio:", error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.Background }]}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.primaryText} />
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Livros decorativos de fundo */}
          <View style={styles.decorativeBooksContainer}>
            {decorativeBooks.map((book) => (
              <Animated.View
                key={book.id}
                style={[
                  styles.decorativeBook,
                  {
                    left: book.x,
                    top: book.y,
                    zIndex: book.layer, // Controla a profundidade
                    transform: [
                      { rotate: `${book.rotation}deg` },
                      { scale: book.scale },
                      {
                        translateY: scrollY.interpolate({
                          inputRange: [book.y - height, book.y, book.y + height],
                          outputRange: [10 + book.layer * 5, 0, 10 + book.layer * 5], // Movimento varia por camada
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                    opacity: scrollY.interpolate({
                      inputRange: [book.y - height * 2, book.y, book.y + height * 2],
                      outputRange: [book.opacity * 0.3, book.opacity, book.opacity * 0.3],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <Image 
                  source={book.image} 
                  style={[
                    styles.bookImage,
                    {
                      width: book.baseSize.width,
                      height: book.baseSize.height,
                      shadowOpacity: book.layer * 0.15, // Sombra aumenta com a camada
                      shadowOffset: {
                        width: book.layer * 2,
                        height: book.layer * 3,
                      },
                      shadowRadius: book.layer * 4,
                    }
                  ]} 
                />
              </Animated.View>
            ))}
          </View>

          {/* Trilha de fundo */}
          <View style={styles.trailContainer}>
            <Svg style={StyleSheet.absoluteFill}>
              <Path
                d={path}
                stroke={theme.secondary}
                strokeWidth={LINE_WIDTH}
                strokeDasharray="50, 15"
                fill="none"
              />
            </Svg>
          </View>

          {/* Pontos de desafio */}
          <View style={styles.pointsContainer}>
            {/* Cloud no bottom se não estiver no primeiro bloco */}
            {currentBlock > 0 && (
              <View style={styles.bottomCloudContainer}>
                <Image source={cloud} style={styles.fullWidthCloud} />
              </View>
            )}

            {challengePoints.map((point, index) => {
              const isActiveLevel = point.levelNumber === correctAnswers + 1;
              const currentPointImage = isActiveLevel ? ActiveLevel : pointImage;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.pointContainer,
                    {
                      transform: [
                        { translateX: point.x },
                        { translateY: point.y - POINT_OFFSET },
                        {
                          scale: scrollY.interpolate({
                            inputRange: [point.y - height, point.y, point.y + height],
                            outputRange: [0.8, 1, 0.8],
                            extrapolate: 'clamp',
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.pointWrapper}>
                    <Image
                      source={currentPointImage}
                      style={[
                        styles.point,
                        point.locked && styles.lockedPointImage
                      ]}
                    />
                    {point.levelNumber <= correctAnswers ? (
                      <Ionicons 
                        name="checkmark" 
                        size={60} 
                        color={theme.primary} 
                        style={[styles.levelNumber, styles.checkIcon]} 
                      />
                    ) : (
                      <NunitoText style={styles.levelNumber}>
                        {point.levelNumber}
                      </NunitoText>
                    )}
                    {!point.locked && point.levelNumber > correctAnswers && (
                      <TouchableOpacity
                        onPress={() => handlePointPress(point.levelNumber)}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                  </View>
                </Animated.View>
              );
            })}

            {/* Cloud no topo para indicar que virão mais níveis */}
            <View style={styles.topCloudContainer}>
              <Image source={cloud} style={styles.fullWidthCloud} />
            </View>
          </View>
        </View>
      </ScrollView>

      {challangeData && (
        <DailyChallenge
          visible={showChallange}
          onClose={() => setShowChallange(false)}
          question={challangeData.question}
          alternatives={challangeData.alternatives}
          points={challangeData.points}
          challengeId={challangeData.challenge_id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 65,
    left: 25,
    padding: 8,
    zIndex: 9999
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: height * 0.1,
  },
  content: {
    width: width,
    height: height * 10,
  },
  trailContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  pointsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  pointContainer: {
    position: 'absolute',
    left: width / 2 - POINT_SIZE / 2,
  },
  pointWrapper: {
    width: POINT_SIZE,
    height: POINT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  point: {
    width: POINT_SIZE,
    height: POINT_SIZE,
    resizeMode: 'contain',
  },
  lockedPointImage: {
    opacity: 0.5,
  },
  levelNumber: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cloudImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  bottomCloudContainer: {
    position: 'absolute',
    objectFit: 'contain',
    bottom: -260,
    left: 0,
    right: 0,
  },
  topCloudContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
  },
  fullWidthCloud: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  decorativeBooksContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  decorativeBook: {
    position: 'absolute',
  },
  bookImage: {
    resizeMode: 'contain',
    shadowColor: '#000',
  },
  checkIcon: {
    fontSize: 35,
    position: 'absolute',
  },
});

export default Trilha; 
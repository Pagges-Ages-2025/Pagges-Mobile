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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import pointImage from '../assets/images/level.png';
import { Challange } from '../models/Challanges';
import ChallangesAPI from '../services/challanges';
import DailyChallenge from './DailyChallenge';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path } from 'react-native-svg';
import NunitoText from '../components/Texts/NunitoText';

const { width, height } = Dimensions.get('window');
const POINT_SIZE = 80;
const CURVE_AMPLITUDE = 100;
const POINTS_PER_SECTION = 4;
const LINE_WIDTH = 5;
const POINT_OFFSET = 30;

const Trilha = () => {
  const router = useRouter();
  const [challangeData, setChallangeData] = useState<Challange>();
  const [showChallange, setShowChallange] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useTheme();

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

  // Função para calcular a posição X baseada na posição Y
  const calculateX = (y: number, totalHeight: number) => {
    return Math.sin((y / totalHeight) * Math.PI * 20) * CURVE_AMPLITUDE;
  };

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
        path += `M ${width/2 + x} ${y}`;
        firstPoint = false;
      } else {
        path += ` L ${width/2 + x} ${y}`;
      }
    }

    // Gerar pontos de desafio
    for (let section = 0; section < sections; section++) {
      for (let i = 0; i < POINTS_PER_SECTION; i++) {
        const y = totalHeight - (section * height + (height / POINTS_PER_SECTION) * i);
        const x = calculateX(y, totalHeight);
        const levelNumber = section * POINTS_PER_SECTION + i + 1;
        const locked = levelNumber > 1;
        points.push({ x, y, locked, levelNumber });
      }
    }

    return { path, points };
  };

  const { path, points: challengePoints } = generateTrailAndPoints();

  const handlePointPress = async (levelNumber: number) => {
    try {
      const response = await ChallangesAPI().getCurrentChallange();
      setChallangeData(response);
      setShowChallange(true);
    } catch (error) {
      console.error("Error fetching current daily challange:", error);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.Background}]}>
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
            {challengePoints.map((point, index) => (
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
                    source={pointImage}
                    style={[
                      styles.point,
                      point.locked && styles.lockedPointImage
                    ]}
                  />
                  <NunitoText style={styles.levelNumber}>
                    {point.levelNumber}
                  </NunitoText>
                  {!point.locked && (
                    <TouchableOpacity
                      onPress={() => handlePointPress(point.levelNumber)}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                </View>
              </Animated.View>
            ))}
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
    top: 55,
    left: 25,
    padding: 8,
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
});

export default Trilha; 
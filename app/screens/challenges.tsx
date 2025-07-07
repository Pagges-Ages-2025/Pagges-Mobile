import { User } from "@/app/models/User";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import profileUser from "../assets/images/profile-user.png";
import PodiumRanking from "../components/Podium/PodiumRanking";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import ChallangesAPI from "../services/challanges";
import UserAPI from "../services/profileService";
import RankingService, { UserRanking } from "../services/rankingService";
import { base64Uri } from "../utils/imageUtils";

export default function Challenges() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [data, setData] = useState<User>();
  const [challangeData, setChallangeData] = useState<number>(0);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  const handleNavigateToRanking = () => {
    router.push("/screens/generalRanking");
  };

  const [topUsers, setTopUsers] = useState<{
    firstRank: UserRanking;
    secondRank: UserRanking;
    thirdRank: UserRanking;
  }>();

  const { fetchAndSplitRanking, getMyRanking } = RankingService();
  const [myRankingPosition, setMyRankingPosition] = useState<number | null>(
    null
  );

  // Handle earned points from navigation params
  useFocusEffect(
    useCallback(() => {
      const earnedPointsParam = params.earnedPoints;
      if (earnedPointsParam) {
        const points = parseInt(earnedPointsParam as string);
        if (!isNaN(points)) {
          animatePoints(points);
          // Clear the parameter after using it
          router.setParams({ earnedPoints: undefined });
        }
      }
    }, [params.earnedPoints])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchAllData = async () => {
        try {
          // Fetch profile and correct answers
          const [profileResponse, correctsResponse] = await Promise.all([
            UserAPI().getProfile(),
            ChallangesAPI().getUserCorrects(),
          ]);
          setData(profileResponse);
          setChallangeData(correctsResponse);
          console.log("RESPOSTAS CORRETAS:", correctsResponse);

          // Fetch ranking data
          const { top3 } = await fetchAndSplitRanking();
          if (top3.length >= 3) {
            console.log("top3 secondRank:", top3[1]);
            setTopUsers({
              firstRank: top3[0],
              secondRank: top3[1],
              thirdRank: top3[2],
            });
          } else {
            console.error("Ranking precisa de ao menos 3 usuários.");
          }

          // Fetch personal ranking
          const myRankingResponse = await getMyRanking();
          setMyRankingPosition(myRankingResponse.position);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };

      fetchAllData();
    }, [])
  );

  const animatePoints = (points: number) => {
    setEarnedPoints(points);
    // Reset animation value
    fadeAnim.setValue(0);

    // Start fade in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Keep visible for 1 second
      Animated.delay(1000),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setEarnedPoints(null);
    });
  };

  const handleButtonPress = () => {
    router.push({
      pathname: "/screens/trilha",
      params: { correctAnswers: challangeData },
    });
    console.log("Button pressed");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Image
            source={
              data?.profileImage
                ? { uri: base64Uri(data.profileImage) }
                : profileUser
            }
            style={styles.profileImage}
          />
          <View style={{ marginStart: 12, flex: 1 }}>
            <NunitoText style={styles.rankingLabel}>
              {myRankingPosition !== null ? `${myRankingPosition}º` : "xº"}{" "}
              lugar no ranking geral
            </NunitoText>
            <View style={styles.pointsContainer}>
              <NunitoText style={[styles.points, { color: theme.primary }]}>
                {data?.points == undefined ? 0 : data.points} PONTOS
              </NunitoText>
              {earnedPoints && (
                <Animated.View
                  style={[
                    styles.earnedPointsContainer,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <NunitoText style={styles.earnedPoints}>
                    +{earnedPoints} pontos
                  </NunitoText>
                </Animated.View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => handleButtonPress()}
            style={[styles.dailyButton, { backgroundColor: theme.secondary }]}
          >
            <NunitoText
              style={[styles.dailyButtonText, { color: theme.white }]}
            >
              Perguntas Diárias
            </NunitoText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <NunitoText
            style={[styles.sectionTitle, { color: theme.primaryText }]}
          >
            Rankings
          </NunitoText>

          {topUsers && (
            <TouchableOpacity
              onPress={handleNavigateToRanking}
              activeOpacity={0.8}
            >
              <PodiumRanking
                firstRank={{
                  name: topUsers.firstRank.name,
                  username: topUsers.firstRank.username,
                  image: topUsers.firstRank.profile_image
                    ? base64Uri(topUsers.firstRank.profile_image)
                    : undefined,
                }}
                secondRank={{
                  name: topUsers.secondRank.name,
                  username: topUsers.secondRank.username,
                  image: topUsers.secondRank.profile_image
                    ? base64Uri(topUsers.secondRank.profile_image)
                    : undefined,
                }}
                thirdRank={{
                  name: topUsers.thirdRank.name,
                  username: topUsers.thirdRank.username,
                  image: topUsers.thirdRank.profile_image
                    ? base64Uri(topUsers.thirdRank.profile_image)
                    : undefined,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 18,
  },
  dailyButton: {
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 14,
  },
  dailyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    margin: 14,
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "left",
  },
  profileImage: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },
  rankingLabel: {
    color: "#8C8C8C",
    fontSize: 16,
    textAlign: "left",
  },
  section: {
    marginBottom: 30, // espaçamento entre blocos
  },
  sectionHeader: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    marginBottom: 40, // espaçamento entre blocos
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  earnedPointsContainer: {
    marginLeft: 10,
    paddingTop: 5,
  },
  earnedPoints: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
});

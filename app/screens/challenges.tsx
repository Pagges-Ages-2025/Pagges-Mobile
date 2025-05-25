import { User } from "@/app/models/User";
import React, { useEffect, useRef, useState } from "react";
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
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { Challange } from "../models/Challanges";
import ChallangesAPI from "../services/challanges";
import UserAPI from "../services/profileService";
import { base64Uri } from "../utils/imageUtils";
import DailyChallenge from "./DailyChallenge";

export default function Challenges() {
  const [data, setData] = useState<User>();
  const [showChallange, setShowChallange] = useState(false);
  const [challangeData, setChallangeData] = useState<Challange>();
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserAPI().getProfile();
        setData(response);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleButtonPress = async () => {
    try {
      const response = await ChallangesAPI().getCurrentChallange();
      setChallangeData(response);
      setShowChallange(true);
    } catch (error) {
      console.error("Error fetching current daily challange:", error);
    }
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
              {data?.ranking ? data.ranking : "xº"} lugar ranking geral
            </NunitoText>
            <View style={styles.pointsContainer}>
              <NunitoText style={[styles.points, { color: theme.primary }]}>
                {data?.readBooks ? data.points : "X"} PONTOS
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
              Desafio diário
            </NunitoText>
          </TouchableOpacity>
        </View>

        {/* We don't have information for the next two times, but when we do, just put it here. */}
        <View style={styles.section}>
          <NunitoText
            style={[styles.sectionTitle, { color: theme.primaryText }]}
          >
            Perguntas Diárias
          </NunitoText>
        </View>
        <View style={styles.section}>
          <NunitoText
            style={[styles.sectionTitle, { color: theme.primaryText }]}
          >
            Rankings
          </NunitoText>
        </View>
      </ScrollView>

      {challangeData && (
        <DailyChallenge
          visible={showChallange}
          onClose={async (earnedPoints) => {
            setShowChallange(false);
            if (earnedPoints) {
              animatePoints(earnedPoints);
              try {
                const response = await UserAPI().getProfile();
                setData(response);
              } catch (error) {
                console.error("Error refreshing profile:", error);
              }
            }
          }}
          question={challangeData!.question}
          alternatives={challangeData!.alternatives}
          points={challangeData!.points}
          challengeId={challangeData!.challenge_id}
        ></DailyChallenge>
      )}
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

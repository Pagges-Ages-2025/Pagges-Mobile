import { useTheme } from "../context/ThemeContext";
import React, { useEffect, useState } from "react";
import { User } from "@/app/models/User";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NunitoText from "../components/Texts/NunitoText";
import profileUser from "../assets/images/profile-user.png";
import UserAPI from "../services/profileService";
import { base64Uri } from "../utils/imageUtils";
import DailyChallenge from "./DailyChallenge";
import ChallangesAPI from "../services/challanges";
import { Challanges } from "../models/Challanges";

export default function Challenges() {
  const [data, setData] = useState<User>();
  const [showChallange, setShowChallange] = useState(false);
  const [challangeData, setChallangeData] = useState<Challanges>();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserAPI().getProfile();
        setData(response);
        console.log(response)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleButtonPress = async () => {
    const response = await ChallangesAPI().getCurrentChallange();
    setChallangeData(response);
    setShowChallange(true);
  }

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
          <View style={{ marginStart: 12 }}>
            <NunitoText style={styles.rankingLabel}>
              {data?.ranking ? data.ranking : "xº"} lugar ranking geral
            </NunitoText>
            <NunitoText style={[styles.points, { color: theme.primary }]}>
              {data?.readBooks ? data.points : "X"} PONTOS
            </NunitoText>
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

      { challangeData && <DailyChallenge
      visible={showChallange}
      onClose={() => {setShowChallange(false)}}
      question= {challangeData!.question}
      alternatives= {challangeData!.alternatives}
      points= {challangeData!.points}
      ></DailyChallenge>}
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
});

import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { base64Uri } from "../utils/imageUtils";
import profileUser from "../assets/images/profile-user.png";
import RankingPlaceCard from "../components/RankingPlaceCard/RankingPlaceCard";
import RankingService, { UserRanking } from "../services/rankingService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PodiumRanking from "../components/Podium/PodiumRanking";

export default function GeneralRanking() {
  const router = useRouter();
  const { theme } = useTheme();
  const [top3, setTop3] = useState<UserRanking[]>([]);
  const [outros7, setOutros7] = useState<UserRanking[]>([]);
  const [topUsers, setTopUsers] = useState<{
    firstRank: UserRanking;
    secondRank: UserRanking;
    thirdRank: UserRanking;
  }>();

  const { fetchAndSplitRanking } = RankingService();

  const handleNavigation = () => {
    router.back();
  };

  useEffect(() => {
    fetchAndSplitRanking()
      .then(({ top3, outros7 }) => {
        setTop3(top3);
        setOutros7(outros7);

        if (top3.length >= 3) {
          setTopUsers({
            firstRank: top3[0],
            secondRank: top3[1],
            thirdRank: top3[2],
          });
        } else {
          console.error("Top 3 incompleto.");
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar ranking:", err);
      });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity onPress={handleNavigation}>
            <Ionicons
              name="return-up-back-outline"
              size={30}
              color={theme.primaryText}
            />
          </TouchableOpacity>

          {topUsers && (
            <PodiumRanking
              firstRank={topUsers.firstRank}
              secondRank={topUsers.secondRank}
              thirdRank={topUsers.thirdRank}
            />
          )}

          <View style={styles.rankingList}>
            {outros7.map((user) => (
              <View style={styles.rankingItem} key={user.name}>
                <RankingPlaceCard
                  position={user.position}
                  name={user.name}
                  imageUrl={
                    user.profile_image
                      ? base64Uri(user.profile_image)
                      : Image.resolveAssetSource(profileUser).uri
                  }
                />
              </View>
            ))}
          </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  podiumPlaceholder: {
    height: 150,
    backgroundColor: "#2F726A",
    borderRadius: 8,
    marginBottom: 24,
  },
rankingList: {
  gap: 14,
  marginTop: 24,
},
  rankingItem: {
    alignItems: "center",
  },
});

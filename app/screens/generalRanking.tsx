// generalRanking.tsx
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { base64Uri } from "../utils/imageUtils";
import profileUser from "../assets/images/profile-user.png";
import RankingPlaceCard from "../components/RankingPlaceCard/RankingPlaceCard";
import RankingService, { UserRanking } from "../services/rankingService";

export default function GeneralRanking() {
  const { theme } = useTheme();
  const [top3, setTop3] = useState<UserRanking[]>([]);
  const [outros7, setOutros7] = useState<UserRanking[]>([]);

  const { fetchAndSplitRanking } = RankingService();

  useEffect(() => {
    fetchAndSplitRanking()
      .then(({ top3, outros7 }) => {
        setTop3(top3);
        setOutros7(outros7);
      })
      .catch((err) => {
        console.error("Erro ao carregar ranking:", err);
      });
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.Background }]}
    >
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <NunitoText
            style={[styles.sectionTitle, { color: theme.primaryText }]}
          >
            Ranking Geral
          </NunitoText>

          <View style={styles.podiumPlaceholder}></View>

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
  },
  rankingItem: {
    alignItems: "center",
  },
});

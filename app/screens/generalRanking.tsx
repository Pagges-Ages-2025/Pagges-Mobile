// generalRanking.tsx
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NunitoText from "../components/Texts/NunitoText";
import { useTheme } from "../context/ThemeContext";
import { User } from "../models/User";
import UserAPI from "../services/profileService";
import { base64Uri } from "../utils/imageUtils";
import profileUser from "../assets/images/profile-user.png";
import RankingPlaceCard from "../components/RankingPlaceCard/RankingPlaceCard";

export default function GeneralRanking() {
  const { theme } = useTheme();
  const [rankingList, setRankingList] = useState<User[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const users = await UserAPI().getRanking();
        setRankingList(users);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      }
    };
    fetchRanking();
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
            {rankingList.map((user, index) => (
              <View style={styles.rankingItem} key={user.email}>
                <RankingPlaceCard
                  position={index + 1}
                  name={user.name}
                  imageUrl={user.profileImage
                    ? base64Uri(user.profileImage)
                    : Image.resolveAssetSource(profileUser).uri}
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

// RankingPlaceCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import defaultImage from "../../assets/images/profile-user.png"
import { useTheme } from "../../context/ThemeContext";
import { Theme, themes } from "@/app/constants/Theme";

interface RankingPlaceCardProps {
  position: number;
  name: string;
  imageUrl?: string;
}

const RankingPlaceCard: React.FC<RankingPlaceCardProps> = ({ position, name, imageUrl }) => {
      const { theme } = useTheme();
      const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.position}>#{position}</Text>
      <Image source={imageUrl?{ uri: imageUrl }:defaultImage} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.iconColorSecondary,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    gap: 20
  },
  position: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.iconColorSecondary,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 18,
  },
  name: {
    fontWeight: '600',
    fontSize: 22,
    color: theme.iconColorSecondary,
  },
});

export default RankingPlaceCard;

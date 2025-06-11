import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { User } from '../searchUser/SearchUser';

interface Props {
  user: User;
  onDelete: () => void;
  isHistoryItem?: boolean;
  onSelect?: () => void;
}

export const SearchHistoryItem = ({
  user,
  onDelete,
  isHistoryItem,
  onSelect,
}: Props) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.Background }]}
      onPress={onSelect}
      disabled={!onSelect}
    >
      {isHistoryItem && (
        <MaterialIcons
          name="history"
          size={24}
          color={theme.placeholder}
        />
      )}

      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: theme.primaryText }]}>
          {user.name}
        </Text>
        <Text style={[styles.username, { color: theme.secondaryText }]}>
          @{user.username}
        </Text>
      </View>

      {isHistoryItem && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Feather name="x" size={20} color={theme.placeholder} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
});

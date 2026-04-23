import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMyStreak } from '@/hooks/queries/useGamification';

interface TopBarProps {
  streakCount?: number | string;
  hasCheckedInToday?: boolean;
}

const TopBar = ({ hasCheckedInToday = false }: TopBarProps) => {
  const router = useRouter();
  const { data: myStreak } = useMyStreak();

  return (
    <View className="flex-row items-center justify-between px-6">
      {/* Nút Grid bên trái */}
      <TouchableOpacity
        className="rounded-full bg-white/10 p-3"
        onPress={() => router.replace('/(tabs)/community')}>
        <Ionicons name="grid" size={24} color="white" />
      </TouchableOpacity>

      {/* Cụm Streak ở giữa */}
      <View className="flex-row items-center justify-center rounded-full bg-white/10 px-4 py-2">
        <MaterialCommunityIcons
          name="fire"
          size={22}
          color={hasCheckedInToday ? '#f97316' : '#9ca3af'}
        />
        <Text className="ml-1 font-inter-black text-lg text-white">{myStreak?.currentStreak}</Text>
      </View>

      {/* Nút Home bên phải */}
      <TouchableOpacity
        className="rounded-full bg-white/10 p-3"
        onPress={() => router.replace('/(tabs)/')}>
        <Ionicons name="home" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

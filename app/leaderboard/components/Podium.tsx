import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';
import { LeaderboardEntry } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

const Podium = ({ topThree }: PodiumProps) => {
  const { t } = useTranslation();
  const rank1 = topThree.find((item) => item.rank === 1);
  const rank2 = topThree.find((item) => item.rank === 2);
  const rank3 = topThree.find((item) => item.rank === 3);

  const getName = (item?: LeaderboardEntry) =>
    item?.displayName || t('leaderboard.anonymous');

  const getAvatar = (item?: LeaderboardEntry) => item?.avatarUrl || IMAGES.treeAvatar;

  const getPoints = (item?: LeaderboardEntry) => item?.weeklyPoints ?? 0;

  return (
    <View className="mb-4 mt-6 flex-row items-end justify-center gap-8">
      {/* Top 3 - Hạng 3 */}
      {/* Giả định IMAGES.crownBronze cũng là một frame tương tự */}
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownBronze }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa */}
          <Image
            source={{ uri: getAvatar(rank3) }}
            className="h-10 w-10 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-sm font-medium text-white">{getName(rank3)}</Text>
        <Text className="mt-1 text-xs font-semibold text-white">{getPoints(rank3)} GP</Text>
      </View>

      {/* Top 1 - Hạng 1 (To nhất) */}
      <View className="-mt-8 items-center">
        <View className="relative h-24 w-24 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownGold }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa (kích thước lớn hơn) */}
          <Image
            source={{ uri: getAvatar(rank1) }}
            className="h-16 w-16 rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="mt-2 text-base font-bold text-yellow-300">{getName(rank1)}</Text>
        <Text className="mt-1 text-sm font-semibold text-yellow-300">{getPoints(rank1)} GP</Text>
      </View>

      {/* Top 2 - Hạng 2 */}
      {/* Giả định IMAGES.crownSilver cũng là một frame tương tự */}
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownSilver }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa */}
          <Image
            source={{ uri: getAvatar(rank2) }}
            className="h-10 w-10 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-sm font-medium text-white">{getName(rank2)}</Text>
        <Text className="mt-1 text-xs font-semibold text-white">{getPoints(rank2)} GP</Text>
      </View>
    </View>
  );
};

export default Podium;

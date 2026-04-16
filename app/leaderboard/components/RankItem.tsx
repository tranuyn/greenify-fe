import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';
import { LeaderboardEntry } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

interface RankItemProps {
  item: LeaderboardEntry;
}

const RankItem = ({ item }: RankItemProps) => {
  const { t } = useTranslation();
  // Đổi màu số thứ tự cho Top 3
  const rankColor =
    item.rank === 1
      ? 'text-[#FFD700]' // Vàng
      : item.rank === 2
        ? 'text-[#C0C0C0]' // Bạc
        : item.rank === 3
          ? 'text-[#CD7F32]' // Đồng
          : 'text-foreground';

  // Hàm phụ trợ để lấy đúng frame theo rank (tránh viết if-else lồng nhau dài dòng ở dưới)
  const getFrameSource = (rank: number) => {
    if (rank === 1) return IMAGES.crownGold;
    if (rank === 2) return IMAGES.crownSilver;
    if (rank === 3) return IMAGES.crownBronze;
    return null; // Không có frame nếu rank > 3
  };

  const frameSource = getFrameSource(item.rank);
  const displayName =
    item?.displayName || item.user_profiles?.displayName || t('leaderboard.anonymous');
  const avatarUrl = item?.avatar_url || item.user_profiles?.avatar_url || IMAGES.treeAvatar;

  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center">
        <Text className={`w-8 text-lg font-bold ${rankColor}`}>{item.rank}</Text>

        {/* Container Avatar: Căn giữa tất cả các thành phần bên trong */}
        <View className="relative mr-3 h-12 w-12 items-center justify-center">
          {/* Nếu có khung vương miện (Top 1-3), render nó phủ full toàn bộ container */}
          {frameSource && (
            <Image
              source={{ uri: frameSource }}
              className="absolute inset-0 h-full w-full"
              resizeMode="contain"
            />
          )}

          {/* Ảnh Avatar bên trong */}
          {/* Nếu CÓ frame thì avatar nhỏ lại (h-8 w-8) để lọt vào giữa vòng tròn */}
          {/* Nếu KHÔNG frame (Rank 4+) thì to hơn chút (h-10 w-10) và tự thêm viền nhạt */}
          <Image
            source={{ uri: avatarUrl }}
            className={
              frameSource ? 'h-8 w-8 rounded-full' : 'h-10 w-10 rounded-full border border-primary '
            }
            resizeMode="contain"
          />
        </View>

        <Text className="text-base font-medium text-foreground">{displayName}</Text>
      </View>

      <Text className="text-base font-bold text-foreground">
        {item.weekly_points} <Text className="text-[#359B63]">GP</Text>
      </Text>
    </View>
  );
};

export default RankItem;

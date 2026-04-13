import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { useLeaderboard } from '@/hooks/queries/useGamification';
import { useClaimLeaderboardReward } from '@/hooks/mutations/useGamification';
import { LeaderboardEntry, LeaderboardScope } from '@/types/gamification.types';

// Import các component vừa tạo (nhớ trỏ đúng đường dẫn của bạn)
import Podium from './components/Podium';
import TabFilter from './components/TabFilter';
import TimeFilter from './components/TimeFilter';
import RankItem from './components/RankItem';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { RewardDetail } from './components/LeaderboardReward';

const LeaderboardScreen = () => {
  const [scope, setScope] = React.useState<LeaderboardScope>(LeaderboardScope.NATIONAL);
  const [showLeaderboardReward, setShowLeaderboardReward] = React.useState(false);

  const {
    data: leaderboardData = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLeaderboard(scope);
  const claimLeaderboardReward = useClaimLeaderboardReward();

  const sortedLeaderboard = React.useMemo(
    () => [...leaderboardData].sort((a, b) => a.rank - b.rank),
    [leaderboardData]
  );

  const topThree = React.useMemo(
    () => sortedLeaderboard.filter((item) => item.rank <= 3),
    [sortedLeaderboard]
  );

  const rankList = React.useMemo(
    () => sortedLeaderboard.filter((item) => item.rank >= 4),
    [sortedLeaderboard]
  );

  const rewardPeriodId = sortedLeaderboard[0]?.period_id ?? '';

  React.useEffect(() => {
    if (!showLeaderboardReward || !rewardPeriodId) return;
    if (claimLeaderboardReward.isPending || claimLeaderboardReward.data) return;
    claimLeaderboardReward.mutate(rewardPeriodId);
  }, [showLeaderboardReward, rewardPeriodId]);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      {/* Nửa trên với Background Image */}
      <ImageBackground
        source={{ uri: IMAGES.background_leaderboard }}
        className="h-3/6 overflow-hidden"
        resizeMode="cover">
        <View className="absolute inset-0 bg-black/50" />

        <View className="flex-1 px-4 pt-4">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-full bg-green-100"
                onPress={router.back}>
                <Image
                  source={{ uri: IMAGES.angleSmallLeft }}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-lg font-medium text-white">Bảng xếp hạng</Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-full bg-green-100"
                onPress={() => router.push('/(tabs)')}>
                <Image
                  source={{ uri: IMAGES.lightHome }}
                  className="h-4 w-4"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="h-8 w-8 items-center justify-center rounded-full bg-green-100"
                onPress={() => setShowLeaderboardReward((prev) => !prev)}>
                {showLeaderboardReward ? (
                  <Feather name="bar-chart-2" size={16} color="#166534" />
                ) : (
                  <Image source={{ uri: IMAGES.gift }} className="h-4 w-4" resizeMode="contain" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Các Component Lọc */}
          <TabFilter scope={scope} onChangeScope={setScope} />
          <TimeFilter />

          {/* Cụm Top 3 */}
          <Podium topThree={topThree} />
        </View>
      </ImageBackground>

      {/* Nửa dưới: Danh sách User */}
      <View className="-mt-24 flex-1 rounded-t-[32px] bg-white px-5 pt-6 shadow-lg">
        {showLeaderboardReward ? (
          <RewardDetail
            data={claimLeaderboardReward.data?.data}
            isClaiming={claimLeaderboardReward.isPending}
            onClaim={() => {
              if (!rewardPeriodId) {
                return;
              }
              claimLeaderboardReward.mutate(rewardPeriodId);
            }}
          />
        ) : (
          <>
            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="small" color="#359B63" />
              </View>
            ) : isError ? (
              <View className="flex-1 items-center justify-center gap-3">
                <Text className="text-sm text-gray-500">Không tải được bảng xếp hạng.</Text>
                <TouchableOpacity
                  onPress={() => refetch()}
                  className="rounded-full bg-[#359B63] px-4 py-2">
                  <Text className="font-semibold text-white">Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={rankList}
                keyExtractor={(item: LeaderboardEntry) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <RankItem item={item} />}
                ListHeaderComponent={
                  isFetching ? (
                    <View className="pb-2">
                      <ActivityIndicator size="small" color="#359B63" />
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  <View className="items-center justify-center py-10">
                    <Text className="text-sm text-gray-500">Chưa có dữ liệu xếp hạng.</Text>
                  </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

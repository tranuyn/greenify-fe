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
import { IMAGES } from '@/constants/linkMedia';
import { useLeaderboard } from '@/hooks/queries/useGamification';
import { LeaderboardEntry, LeaderboardScope } from '@/types/gamification.types';

// Import các component vừa tạo (nhớ trỏ đúng đường dẫn của bạn)
import Podium from './components/Podium';
import TabFilter from './components/TabFilter';
import TimeFilter from './components/TimeFilter';
import RankItem from './components/RankItem';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const LeaderboardScreen = () => {
  const [scope, setScope] = React.useState<LeaderboardScope>(LeaderboardScope.NATIONAL);

  const {
    data: leaderboardData = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLeaderboard(scope);

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

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      {/* Nửa trên với Background Image */}
      <ImageBackground
        source={{ uri: IMAGES.background_leaderboard }}
        // Bỏ px-4 pt-4 ở đây đi, thêm overflow-hidden để đảm bảo màng đen không tràn ra ngoài
        className="h-3/6 overflow-hidden"
        resizeMode="cover">
        {/* 1. LỚP MÀNG ĐEN CHỈ ĐÈ LÊN BACKGROUND */}
        <View className="absolute inset-0 bg-black/50" />
        {/* Thay đổi số 40 thành 50, 60, 70... nếu bạn muốn nó tối hơn nữa */}

        {/* 2. NỘI DUNG BÊN TRÊN (Đưa padding vào container này) */}
        <View className="flex-1 px-4 pt-4">
          {/* Header */}
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
              <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Image source={{ uri: IMAGES.gift }} className="h-4 w-4" resizeMode="contain" />
              </View>
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
      </View>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

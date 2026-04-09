import React from 'react';
import { View, Text, Image, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';

// Import các component vừa tạo (nhớ trỏ đúng đường dẫn của bạn)
import Podium from './components/Podium';
import TabFilter from './components/TabFilter';
import TimeFilter from './components/TimeFilter';
import RankItem from './components/RankItem';

import { SafeAreaView } from 'react-native-safe-area-context';

const dummyList = [
  { id: '1', rank: 1, name: 'User 1', points: 1000 },
  { id: '2', rank: 2, name: 'User 2', points: 950 },
  { id: '3', rank: 3, name: 'User 3', points: 750 },
  { id: '4', rank: 4, name: 'User 4', points: 650 },
  { id: '5', rank: 5, name: 'User 5', points: 550 },
  { id: '6', rank: 6, name: 'User 6', points: 450 },
];

const LeaderboardScreen = () => {
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
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Image
                source={{ uri: IMAGES.angleSmallLeft }}
                className="h-6 w-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Bảng xếp hạng</Text>
            <View className="flex-row gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Image
                  source={{ uri: IMAGES.lightHome }}
                  className="h-4 w-4"
                  resizeMode="contain"
                />
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Image source={{ uri: IMAGES.gift }} className="h-4 w-4" resizeMode="contain" />
              </View>
            </View>
          </View>

          {/* Các Component Lọc */}
          <TabFilter />
          <TimeFilter />

          {/* Cụm Top 3 */}
          <Podium />
        </View>
      </ImageBackground>

      {/* Nửa dưới: Danh sách User */}
      <View className="-mt-24 flex-1 rounded-t-[32px] bg-white px-5 pt-6 shadow-lg">
        <FlatList
          data={dummyList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RankItem item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

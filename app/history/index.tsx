import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
// Trong file chứa màn hình của bạn (ví dụ history.tsx)
import HistoryItem from './_components/HistoryItem';
import FilterModal from './_components/FilterModal';
import { router } from 'expo-router';

export default function WalletScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  return (
    <SafeAreaView className="flex-1 ">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <AntDesign name="left" size={20} color="#15803d" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Ví & Điểm</Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/')}
          className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <AntDesign name="home" size={20} color="#15803d" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Thẻ Điểm (PointsCard) */}
        <View className="mx-4 mt-4 rounded-2xl bg-primary p-5 shadow-sm">
          <Text className="text-right text-sm font-medium text-white/90">Điểm</Text>
          <Text className="mt-1 text-right text-4xl font-black text-white">20 GP</Text>
        </View>
        <Text className="mt-3 text-center text-xs text-muted-foreground">
          10GP sẽ hết hạn vào ngày 01/02/2026
        </Text>

        {/* Khung Tìm kiếm & Lọc */}
        <View className="mt-6 px-4">
          <Text className="mb-3 text-base font-bold text-foreground">Lịch sử điểm</Text>
          <View className="mb-2 flex-row items-center gap-x-2">
            <View className="flex-1 flex-row items-center rounded-full border border-primary px-4 py-2.5">
              <TextInput
                placeholder="Tìm kiếm"
                placeholderTextColor="#9ca3af"
                className="flex-1 p-0 text-[15px]"
              />
              <Feather name="search" size={20} color="#6b7280" />
            </View>

            {/* Nút Mở  Filter */}
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              className="h-11 w-11 items-center justify-center rounded-full border border-primary">
              <MaterialCommunityIcons name="filter-outline" size={22} color="#15803d" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danh sách Lịch sử */}
        <View className="px-4 pb-10">
          <HistoryItem
            title="SK: Chủ nhật"
            subtitle="Bạn nhận được điểm từ hoạt động"
            points={10}
            iconType="event"
          />
          <HistoryItem
            title="Bài xanh"
            subtitle="Điểm thưởng bài viết"
            points={10}
            iconType="article"
          />
          <HistoryItem
            title="Tuần lễ xanh"
            subtitle="Điểm thưởng tuần lễ xanh"
            points={10}
            iconType="calendar"
          />
          <HistoryItem
            title="Bài xanh"
            subtitle="Hoạt động của bạn bị trừ điểm"
            points={-10}
            iconType="article"
          />
        </View>
      </ScrollView>

      <FilterModal isVisible={filterVisible} onClose={() => setFilterVisible(false)} />
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import { usePointLedger } from 'hooks/queries/useWallet';
import { IMAGES } from 'constants/linkMedia';
import { PointLedgerEntry, PointSourceType } from 'types/action.types';
import HistoryItem from './_components/HistoryItem';
import FilterModal, { LedgerFilterValue } from './_components/FilterModal';
import { SOURCE_TYPE_LABELS } from '@/constants/sourceTypeLabel';
import { router } from 'expo-router';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const TIME_LABELS: Record<LedgerFilterValue['time'][number], string> = {
  week: 'Tuần',
  month: 'Tháng',
};

const isInSelectedTimeRange = (createdAt: string, selectedTime: LedgerFilterValue['time']) => {
  if (selectedTime.length === 0) {
    return true;
  }

  const entryDate = new Date(createdAt).getTime();
  if (Number.isNaN(entryDate)) {
    return false;
  }

  const diffDays = (Date.now() - entryDate) / DAY_IN_MS;
  return selectedTime.some((time) => {
    if (time === 'week') {
      return diffDays <= 7;
    }
    return diffDays <= 30;
  });
};

const getLedgerIconUrl = (entry: PointLedgerEntry) => {
  if (entry.source_type === PointSourceType.EVENT_ATTEND && entry.source_display_url) {
    return entry.source_display_url;
  }

  switch (entry.source_type) {
    case PointSourceType.GREEN_ACTION:
      return IMAGES.blog;
    case PointSourceType.LEADERBOARD:
      return IMAGES.crownSilver;
    case PointSourceType.LEADERBOARD_REWARD:
      return IMAGES.crownGold;
    case PointSourceType.VOUCHER_REDEEM:
      return IMAGES.voucher;
    case PointSourceType.REVIEW_REWARD:
    default:
      return IMAGES.gift;
  }
};

export default function WalletScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<LedgerFilterValue>({
    time: [],
    sourceTypes: [],
  });

  const { data: ledgerData, isLoading: isLedgerLoading } = usePointLedger({
    page: 1,
    page_size: 20,
    time: appliedFilters.time.length > 0 ? appliedFilters.time : undefined,
    source_type: appliedFilters.sourceTypes.length > 0 ? appliedFilters.sourceTypes : undefined,
  });

  const ledgerItems = (ledgerData?.items ?? []).filter((entry) => {
    const matchSourceType =
      appliedFilters.sourceTypes.length === 0 ||
      appliedFilters.sourceTypes.includes(entry.source_type);
    const matchTime = isInSelectedTimeRange(entry.created_at, appliedFilters.time);
    return matchSourceType && matchTime;
  });

  const handleApplyFilter = (value: LedgerFilterValue) => {
    setAppliedFilters(value);
  };

  const handleResetFilter = () => {
    setAppliedFilters({ time: [], sourceTypes: [] });
  };

  const appliedFilterLabels = [
    ...appliedFilters.time.map((item) => TIME_LABELS[item] ?? item),
    ...appliedFilters.sourceTypes.map((item) => SOURCE_TYPE_LABELS[item] ?? item),
  ];

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
        contentContainerStyle={{ flexGrow: 1 }}
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
          {appliedFilters.sourceTypes.length > 0 || appliedFilters.time.length > 0 ? (
            <View>
              <Text className="text-xs text-gray-500">
                Đang áp dụng {appliedFilters.time.length + appliedFilters.sourceTypes.length} bộ lọc
              </Text>
              <Text className="mt-1 text-xs text-gray-600">{appliedFilterLabels.join(' • ')}</Text>
            </View>
          ) : null}
        </View>

        {/* Danh sách Lịch sử */}
        <View className="flex-1 px-4 pb-10">
          {isLedgerLoading ? (
            <Text className="py-6 text-center text-sm text-gray-500">Đang tải lịch sử điểm...</Text>
          ) : ledgerItems.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Image
                source={{ uri: IMAGES.germination }}
                className="h-40 w-40"
                resizeMode="contain"
              />
              <Text className="mt-4 text-center text-sm text-gray-500">
                Không tìm thấy kết quả phù hợp
              </Text>
            </View>
          ) : (
            ledgerItems.map((entry) => (
              <HistoryItem
                key={entry.id}
                title={entry.source_name || 'Hoạt động không xác định'}
                subtitle={
                  entry.amount >= 0
                    ? 'Bạn nhận được điểm từ hoạt động'
                    : 'Hoạt động của bạn bị trừ điểm'
                }
                points={entry.amount}
                iconUrl={getLedgerIconUrl(entry)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FilterModal
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        value={appliedFilters}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </SafeAreaView>
  );
}

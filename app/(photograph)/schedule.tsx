import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePlantDailyLogs } from '@/hooks/queries/useGamification';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { IMAGES } from '@/constants/linkMedia';

interface DayData {
  id: string;
  imageUrl?: string;
  imageSourceType?: 'image_url' | 'green_post_url';
}

interface MonthData {
  id: string; // Định dạng "YYYY-MM"
  year: number;
  month: number;
  days: DayData[];
}

// --- PHẦN 2: HELPER FUNCTIONS ---

// Hàm tạo dữ liệu cho 1 tháng cụ thể
const generateMonth = (
  year: number,
  month: number,
  activeDayImageByDate: Record<string, { uri: string; sourceType: 'image_url' | 'green_post_url' }>
): MonthData => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const dayKey = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const imageData = activeDayImageByDate[dayKey];
    const imageUrl = imageData?.uri;

    days.push({
      id: `${year}-${month}-${i}`,
      imageUrl,
      imageSourceType: imageData?.sourceType,
    });
  }

  return {
    id: `${year}-${month}`,
    year,
    month,
    days,
  };
};

export default function ScheduleScreen() {
  const [monthCount, setMonthCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const { data: dailyLogs = [] } = usePlantDailyLogs();
  const { data: userProfile } = useCurrentUser();

  const activeDayImageByDate = useMemo(() => {
    return dailyLogs.reduce<
      Record<string, { uri: string; sourceType: 'image_url' | 'green_post_url' }>
    >((acc, log) => {
      if (!log?.is_active_day) return acc;

      const sourceType = log.image_url ? 'image_url' : log.green_post_url ? 'green_post_url' : null;
      const image = log.image_url || log.green_post_url;
      if (!image) return acc;
      if (!sourceType) return acc;

      const logDate = log.log_date instanceof Date ? log.log_date : new Date(log.log_date);
      if (Number.isNaN(logDate.getTime())) return acc;

      acc[logDate.toISOString().slice(0, 10)] = {
        uri: image,
        sourceType,
      };
      return acc;
    }, {});
  }, [dailyLogs]);

  const months = useMemo(() => {
    const generatedMonths: MonthData[] = [];
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    for (let i = 0; i < monthCount; i++) {
      generatedMonths.push(generateMonth(year, month, activeDayImageByDate));
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    return generatedMonths;
  }, [monthCount, activeDayImageByDate]);

  // Hàm tải thêm các tháng cũ hơn khi scroll
  const loadMoreMonths = useCallback(() => {
    if (loading) return;

    setLoading(true);

    // Giả lập delay mạng một chút
    setTimeout(() => {
      setMonthCount((prev) => prev + 1);
      setLoading(false);
    }, 500);
  }, [loading]);

  // Render từng ô ngày
  const renderDayItem = (day: DayData) => (
    <View key={day.id} className="mb-2 aspect-square w-[14.28%] items-center justify-center">
      {!day.imageUrl && <View className="h-4 w-4 rounded-full bg-gray-600/80" />}
      {day.imageUrl && (
        <Image
          source={{ uri: day.imageUrl }}
          className={`h-10 w-10 ${day.imageSourceType === 'green_post_url' ? 'rounded-xl border-2 border-green-500' : ''}`}
        />
      )}
    </View>
  );

  // Render từng khối tháng
  const renderMonthItem = ({ item }: { item: MonthData }) => (
    <View className="mx-4 mb-6 rounded-3xl bg-neutral-800 p-5">
      <Text className="mb-4 text-lg font-bold text-[var(--primary)]">
        {item.month < 10 ? `0${item.month}` : item.month}/{item.year}
      </Text>
      <View className="flex-row flex-wrap items-center">{item.days.map(renderDayItem)}</View>
    </View>
  );

  return (
    <View className="flex-1 bg-neutral-900">
      {/* --- CỤM 1: TOP BAR --- */}
      <BlurView
        pointerEvents="box-none"
        intensity={100} // Độ mờ (từ 1 đến 100)
        tint="dark" // Màu nền (light, dark, hoặc default)
        className="absolute left-0 right-0 top-0 z-50">
        <View className="flex-row items-center justify-between  px-6 pb-6 pt-16">
          <TouchableOpacity className="rounded-full bg-white/10 p-3">
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>

          <View className="aspect-square w-14 overflow-hidden rounded-[40px] border border-neutral-500">
            <Image
              source={{
                uri: userProfile?.profile?.avatar_url || IMAGES.treeAvatar,
              }}
              className="flex-1"
            />
          </View>

          <TouchableOpacity className="rounded-2xl bg-white/10 p-3 shadow-sm">
            <Feather name="download" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </BlurView>

      <FlatList
        contentContainerStyle={{ paddingTop: 100 }}
        data={months}
        keyExtractor={(item) => item.id}
        renderItem={renderMonthItem}
        onEndReached={loadMoreMonths}
        onEndReachedThreshold={0.5}
        inverted
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#22c55e" className="my-4" /> : null
        }
      />
    </View>
  );
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';

import { usePlantDailyLogs } from '@/hooks/queries/useGamification';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { IMAGES } from '@/constants/linkMedia';
import TopBar from './components/TopBar';

type DayImageMap = Record<
  string,
  {
    uri: string;
    isChangeState: boolean;
  }
>;

interface DayData {
  id: string;
  imageUrl?: string;
  isChangeState?: boolean;
}

interface MonthData {
  id: string;
  year: number;
  month: number;
  days: DayData[];
}

const padZero = (num: number): string => String(num).padStart(2, '0');

const generateMonth = (
  year: number,
  month: number,
  activeDayImageByDate: DayImageMap
): MonthData => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const dayKey = `${year}-${padZero(month)}-${padZero(i)}`;
    const imageData = activeDayImageByDate[dayKey];

    days.push({
      id: dayKey,
      imageUrl: imageData?.uri,
      isChangeState: imageData?.isChangeState,
    });
  }

  return {
    id: `${year}-${padZero(month)}`,
    year,
    month,
    days,
  };
};

export default function ScheduleScreen() {
  const { data: dailyLogs = [] } = usePlantDailyLogs();
  console.log('Daily Logs:', dailyLogs);
  const { data: userProfile } = useCurrentUser();

  const [monthCount, setMonthCount] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);

  const activeDayImageByDate = useMemo(() => {
    return dailyLogs.reduce<DayImageMap>((acc, log) => {
      if (!log?.is_active_day) return acc;

      const logDate = log.logDate instanceof Date ? log.logDate : new Date(log.logDate);
      if (Number.isNaN(logDate.getTime())) return acc;

      const dateKey = logDate.toISOString().slice(0, 10);
      const sourceImage = log.isChangeState ? log.imageUrl : log.greenPostUrl;

      if (sourceImage) {
        acc[dateKey] = {
          uri: sourceImage,
          isChangeState: Boolean(log.isChangeState),
        };
      }

      return acc;
    }, {});
  }, [dailyLogs]);

  // Tạo mảng dữ liệu các tháng
  const months = useMemo(() => {
    const generatedMonths: MonthData[] = [];
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1;

    for (let i = 0; i < monthCount; i++) {
      generatedMonths.push(generateMonth(currentYear, currentMonth, activeDayImageByDate));

      currentMonth -= 1;
      if (currentMonth === 0) {
        currentMonth = 12;
        currentYear -= 1;
      }
    }

    return generatedMonths;
  }, [monthCount, activeDayImageByDate]);

  // Pagination (Tải thêm tháng cũ)
  const loadMoreMonths = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      setMonthCount((prev) => prev + 1);
      setLoading(false);
    }, 500);
  }, [loading]);

  // Render từng ô ngày
  const renderDayItem = (day: DayData) => (
    <View key={day.id} className="mb-2 aspect-square w-[14.28%] items-center justify-center">
      {!day.imageUrl ? (
        <View className="h-4 w-4 rounded-full bg-gray-600/80" />
      ) : (
        <Image
          source={{ uri: day.imageUrl }}
          className={`h-10 w-10 ${
            !day.isChangeState ? 'rounded-xl border-2 border-green-500' : ''
          }`}
        />
      )}
    </View>
  );

  // Render từng khối tháng
  const renderMonthItem = ({ item }: { item: MonthData }) => (
    <View className="mx-4 mb-6 rounded-3xl bg-neutral-800 p-5">
      <Text className="mb-4 font-inter-bold text-lg text-[var(--primary)]">
        {padZero(item.month)}/{item.year}
      </Text>
      <View className="flex-row flex-wrap items-center">{item.days.map(renderDayItem)}</View>
    </View>
  );

  return (
    <View className="flex-1 bg-neutral-900">
      {/* --- CỤM 1: TOP BAR --- */}
      <BlurView
        pointerEvents="box-none"
        intensity={100}
        tint="dark"
        className="absolute left-0 right-0 top-0 z-50">
        <View className=" px-6 pb-6 pt-16">
          <TopBar />
        </View>
      </BlurView>

      {/* --- CỤM 2: FLATLIST MONTHS --- */}
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

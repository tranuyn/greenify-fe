import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- PHẦN 1: TYPES & MOCK ICONS ---
type DayStatus = 'empty' | 'normal' | 'seed' | 'sprout' | 'tree' | 'fruit';

interface DayData {
  id: string;
  status: DayStatus;
  imageUrl?: any;
}

interface MonthData {
  id: string; // Định dạng "YYYY-MM"
  year: number;
  month: number;
  days: DayData[];
}

const SeedIcon = () => <Text className="text-xl">🌰</Text>;
const SproutIcon = () => <Text className="text-xl">🌱</Text>;
const TreeIcon = () => <Text className="text-xl">🌳</Text>;
const FruitIcon = () => <Text className="text-xl">🍎</Text>;
const DUMMY_IMAGE = { uri: 'https://picsum.photos/100' };

// --- PHẦN 2: HELPER FUNCTIONS ---

// Hàm tạo dữ liệu cho 1 tháng cụ thể
const generateMonth = (year: number, month: number): MonthData => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    // Logic giả lập status để demo giống ảnh của bạn
    let status: DayStatus = 'empty';
    if (i % 3 === 0) status = 'normal';
    if (i === 5) status = 'seed';
    if (i === 12) status = 'sprout';
    if (i === 19) status = 'tree';

    days.push({
      id: `${year}-${month}-${i}`,
      status: status,
      imageUrl: status === 'normal' ? DUMMY_IMAGE : undefined,
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
  const [months, setMonths] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(false);

  // Khởi tạo: Lấy tháng hiện tại (T4/2026) và tháng trước đó (T3/2026)
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() trả về 0-11

    const initialMonths = [
      generateMonth(currentYear, currentMonth),
      generateMonth(currentYear, currentMonth - 1),
    ];
    setMonths(initialMonths);
  }, []);

  // Hàm tải thêm các tháng cũ hơn khi scroll
  // Hàm tải thêm các tháng cũ hơn khi scroll
  const loadMoreMonths = useCallback(() => {
    // THÊM ĐIỀU KIỆN: Nếu đang loading HOẶC mảng months chưa có dữ liệu thì return luôn
    if (loading || months.length === 0) return;

    setLoading(true);

    const lastMonth = months[months.length - 1];
    let nextMonthToLoad = lastMonth.month - 1;
    let nextYearToLoad = lastMonth.year;

    if (nextMonthToLoad === 0) {
      nextMonthToLoad = 12;
      nextYearToLoad -= 1;
    }

    // Giả lập delay mạng một chút
    setTimeout(() => {
      const newMonth = generateMonth(nextYearToLoad, nextMonthToLoad);
      setMonths((prev) => [...prev, newMonth]);
      setLoading(false);
    }, 500);
  }, [months, loading]);

  // Render từng ô ngày
  const renderDayItem = (day: DayData) => (
    <View key={day.id} className="mb-2 aspect-square w-[14.28%] items-center justify-center">
      {day.status === 'empty' && <View className="h-4 w-4 rounded-full bg-gray-600/80" />}
      {day.status === 'normal' && (
        <Image source={day.imageUrl} className="h-10 w-10 rounded-xl border-2 border-green-500" />
      )}
      {day.status === 'seed' && <SeedIcon />}
      {day.status === 'sprout' && <SproutIcon />}
      {day.status === 'tree' && <TreeIcon />}
      {day.status === 'fruit' && <FruitIcon />}
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
    <View className="flex-1 justify-between pt-10">
      {/* --- CỤM 1: TOP BAR --- */}
      <BlurView
        intensity={50} // Độ mờ (từ 1 đến 100)
        tint="dark" // Màu nền (light, dark, hoặc default)
        className="absolute left-0 right-0 top-0 z-50">
        <View className="flex-row items-center justify-between  px-6 pb-6 pt-16">
          <TouchableOpacity className="rounded-full bg-white/10 p-3">
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>

          <View className="aspect-square w-14 overflow-hidden rounded-[40px] border border-neutral-500">
            <Image
              source={{
                uri: '',
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

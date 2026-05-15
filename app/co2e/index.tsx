import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { useMyCo2e, useMyCo2eHistory } from 'hooks/queries/useWallet';
import { Co2eType } from '@/types/action.types';
import { useNavigation, useRouter } from 'expo-router';

// Component Biểu đồ tròn sử dụng react-native-svg
const DonutChart = ({ percentage = 75, size = 130, strokeWidth = 12, co2eValue = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Vòng nền (Track) */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#15803d" // primary-700
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Vòng tiến trình (Progress) */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#22c55e" // primary-500
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {/* Text ở giữa biểu đồ */}
      <View className="absolute items-center justify-center">
        <Text className="font-inter-bold text-lg text-primary-600">CO2e</Text>
        <Text className="font-inter-semibold text-sm text-primary-600">
          {co2eValue.toFixed(1)} kg
        </Text>
      </View>
    </View>
  );
};

export default function CO2WalletScreen() {
  const { data: co2eSummary, isLoading: isCo2eLoading } = useMyCo2e();
  const { data: co2eHistoryData, isLoading: isHistoryLoading } = useMyCo2eHistory();

  const totalAvoidedKg = co2eSummary?.totalAvoidedKg ?? 0;
  const totalAbsorbedKg = co2eSummary?.totalAbsorbedKg ?? 0;
  const totalCo2e = totalAvoidedKg + totalAbsorbedKg;
  const co2ePercentage = totalCo2e > 0 ? (totalAvoidedKg / totalCo2e) * 100 : 0;

  const transformedHistory =
    co2eHistoryData?.content?.map((item) => ({
      ...item,
      title: item.materialLabel || 'Hoạt động xanh',
      message: `"${item.post?.caption || 'Cảm ơn bạn đã góp phần vì môi trường.'}"`.slice(0, 60),
      time: new Date(item.creditedAt).toLocaleDateString('vi-VN'),
      amount: `+ ${item.co2eKg.toFixed(2)}`,
      iconColor: item.co2eType === 'AVOIDED' ? '#22c55e' : '#15803d',
    })) || [];

  const navigation = useNavigation<any>();
  const router = useRouter();

  console.log('CO2e Summary:', co2eSummary);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-sm dark:bg-gray-700"
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#22c55e" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-xl text-foreground">Ví CO2</Text>
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-sm dark:bg-gray-700"
          onPress={() => router.replace('/(tabs)/')}>
          <Ionicons name="home-outline" size={20} color="#22c55e" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section 1: Overview with SVG Chart */}
        <View className="flex-row items-center px-5 py-8">
          <DonutChart percentage={co2ePercentage} co2eValue={totalAvoidedKg} />

          <View className="ml-6 flex-1">
            {/* Giảm rác thải nhựa */}
            <View className="mb-5">
              <View className="mb-2 flex-row items-end justify-between">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="recycle" size={18} color="#22c55e" />
                  <Text className="ml-1.5 font-inter-medium text-xs text-foreground">
                    Giảm rác thải nhựa
                  </Text>
                </View>
                <Text className="font-inter-bold text-xs text-foreground">
                  {(co2eSummary?.totalAvoidedKg ?? 0).toFixed(1)}
                  <Text className="text-primary-600">kg</Text>
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-primary-500" />
            </View>

            {/* Hấp thụ từ cây */}
            <View>
              <View className="mb-2 flex-row items-end justify-between">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="tree" size={18} color="#15803d" />
                  <Text className="ml-1.5 font-inter-medium text-xs text-foreground">
                    Hấp thụ từ cây
                  </Text>
                </View>
                <Text className="font-inter-bold text-xs text-foreground">
                  {(co2eSummary?.totalAbsorbedKg ?? 0).toFixed(1)}
                  <Text className="text-primary-700">kg</Text>
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-primary-700" />
            </View>
          </View>
        </View>

        {/* Section 2: Summary Box */}
        <View className="bg-primary-50 px-5 py-5 dark:bg-gray-800">
          <Text className="mb-4 font-inter-semibold text-sm text-foreground">
            Tổng kết hoạt động
          </Text>
          <View className="border-border/30 rounded-2xl bg-background  p-5 shadow-sm">
            <View className="mb-2 flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                <MaterialCommunityIcons name="recycle" size={20} color="#22c55e" />
              </View>
              <Text className="ml-3 font-inter-medium text-sm text-foreground">
                {co2eSummary?.totalGreenPost ?? 0} bài Xanh
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                <MaterialCommunityIcons name="tree" size={20} color="#15803d" />
              </View>
              <Text className="ml-3 font-inter-medium text-sm text-foreground">
                {co2eSummary?.totalPlant ?? 0} cây đã được trồng
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: History */}
        <View className="mb-8 px-5 py-6">
          <Text className="mb-5 font-inter-semibold text-base text-foreground">
            Lịch sử hoạt động
          </Text>

          {transformedHistory?.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              className={`flex-row items-start py-4 ${index !== transformedHistory.length - 1 ? 'border-border/30 border-b' : ''}`}>
              <View className="mr-4 pt-1">
                <MaterialCommunityIcons
                  name={item.co2eType === 'AVOIDED' ? 'recycle-variant' : 'tree-outline'}
                  size={36}
                  color={item.iconColor}
                />
              </View>

              <View className="flex-1 pr-2">
                <Text className="font-inter-semibold text-[14px] text-foreground">
                  {item.title}
                </Text>
                <Text className="mt-1 font-inter text-[12px] italic leading-4 text-muted-foreground">
                  {item.message}
                </Text>
                <Text className="mt-2 font-inter text-[11px] text-muted-foreground opacity-60">
                  {item.time}
                </Text>
              </View>

              <View className="items-end">
                <Text className="font-inter-bold text-sm text-primary-800">{item.amount}</Text>
                <Text className="font-inter-medium text-[10px] text-primary-600">kg CO2e</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

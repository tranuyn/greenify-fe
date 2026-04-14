import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { VoucherTemplate } from '@/types/gamification.types';
import { IMAGES } from '@/constants/linkMedia';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

interface RewardDetailProps {
  data?: VoucherTemplate;
  onClaim: () => void;
  isClaiming: boolean;
}

export default function RewardDetail({ data, onClaim, isClaiming }: RewardDetailProps) {
  const rewardData = data;
  const colors = useThemeColor();
  if (!rewardData) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <Image source={{ uri: IMAGES.germination }} className="h-32 w-32" />
        <Text className="font-inter-medium text-base text-foreground">
          Không tìm thấy thông tin giải thưởng
        </Text>
      </View>
    );
  }

  // Format ngày tháng từ chuỗi ISO sang định dạng dd/mm/yyyy
  const formattedDate = new Date(rewardData.valid_until).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Tách chuỗi điều kiện thành mảng và loại bỏ dấu "-" ở đầu nếu có
  const conditions = rewardData.usage_conditions
    .split('\n')
    .map((cond) => cond.trim().replace(/^- /, ''));

  return (
    <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header Titles */}
      <View className="mb-4 items-center">
        <Text className="mb-1 font-inter-bold text-2xl text-primary">Thông tin giải thưởng</Text>
        <Text className="font-inter-medium text-base text-foreground">
          Giải thưởng dành cho Top 5
        </Text>
      </View>

      {/* Main Card */}
      <View className="rounded-lg border border-green-600 p-3">
        {/* Banner Image */}
        <Image
          source={{ uri: rewardData.thumbnail_url ?? '' }}
          className="mb-4 h-44 w-full rounded-md"
          resizeMode="cover"
        />

        {/* Reward Title */}
        <Text className="mb-4 font-inter-medium text-xl text-foreground">{rewardData.name}</Text>

        {/* Provider Section */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-base text-foreground">Nhà cung cấp</Text>
          <View className="flex-row items-center">
            <View className="mr-2 h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-green-600 p-0.5">
              <Image
                source={{ uri: rewardData.partner_logo_url ?? '' }}
                className="h-full w-full rounded-full bg-white"
                resizeMode="contain"
              />
            </View>
            <Text className="font-inter-medium text-foreground">{rewardData.partner_name}</Text>
          </View>
        </View>

        {/* Validity Section */}
        <View className="mb-4">
          <Text className="mb-2 font-inter-bold text-base text-foreground">Hạn sử dụng</Text>
          <Text className="font-inter-regular mb-2 text-foreground">
            Có hiệu lực trong 7 ngày kể từ ngày nhận
          </Text>
          <View className="flex-row items-center">
            <Feather name="clock" size={16} color={colors.foreground} className="mr-2" />
            <Text className="font-inter-regular ml-1 text-foreground">
              Hết hạn sau: {formattedDate}
            </Text>
          </View>
        </View>

        {/* Terms & Conditions Section */}
        <View>
          <Text className="mb-2 font-inter-bold text-base text-foreground">
            Điều khoản và điều kiện
          </Text>
          <View className="flex-col gap-1.5 pl-1">
            {conditions.map((item, index) => (
              <View key={index} className="flex-row items-start">
                {/* Dấu chấm tròn (Bullet point) */}
                <Text className="mr-2 text-lg leading-5 text-foreground">•</Text>
                {/* Nội dung text: dùng flex-1 để tự động xuống dòng khi dài */}
                <Text className="font-inter-regular flex-1 leading-5 text-foreground">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          disabled={isClaiming}
          onPress={onClaim}
          className="mt-5 items-center rounded-full bg-[#359B63] py-3 disabled:opacity-50">
          {isClaiming ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="font-semibold text-white">Nhận thưởng ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

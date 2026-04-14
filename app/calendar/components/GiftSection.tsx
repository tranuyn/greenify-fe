import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

const GiftSection = () => {
  const colors = useThemeColor();

  return (
    <View className="mb-6 px-4">
      <ImageBackground
        source={{
          uri: IMAGES.calendar,
        }}
        className="items-center justify-center overflow-hidden rounded-2xl p-6">
        <View className="absolute inset-0 bg-black/20" />
        <Text className="mb-1 font-inter-bold text-lg text-[var(--on-primary)]">
          Quà tặng của bạn
        </Text>
        <Text className="mb-4 font-inter-medium text-sm text-[var(--on-primary)]">
          Số lượng quà: 10
        </Text>
        <View className="w-full flex-row items-center justify-between">
          <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]">
            <Feather name="chevron-left" size={20} color={colors.onPrimary} />
          </TouchableOpacity>

          <Image source={{ uri: IMAGES.giftColor }} className="h-20 w-20" />

          <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]">
            <Feather name="chevron-right" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default GiftSection;

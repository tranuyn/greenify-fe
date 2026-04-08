import React from 'react';
import { View, Text, Image } from 'react-native';

interface HistoryItemProps {
  title: string;
  subtitle: string;
  points: number;
  iconType: 'calendar' | 'article' | 'event';
}

const HistoryItem = ({ title, subtitle, points, iconType }: HistoryItemProps) => {
  const isPositive = points > 0;

  // Hàm render hình ảnh dựa trên iconType
  const renderIcon = () => {
    let imageSrc;

    // Chọn đúng nguồn ảnh dựa trên iconType bạn đã gửi
    switch (iconType) {
      case 'article':
        imageSrc = require('../../../assets/blog.png');
        break;
      case 'calendar':
        imageSrc = require('../../../assets/green-calender.png');
        break;
      case 'event':
        imageSrc = require('../../../assets/avatar.png');
        break;
      default:
        imageSrc = require('../../../assets/blog.png');
    }

    return (
      <View className="h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
        <Image source={imageSrc} className="h-8 w-8" resizeMode="contain" />
      </View>
    );
  };

  return (
    <View className="flex-row items-center border-b border-gray-100 py-4">
      {renderIcon()}

      <View className="ml-3 flex-1">
        <Text className="mb-0.5 text-base font-bold text-foreground">{title}</Text>
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View className="items-end">
        <Text className={`text-lg font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}
          {points} GP
        </Text>
      </View>
    </View>
  );
};

export default HistoryItem;

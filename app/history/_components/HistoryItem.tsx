import React from 'react';
import { View, Text, Image } from 'react-native';

interface HistoryItemProps {
  title: string;
  subtitle: string;
  points: number;
  iconType?: 'calendar' | 'article' | 'event';
  iconUrl?: string;
}

const HistoryItem = ({ title, subtitle, points, iconUrl }: HistoryItemProps) => {
  const isPositive = points > 0;

  return (
    <View className="flex-row items-center border-b border-muted-foreground py-4">
      {iconUrl ? (
        <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl ">
          <Image source={{ uri: iconUrl }} className="h-full w-full" resizeMode="cover" />
        </View>
      ) : null}

      <View className="ml-3 flex-1">
        <Text className="mb-0.5 text-base font-medium text-foreground">{title}</Text>
        <Text className="text-sm text-muted-foreground" numberOfLines={1}>
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

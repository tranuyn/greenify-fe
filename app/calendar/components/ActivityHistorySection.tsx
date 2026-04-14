import React from 'react';
import { View, Text } from 'react-native';
import HistoryItem from './HistoryItem';

const ActivityHistorySection = () => {
  return (
    <View className="px-4 pb-24">
      <Text className="mb-3 font-inter-bold text-[var(--foreground)]">Lịch sử hoạt động</Text>
      <HistoryItem
        title="Bài xanh"
        description="Bạn đã đăng một bài Xanh"
        status="pending"
        imageUrl="https://via.placeholder.com/50"
      />
      <HistoryItem
        title="Bài xanh"
        description="Bạn đã đăng một bài Xanh"
        status="approved"
        imageUrl="https://via.placeholder.com/50"
      />
    </View>
  );
};

export default ActivityHistorySection;

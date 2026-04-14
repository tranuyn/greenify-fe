import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import icon
import { Card } from '@/components/ui/Card';
import { IMAGES } from '@/constants/linkMedia';

const ProgressSection = () => {
  return (
    <View className="mt-[-110px] px-4">
      <Card className="flex-row items-center rounded-3xl">
        {/* Avatar/Icon đã được gắn Vector Icon */}
        <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--primary-light)]">
          <Image source={{ uri: IMAGES.treeAvatar }} className="h-10 w-10 rounded-full" />
        </View>

        {/* Info */}
        <View className="ml-4 flex-1">
          <View className="mb-3 flex-row">
            <Text className="font-inter text-[var(--foreground)]">Giai đoạn: </Text>
            <Text className="font-inter text-[var(--foreground)]">Hạt giống</Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
            <View className="h-full w-1/4 rounded-full bg-[var(--primary)]" />
          </View>

          <Text className="font-inter text-[var(--foreground)]">Chuỗi Xanh: 3</Text>
        </View>
      </Card>

      {/* Warning Banner */}
      <View className="mt-10 items-center rounded-lg bg-[var(--danger-bg)] p-2">
        <Text className="font-inter text-sm text-foreground">
          Hôm nay bạn vẫn chưa thực hiện hành động xanh
        </Text>
      </View>
    </View>
  );
};

export default ProgressSection;

import React from 'react';
import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';

const Podium = () => {
  return (
    <View className="mb-4 mt-6 flex-row items-end justify-center space-x-4">
      {/* Top 3 - Hạng 3 */}
      {/* Giả định IMAGES.crownBronze cũng là một frame tương tự */}
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownBronze }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa */}
          <Image
            source={{ uri: IMAGES.treeAvatar }}
            className="h-10 w-10 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-sm font-medium text-white">User 3</Text>
      </View>

      {/* Top 1 - Hạng 1 (To nhất) */}
      <View className="-mt-8 items-center">
        <View className="relative h-24 w-24 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownGold }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa (kích thước lớn hơn) */}
          <Image
            source={{ uri: IMAGES.treeAvatar }}
            className="h-14 w-14 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-base font-bold text-white">User 1</Text>
      </View>

      {/* Top 2 - Hạng 2 */}
      {/* Giả định IMAGES.crownSilver cũng là một frame tương tự */}
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {/* Frame vòng tròn + vương miện (ảnh 3 của bạn) */}
          <Image
            source={{ uri: IMAGES.crownSilver }}
            className="absolute inset-0 h-full w-full"
            resizeMode="contain"
          />
          {/* Ảnh cái cây nằm ở giữa */}
          <Image
            source={{ uri: IMAGES.treeAvatar }}
            className="h-10 w-10 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-sm font-medium text-white">User 2</Text>
      </View>
    </View>
  );
};

export default Podium;

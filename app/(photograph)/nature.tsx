import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGardenArchives } from '@/hooks/queries/useGamification';
import TopBar from './components/TopBar';

const { width } = Dimensions.get('window');

export default function NatureScreen() {
  const totalItems = 60;
  const { data: archives = [] } = useGardenArchives();
  const collectedItems = archives.slice(0, totalItems);

  return (
    // Màu nền xanh cực nhạt theo ảnh
    <SafeAreaView className="flex-1 justify-between bg-neutral-900  pt-6">
      {/* --- CỤM 1: TOP BAR --- */}
      <TopBar
        streakCount={20}
        hasCheckedInToday={true}
        onGridPress={() => console.log('Mở grid')}
      />

      {/* 2. CỤM BỘ SƯU TẬP (Main Content) */}
      {/* Cụm này sẽ được bao bọc bởi một View có flex-1 để chiếm không gian ở giữa */}
      <View className="mx-6 mt-8 flex-1 rounded-[40px] border border-white/20 bg-neutral-800  p-6  shadow-sm">
        <Text className="mb-6 text-xl font-semibold text-[var(--primary)]">Bộ sưu tập</Text>

        {/* Container cho Grid 7x10 */}
        <View className="flex-row flex-wrap justify-between ">
          {[...Array(totalItems)].map((_, index) => {
            const archive = collectedItems[index];
            const imageUrl = archive?.seed?.stage4_image_url || archive?.display_image_url;

            return (
              <View
                key={index}
                style={{ width: (width - 80) / 7 }}
                className="mb-4 aspect-square items-center justify-center">
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} className="h-8 w-8" resizeMode="contain" />
                ) : (
                  // Các dấu chấm xám cho ô trống
                  <View className="h-4 w-4 rounded-full bg-gray-600/80" />
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ height: 120 }} />
    </SafeAreaView>
  );
}

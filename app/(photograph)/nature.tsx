import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TopBar from './components/TopBar';

const { width } = Dimensions.get('window');

export default function NatureScreen() {
  // Tạo mảng 70 phần tử cho grid 7x10
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(true);
  const totalItems = 70;
  // Todo: Thay thế bằng dữ liệu thực tế về các vật phẩm đã thu thập được, hiện tại chỉ là ví dụ với 3 vật phẩm đầu tiên
  const collectedItems = [
    { icon: 'tree', color: '#4ade80' }, // Cây
    { icon: 'rose', color: '#f87171', type: 'entypo' }, // Hoa hồng
    { icon: 'sunflower', color: '#fbbf24', type: 'material' }, // Hoa hướng dương
  ];

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
            return (
              <View
                key={index}
                style={{ width: (width - 100) / 7 }}
                className="mb-4 aspect-square items-center justify-center">
                {index === 0 ? (
                  <Text style={{ fontSize: 24 }}>🌳</Text>
                ) : index === 1 ? (
                  <Text style={{ fontSize: 24 }}>🌹</Text>
                ) : index === 2 ? (
                  <Text style={{ fontSize: 24 }}>🌻</Text>
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

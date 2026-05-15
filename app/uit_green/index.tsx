import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { useNavigation } from '@react-navigation/native';
import { GardenBuilding } from '@/types/gamification.types';

// Cấu hình các mảnh ghép (khu vực)
// Mẹo: Tinh chỉnh các thông số top, left, width để các ảnh khớp vào nhau như ý muốn
const MAP_PIECES = [
  {
    id: 'nha-xe-a',
    name: 'Nhà xe A',
    image: IMAGES.nha_xe_1,
    gridDetail: IMAGES.nha_xe_1_grid, // Đổi thành file thật của bạn
    building: GardenBuilding.GARAGE_A,
    style: {
      left: '10%',
      width: '30%',
      height: '20%',
    },
  },
  {
    id: 'khu-a',
    name: 'Khu A',
    image: IMAGES.toa_a,
    building: GardenBuilding.BUILDING_A,
    gridDetail: IMAGES.a_grid,
    style: { top: '5%', left: '10%', width: '65%', height: '60%' },
  },
  {
    id: 'nha-xe-b',
    name: 'Nhà xe B',
    image: IMAGES.nha_xe_2,
    building: GardenBuilding.GARAGE_B,
    gridDetail: IMAGES.nha_xe_2_grid,
    style: { left: '65%', width: '25%', height: '25%' },
  },
  {
    id: 'cantin-a',
    name: 'Căn tin A',
    image: IMAGES.nha_an_a,
    gridDetail: IMAGES.nha_an_1_grid,
    building: GardenBuilding.CAFETERIA_A,
    style: { top: '28%', left: '75%', width: '22%', height: '20%' },
  },
  {
    id: 'khu-b',
    name: 'Khu B',
    image: IMAGES.toa_b,
    building: GardenBuilding.BUILDING_B,
    gridDetail: IMAGES.b_grid,
    style: { top: '52%', left: '55%', width: '40%', height: '30%' },
  },
  {
    id: 'khu-e',
    name: 'Khu E',
    image: IMAGES.toa_e,
    building: GardenBuilding.BUILDING_E,
    gridDetail: IMAGES.e_grid,
    style: { top: '55%', left: '5%', width: '35%', height: '20%' },
  },
  {
    id: 'khu-c',
    name: 'Khu C',
    image: IMAGES.toa_c,
    building: GardenBuilding.BUILDING_C,
    gridDetail: IMAGES.c_grid,
    style: { top: '75%', left: '10%', width: '50%', height: '20%' },
  },
  {
    id: 'cantin-b',
    name: 'Căn tin B',
    image: IMAGES.nha_an_b,
    building: GardenBuilding.CAFETERIA_B,
    gridDetail: IMAGES.nha_an_2_grid,
    style: { top: '72%', left: '72%', width: '20%', height: '20%' },
  },
];

export default function MapAssemblyScreen() {
  const navigation = useNavigation<any>();

  const handleSelectArea = (area: any) => {
    navigation.navigate('AreaDetail', { areaData: area });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="mx-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center"
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-xl text-foreground">Chọn khu vực trồng cây</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 items-center justify-center bg-background">
        {/* KHUNG BẢN ĐỒ (Container) */}
        {/* aspect-[3/4] giúp khung luôn giữ tỷ lệ hình chữ nhật đứng, không bị móp méo trên các máy khác nhau */}
        <View className=" relative  aspect-[3/4] w-full rounded-2xl  shadow-sm">
          {/* Lặp qua danh sách để rải các mảnh ghép lên khung */}
          {MAP_PIECES.map((piece) => (
            <TouchableOpacity
              key={piece.id}
              activeOpacity={0.5}
              onPress={() => handleSelectArea(piece)}
              style={[styles.absolutePiece, piece.style as any]}>
              <Image
                source={{ uri: piece.image }}
                className="h-full w-full"
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain" // Đảm bảo ảnh không bị cắt xén
              />

              {/* Optional: Nếu bạn muốn hiển thị chữ đè lên ảnh (như chữ 'A', 'E' trong hình mẫu) */}
              {/* <View className="absolute inset-0 items-center justify-center pointer-events-none">
                <Text className="font-inter-bold text-black text-lg">{piece.name.split(' ').pop()}</Text>
              </View> */}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mx-10 mt-10 text-center font-inter-medium text-foreground">
          Chạm vào một khu vực để phóng to và xem các vị trí có thể trồng cây.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  absolutePiece: {
    position: 'absolute',
    //backgroundColor: 'rgba(255,0,0,0.1)', // MỞ COMMENT DÒNG NÀY ĐỂ DEBUG: Sẽ hiện viền đỏ bao quanh ảnh để bạn dễ căn chỉnh top/left
  },
});

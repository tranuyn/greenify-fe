import { IMAGES } from '@/constants/linkMedia';
import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { useUITBannerCo2e } from '@/hooks/queries/useWallet';

const BannerUIT: React.FC = ({}) => {
  const { totalCo2eKg, isLoading } = useUITBannerCo2e();

  return (
    // Container bọc ngoài cùng với bo góc và viền
    <View className="mx-6 mt-4 overflow-hidden rounded-2xl border border-gray-300 shadow-sm">
      <ImageBackground
        source={{ uri: IMAGES.UIT_Background }}
        className="w-full"
        resizeMode="cover">
        {/* Lớp phủ (Overlay) màu trắng trong suốt để làm nổi bật chữ trên nền ảnh */}
        <View className="w-full flex-col items-center justify-center bg-white/85 p-6 py-8">
          {/* Header chứa 2 Logo */}
          <View className="mb-6 flex-row items-center justify-center ">
            <Image
              source={{ uri: IMAGES.logo_greenify }}
              className="h-10 w-10"
              resizeMode="contain"
            />
            <Image
              source={{ uri: IMAGES.UIT20 }}
              className="h-12 w-32" // Logo UIT có bề ngang dài hơn
              resizeMode="contain"
            />
          </View>

          {/* Tiêu đề chính */}
          <Text className="mb-5 px-2 text-center text-[14px] font-extrabold leading-6 text-gray-900">
            NHIỆT LIỆT CHÀO MỪNG KỶ NIỆM 20 NĂM THÀNH LẬP TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN,
            ĐHQG-HCM (08/6/2006 - 08/6/2026)
          </Text>

          {/* Thông tin phụ và chỉ số */}
          <View className="flex-col items-center">
            <Text className="mb-1 text-center text-base font-semibold text-gray-800">
              Cộng đồng UIT đã cùng Greenify tạo ra
            </Text>
            <Text className="text-center text-lg font-extrabold text-gray-900">
              {isLoading ? '--' : `${totalCo2eKg} kg CO2e`}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default BannerUIT;

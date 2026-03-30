import React from 'react';
import { View, TouchableOpacity } from 'react-native';
// Dùng thẻ Text xịn xò của nhóm mình tự làm

import { useTranslation } from 'react-i18next';
// Lấy khoảng cách an toàn (tránh tai thỏ/đảo động của điện thoại)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Bộ icon xịn từ Expo
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'components/ui/Text';
import { useThemeColor } from 'hooks/useThemeColor.hook';

// -----------------------------------------------------------------
// COMPONENT PHỤ: Tránh lặp code cho 4 cái nút ở dưới
// -----------------------------------------------------------------
type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
};

const MenuItem = ({ icon, title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress} className="w-[22%] items-center active:opacity-70">
    <View className="mb-1 h-12 w-12 items-center justify-center">{icon}</View>
    {/* Chữ sẽ tự đổi Trắng/Đen nhờ text-foreground */}
    <Text className="text-center font-inter text-xs leading-tight text-foreground">{title}</Text>
  </TouchableOpacity>
);

// -----------------------------------------------------------------
// MÀN HÌNH CHÍNH
// -----------------------------------------------------------------
export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  // Dữ liệu giả lập (Sau này lấy từ API)
  const userName = 'User name';
  const userPoints = '10';

  return (
    // Padding top giúp nội dung không bị vướng vào thanh trạng thái (cục pin, wifi...)
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      {/* 1. THẺ XANH (HEADER CARD) */}
      <View className="mx-4 flex-row items-center rounded-3xl bg-primary p-5 shadow-sm">
        {/* Avatar Hình cái cây */}
        <View className="mr-3 h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white/30">
          <FontAwesome6 name="tree" size={26} color="#ffffff" />
        </View>

        {/* Thông tin User */}
        <View className="flex-1">
          <Text className="mb-0.5 font-inter text-xs text-white/90">{t('home.welcome')}</Text>
          <Text className="line-clamp-1 font-inter-bold text-base text-foreground">{userName}</Text>
        </View>

        {/* Điểm tích lũy */}
        <View className="items-end">
          <Text className="mb-0.5 font-inter text-xs text-white/90">{t('home.points')}</Text>
          <Text className="font-inter-bold text-2xl text-white">
            {userPoints} <Text className="font-inter-bold text-base text-white">GP</Text>
          </Text>
        </View>
      </View>

      {/* 2. DANH SÁCH CHỨC NĂNG (GRID MENU) */}
      <View className="mt-8 flex-row justify-between px-6">
        <MenuItem
          icon={<FontAwesome6 name="store" size={28} color={colors.foreground} />}
          title={t('home.voucher', 'Chợ Voucher')}
          onPress={() => console.log('Mở chợ Voucher')}
        />

        <MenuItem
          icon={<Ionicons name="grid" size={32} color={colors.foreground} />}
          title={t('home.feature', 'Danh mục\nchức năng')}
        />

        <MenuItem
          icon={<Ionicons name="grid" size={32} color={colors.foreground} />}
          title={t('home.feature', 'Danh mục\nchức năng')}
        />

        <MenuItem
          icon={<Ionicons name="grid" size={32} color={colors.foreground} />}
          title={t('home.feature', 'Danh mục\nchức năng')}
        />
      </View>
    </View>
  );
}

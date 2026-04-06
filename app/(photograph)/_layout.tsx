import { View } from 'react-native';
import { Slot, useFocusEffect, usePathname } from 'expo-router';
import BottomNavBar from './components/BottomNavBar';
import { useCallback } from 'react';
import { setStatusBarStyle } from 'expo-status-bar';
import { BlurView } from 'expo-blur';

export default function PhotographLayout() {
  const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => {
        setStatusBarStyle('dark');
      };
    }, [])
  );

  // Logic xác định tab nào đang sáng đèn dựa trên URL
  const getActiveTab = () => {
    if (pathname.includes('schedule')) return 'schedule';
    if (pathname.includes('nature')) return 'nature';
    return 'scan';
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#171717' }}>
      {/* Vùng chứa nội dung các trang con (Chiếm trọn màn hình) */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      {/* 2. Đưa BottomNavBar nổi lên trên (absolute) và bọc bằng BlurView */}
      <View className="absolute bottom-16 left-20 right-20 z-50 overflow-hidden rounded-full">
        <BlurView
          intensity={20} // Độ mờ (từ 1 đến 100)
          tint="light">
          <BottomNavBar activeTab={getActiveTab()} />
        </BlurView>
      </View>
    </View>
  );
}

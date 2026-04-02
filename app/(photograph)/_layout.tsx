import { View } from 'react-native';
import { Slot, useFocusEffect, usePathname } from 'expo-router';
import BottomNavBar from './components/BottomNavBar';
import { useCallback } from 'react';
import { setStatusBarStyle } from 'expo-status-bar';

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
      {/* Vùng chứa nội dung các trang con */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      {/* Đưa BottomNavBar ra một lớp riêng biệt nằm dưới Slot */}
      <View className="px-6 pb-20">
        <BottomNavBar activeTab={getActiveTab()} />
      </View>
    </View>
  );
}

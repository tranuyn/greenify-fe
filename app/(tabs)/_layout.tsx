import { Tabs } from 'expo-router';
import { View, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Đổi màu sắc động theo Theme Sáng/Tối
        tabBarActiveTintColor: isDark ? '#4ade80' : '#16a34a', // primary-400 cho Tối, primary-600 cho Sáng
        tabBarInactiveTintColor: isDark ? '#a3a3a3' : '#737373', // Màu xám trung tính
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -2,
          fontFamily: 'Inter_400Regular', // Ép font Inter vào chữ của thanh Tab
          fontWeight: 'normal',
        },
        tabBarStyle: {
          height: 90,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          // Đổi màu nền thanh Tab và đường viền theo Theme
          borderTopColor: isDark ? '#262626' : '#e5e7eb',
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home', 'Trang chủ'), // Fallback tiếng Việt nếu file JSON chưa có
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('tabs.community', 'Cộng đồng'),
          tabBarIcon: ({ color }) => <SimpleLineIcons name="globe" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="greenlock"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarIconStyle: { marginTop: -20 },
          tabBarStyle: { display: 'none' },
          tabBarIcon: () => (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary shadow-md">
              <Feather name="camera" size={28} color="#ffffff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t('tabs.events', 'Sự kiện'),
          tabBarIcon: ({ color }) => <Feather name="calendar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile', 'Tài khoản'),
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { CalendarDays, Crosshair, Globe2, Home, UserRound } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#171717',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -2,
        },
        tabBarStyle: {
          height: 86,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Cộng đồng',
          tabBarIcon: ({ color }) => <Globe2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarIconStyle: { marginTop: -20 },
          tabBarIcon: () => (
            <View className="h-16 w-16 items-center justify-center rounded-full border border-primary-800 bg-primary-600 shadow-md">
              <Crosshair size={30} color="#ffffff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Sự kiện',
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <UserRound size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
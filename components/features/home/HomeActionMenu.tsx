import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useMemo } from 'react';
export function HomeActionMenu() {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      {
        id: 'map',
        icon: <Feather name="map" size={24} color={colors.primary800} />,
        title: t('home.menu_map'),
      },
      {
        id: 'voucher',
        icon: <FontAwesome6 name="store" size={22} color={colors.primary800} />,
        title: t('home.menu_market'),
      },
      {
        id: 'leaderboard',
        icon: <MaterialCommunityIcons name="podium" size={26} color={colors.primary800} />,
        title: t('home.menu_leaderboard'),
      },
      {
        id: 'calendar',
        icon: <Feather name="calendar" size={24} color={colors.primary800} />,
        title: t('home.menu_calendar'),
      },
    ],
    [colors, t]
  );

  return (
    <View className="mt-6 flex-row justify-between px-6">
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="w-[22%] items-center active:opacity-70"
          onPress={() => {
            if (item.id === 'map') {
              router.push('/(map)/map');
            }
          }}>
          <View className="mb-2 h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 shadow-sm">
            {item.icon}
          </View>
          <Text className="text-center font-inter-medium text-xs text-foreground">
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

type Props = {
  userName: string;
  avatarUrl?: string | null;
  points: number;
};

export function HomeHeader({ userName, avatarUrl, points }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColor();

  return (
    <View className="mx-5 overflow-hidden rounded-3xl shadow-lg shadow-primary-900/30">
      <LinearGradient
        colors={[colors.primary700, colors.primary500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
      >
        {/* Avatar */}
        <View className="mr-4 h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <FontAwesome6 name="tree" size={22} color="white" />
          )}
        </View>

        {/* Greeting + Name */}
        <View className="flex-1">
          <Text className="mb-0.5 font-inter text-xs text-white/80">
            {t('home.welcome')}
          </Text>
          <Text className="line-clamp-2 font-inter-bold text-lg text-white">
            {userName}
          </Text>
        </View>

        {/* Points Badge */}
        <View className="items-center rounded-2xl bg-white/15 px-4 py-2.5">
          <Text className="font-inter text-[10px] uppercase tracking-wider text-white/70">
            {t('home.points')}
          </Text>
          <Text className="font-inter-bold text-xl text-white">
            {points}{' '}
            <Text className="font-inter-semibold text-sm text-white/90">GP</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

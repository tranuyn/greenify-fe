import { View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { Event } from '@/types/community.types';

type Props = {
  item: Event;
  isRegistered?: boolean;
};

/** Format ISO date string to short date */
function formatShortDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function EventCard({ item, isRegistered = false }: Props) {
  const { t } = useTranslation();
  const colors = useThemeColor();

  return (
    <View className="mr-4 w-[300px] overflow-hidden rounded-2xl bg-background shadow-sm shadow-black/70 dark:bg-card">
      {/* Cover Image */}
      <View className="relative h-28">
        <Image
          source={{ uri: item.cover_image_url }}
          className="h-full w-full bg-primary-100"
          resizeMode="cover"
        />
        {/* NGO Badge */}
        {item.ngo_name && (
          <View className="absolute left-2.5 top-2.5 flex-row items-center rounded-full bg-black/50 px-2.5 py-1">
            <Feather name="shield" size={10} color="white" />
            <Text className="ml-1 font-inter-medium text-[10px] text-white">
              {item.ngo_name}
            </Text>
          </View>
        )}
        {/* GP Badge */}
        <View className="absolute right-2.5 top-2.5 rounded-full bg-primary px-3 py-1">
          <Text className="font-inter-bold text-xs text-white">
            +{item.reward_points} GP
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-3.5">
        <Text className="line-clamp-1 font-inter-bold text-[15px] text-foreground">
          {item.title}
        </Text>

        {/* Location */}
        <View className="mt-1.5 flex-row items-center">
          <Feather name="map-pin" size={12} color={colors.neutral400} />
          <Text className="ml-1.5 line-clamp-1 font-inter text-xs text-foreground/50">
            {item.location_address}
          </Text>
        </View>

        {/* Date + Participants row */}
        <View className="mt-1.5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="clock" size={12} color={colors.neutral400} />
            <Text className="ml-1.5 font-inter text-xs text-foreground/50">
              {t('home.event_time', {
                date: formatShortDate(item.start_time),
                time: formatTime(item.start_time),
              })}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="users" size={12} color={colors.neutral400} />
            <Text className="ml-1 font-inter text-xs text-foreground/50">
              {item.registered_count || 0}/{item.max_participants}
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          className={`mt-3 items-center rounded-xl py-2.5 active:opacity-80 ${
            isRegistered ? 'bg-primary-100' : 'bg-primary'
          }`}
          disabled={isRegistered}
        >
          <Text
            className={`font-inter-semibold text-sm ${
              isRegistered ? 'text-primary-700' : 'text-white'
            }`}
          >
            {isRegistered ? t('home.btn_registered') : t('home.btn_register')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

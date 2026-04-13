import { View, Image, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { Event } from '@/types/community.types';

type Props = {
  item: Event;
  isRegistered?: boolean;
  onPress: () => void;
  onRegister: () => void;
  isRegistering?: boolean;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function isFull(item: Event) {
  return (item.registered_count ?? 0) >= item.max_participants;
}

export function EventListCard({
  item,
  isRegistered = false,
  onPress,
  onRegister,
  isRegistering = false,
}: Props) {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const full = isFull(item);

  // Trạng thái button CTA
  const ctaDisabled = isRegistered || full || isRegistering;
  const ctaLabel = isRegistered
    ? t('events.card.registered', 'Đã đăng ký')
    : full
      ? t('events.card.full', 'Hết chỗ')
      : isRegistering
        ? t('events.card.processing', 'Đang xử lý...')
        : t('events.card.register', 'Đăng ký');

  const ctaBg = isRegistered
    ? 'bg-primary-100'
    : full
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-primary';

  const ctaText = isRegistered ? 'text-primary-700' : full ? 'text-foreground/40' : 'text-white';

  return (
    <TouchableOpacity
      className="mx-5 mb-4 overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/50 dark:bg-card"
      onPress={onPress}
      activeOpacity={0.95}>
      {/* Cover image */}
      <View className="relative h-44">
        <Image
          source={{ uri: item.cover_image_url }}
          className="h-full w-full bg-primary-100"
          resizeMode="cover"
        />

        {/* Gradient overlay bottom */}
        <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* NGO badge — top left */}
        {item.ngo_name && (
          <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-black/50 px-2.5 py-1">
            <Feather name="shield" size={10} color="white" />
            <Text className="ml-1 font-inter-medium text-[10px] text-white">{item.ngo_name}</Text>
          </View>
        )}

        {/* Event type badge — top right */}
        <View className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1">
          <Text className="font-inter-medium text-[10px] text-primary-700">{item.event_type}</Text>
        </View>

        {/* GP reward — bottom right over image */}
        <View className="absolute bottom-3 right-3 flex-row items-center rounded-full bg-primary px-3 py-1">
          <Feather name="zap" size={10} color="white" />
          <Text className="ml-1 font-inter-bold text-xs text-white">+{item.reward_points} GP</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title */}
        <Text className="font-inter-bold text-base text-foreground" numberOfLines={2}>
          {item.title}
        </Text>

        {/* Meta rows */}
        <View className="mt-3 gap-2">
          {/* Location */}
          <View className="flex-row items-center">
            <View className="mr-2.5 h-5 w-5 items-center justify-center rounded-full bg-primary-50">
              <Feather name="map-pin" size={11} color={colors.primary700} />
            </View>
            <Text className="text-foreground/60 flex-1 font-inter text-xs" numberOfLines={1}>
              {item.location_address}
            </Text>
          </View>

          {/* Date & Time */}
          <View className="flex-row items-center">
            <View className="mr-2.5 h-5 w-5 items-center justify-center rounded-full bg-primary-50">
              <Feather name="calendar" size={11} color={colors.primary700} />
            </View>
            <Text className="text-foreground/60 font-inter text-xs">
              {formatDate(item.start_time)} · {formatTime(item.start_time)} –{' '}
              {formatTime(item.end_time)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="my-3.5 h-px bg-primary-50 dark:bg-white/5" />

        {/* Bottom row: participants + CTA */}
        <View className="flex-row items-center justify-between">
          {/* Participants */}
          <View className="mr-2 flex-1 flex-row items-center">
            <Feather name="users" size={13} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1.5 flex-shrink font-inter text-xs" numberOfLines={1}>
              {item.registered_count ?? 0}/{item.max_participants} {t('events.card.people', 'người')}
            </Text>
            {/* Full warning */}
            {full && !isRegistered && (
              <View className="ml-2 shrink-0 rounded-full bg-rose-50 px-2 py-0.5">
                <Text className="font-inter-medium text-[10px] text-rose-500">
                  {t('events.card.full', 'Hết chỗ')}
                </Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            className={`shrink-0 items-center justify-center rounded-xl px-4 py-2 active:opacity-80 min-w-[90px] ${ctaBg}`}
            disabled={ctaDisabled}
            onPress={(e) => {
              // Ngăn TouchableOpacity cha (navigate) bị trigger
              e.stopPropagation();
              onRegister();
            }}>
            <Text className={`font-inter-semibold text-sm ${ctaText}`} numberOfLines={1}>
              {ctaLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

import { View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { Event } from '@/types/community.types';
import { getRegistrationButtonLabel } from '@/utils/eventUtils';

type Props = {
  item: Event;
  isRegistered?: boolean;
  isRegistering?: boolean;
  onPressCard?: () => void;
  onRegister?: () => void;
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

export function EventCard({
  item,
  isRegistered = false,
  isRegistering = false,
  onPressCard,
  onRegister,
}: Props) {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const full = (item.participantCount ?? 0) >= item.maxParticipants;

  const hasStatus = !!item?.registrationStatus || isRegistered;
  const ctaDisabled = hasStatus || isRegistering;

  const ctaLabel = getRegistrationButtonLabel({
    t,
    registrationStatus: item?.registrationStatus,
    isFull: full,
    isProcessing: isRegistering,
  });

  const ctaBg = !isRegistered ? 'bg-primary-100' : 'bg-gray-100 dark:bg-gray-800';

  const ctaText = !isRegistered ? 'text-primary-700' : 'text-foreground';

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPressCard}
      className="mr-4 w-[300px] overflow-hidden rounded-2xl bg-background shadow-sm shadow-black/70 dark:bg-card">
      {/* Cover Image */}
      <View className="relative h-28">
        <Image
          source={{ uri: item.thumbnail.imageUrl }}
          className="h-full w-full bg-primary-100"
          resizeMode="cover"
        />
        {/* NGO Badge */}
        {item.organizer?.name && (
          <View className="absolute left-2.5 top-2.5 flex-row items-center rounded-full bg-black/50 px-2.5 py-1">
            <Feather name="shield" size={10} color="white" />
            <Text className="ml-1 font-inter-medium text-[10px] text-white">
              {item.organizer.name}
            </Text>
          </View>
        )}
        {/* GP Badge */}
        <View className="absolute right-2.5 top-2.5 rounded-full bg-primary px-3 py-1">
          <Text className="font-inter-bold text-xs text-white">+{item.rewardPoints} GP</Text>
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
          <Text className="text-foreground/50 ml-1.5 line-clamp-1 font-inter text-xs">
            {item.address.addressDetail}
          </Text>
        </View>

        {/* Date + Participants row */}
        <View className="mt-1.5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="clock" size={12} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1.5 font-inter text-xs">
              {t('home.event_time', {
                date: formatShortDate(item.startTime),
                time: formatTime(item.startTime),
              })}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="users" size={12} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1 font-inter text-xs">
              {item.participantCount || 0}/{item.maxParticipants}
            </Text>
            {full && !isRegistered && (
              <View className="ml-2 rounded-full bg-rose-50 px-2 py-0.5">
                <Text className="font-inter-medium text-[10px] text-rose-500">
                  {t('home.btn_full')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          className={`mt-3 items-center justify-center rounded-xl py-2.5 active:opacity-80 ${ctaBg}`}
          // disabled={ctaDisabled}
          disabled={ctaDisabled}
          onPress={(e) => {
            e.stopPropagation();
            onRegister?.();
          }}>
          <Text className={`font-inter-semibold text-sm ${ctaText}`} numberOfLines={1}>
            {ctaLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

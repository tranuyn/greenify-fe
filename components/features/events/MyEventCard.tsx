import { View, Image, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { EventRegistration, RegistrationStatus } from '@/types/community.types';

type Props = {
  registration: EventRegistration;
  onPress: () => void;
};

type StatusConfig = {
  labelKey: string;
  bgClass: string;
  textClass: string;
};

const STATUS_CONFIG: Partial<Record<RegistrationStatus, StatusConfig>> = {
  REGISTERED: {
    labelKey: 'events.my_events.status.registered',
    bgClass: 'bg-blue-300',
    textClass: 'text-blue-700',
  },
  WAITLISTED: {
    labelKey: 'events.my_events.status.waitlisted',
    bgClass: 'bg-amber-300',
    textClass: 'text-amber-700',
  },
  CHECKED_IN: {
    labelKey: 'events.my_events.status.checked_in',
    bgClass: 'bg-primary-300',
    textClass: 'text-primary-700',
  },
  ATTENDED: {
    labelKey: 'events.my_events.status.attended',
    bgClass: 'bg-primary-100',
    textClass: 'text-primary-800',
  },
  CHECKED_OUT: {
    labelKey: 'events.my_events.status.checked_out',
    bgClass: 'bg-primary-100',
    textClass: 'text-primary-800',
  },
  NO_SHOW: {
    labelKey: 'events.my_events.status.no_show',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-500',
  },
  CANCELLED: {
    labelKey: 'events.my_events.status.cancelled',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-400',
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} · ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function MyEventCard({ registration, onPress }: Props) {
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });
  const colors = useThemeColor();
  const event = registration.event;
  const statusCfg = STATUS_CONFIG[registration.status];

  if (!event) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/50 dark:bg-card">
      {/* Thumbnail */}
      <Image
        source={{ uri: event.thumbnail?.imageUrl }}
        className="h-full w-24 bg-primary-100"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="flex-1 px-3.5 py-3">
        {/* Status badge */}
        {statusCfg && (
          <View className={`mb-1.5 self-start rounded-full px-2.5 py-0.5 ${statusCfg.bgClass}`}>
            <Text className={`font-inter-semibold text-[10px] ${statusCfg.textClass}`}>
              {t(statusCfg.labelKey)}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text className="font-inter-bold text-sm text-foreground" numberOfLines={1}>
          {event.title}
        </Text>

        {/* NGO name */}
        {event.ngoName && (
          <Text className="text-foreground/40 mt-0.5 font-inter text-[11px]">{event.ngoName}</Text>
        )}

        {/* Meta */}
        <View className="mt-2 gap-1">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={10} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1.5 font-inter text-[11px]" numberOfLines={1}>
              {event.address?.addressDetail}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="clock" size={10} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1.5 font-inter text-[11px]">
              {formatDate(event.startTime)}
            </Text>
          </View>
        </View>

        {/* GP reward */}
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="zap" size={11} color={colors.primary} />
            <Text className="ml-1 font-inter-semibold text-xs text-primary">
              +{event.rewardPoints} {c('gp_unit')}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.neutral400} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

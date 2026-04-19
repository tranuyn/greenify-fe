import { Alert, View, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { openDirections } from '@/utils/directions.util';
import { useReverseGeocode } from '@/hooks/useReverseGeocode.hook';
import type { RecyclingStation } from '@/types/community.types';
import { NEUTRAL_COLORS } from 'constants/color.constant';

type Props = {
  station: RecyclingStation;
  onClose: () => void;
};

export function StationBottomSheet({ station, onClose }: Props) {
  const { t } = useTranslation();
  const { address: resolvedAddress, isLoading: isResolvingAddress } = useReverseGeocode({
    latitude: station.latitude,
    longitude: station.longitude,
    fallbackAddress: station.address,
  });

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase()
    .slice(0, 3);
  const todayKey =
    { MON: 'MON', TUE: 'TUE', WED: 'WED', THU: 'THU', FRI: 'FRI', SAT: 'SAT', SUN: 'SUN' }[today] ??
    'MON';
  const todayHours = station.opening_hours?.[todayKey];
  const todayLabel = t(`map.days.${todayKey}`);

  const handleOpenDirections = async () => {
    try {
      await openDirections({ latitude: station.latitude, longitude: station.longitude });
    } catch {
      Alert.alert(
        t('common.error', 'Loi'),
        t('map.open_directions_error', 'Khong the mo ung dung ban do.')
      );
    }
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-background px-5 pb-8 pt-5 shadow-2xl shadow-black/20">
      {/* Handle bar */}
      <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-200" />

      {/* Close button */}
      <TouchableOpacity className="absolute right-5 top-5 rounded-full p-1" onPress={onClose}>
        <Feather name="x" size={20} color={NEUTRAL_COLORS[400]} />
      </TouchableOpacity>

      {/* Station name */}
      <Text className="pr-8 font-inter-bold text-lg text-foreground">{station.name}</Text>

      {/* Address */}
      <View className="mt-2 flex-row items-start">
        <Feather name="map-pin" size={14} color={NEUTRAL_COLORS[400]} style={{ marginTop: 2 }} />
        <Text className="text-foreground/60 ml-2 flex-1 font-inter text-sm">
          {isResolvingAddress ? t('common.processing', 'Đang xử lý...') : resolvedAddress}
        </Text>
      </View>

      {/* Today hours */}
      <View className="mt-2 flex-row items-center">
        <Feather name="clock" size={14} color={NEUTRAL_COLORS[400]} />
        <Text className="text-foreground/70 ml-2 font-inter-medium text-sm">
          {todayHours
            ? t('map.today_hours', {
                day: todayLabel,
                open: todayHours.open,
                close: todayHours.close,
              })
            : t('map.today_closed', { day: todayLabel })}
        </Text>
      </View>

      {/* Phone */}
      {station.contact_phone && (
        <View className="mt-2 flex-row items-center">
          <Feather name="phone" size={14} color={NEUTRAL_COLORS[400]} />
          <Text className="ml-2 font-inter text-sm text-primary-700">{station.contact_phone}</Text>
        </View>
      )}

      {/* Waste type chips */}
      <View className="mt-4 flex-row flex-wrap gap-2">
        {station.waste_types.map((type) => (
          <View key={type} className="rounded-full bg-primary-50 px-3 py-1">
            <Text className="font-inter-medium text-xs text-primary-700">{type}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleOpenDirections}
        className="mt-4 flex-row items-center justify-center rounded-xl bg-primary px-4 py-3">
        <Feather name="navigation" size={16} color="#ffffff" />
        <Text className="ml-2 font-inter-semibold text-sm text-white">
          {t('map.open_directions', 'Mở bản đồ')}
        </Text>
      </TouchableOpacity>

      {/* Notes */}
      {station.notes && (
        <Text className="text-foreground/40 mt-3 font-inter text-xs leading-5">
          {station.notes}
        </Text>
      )}
    </View>
  );
}

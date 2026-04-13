import { View, ScrollView, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import type { RecyclingStation } from '@/types/community.types';

const DAY_LABELS: Record<string, string> = {
  MON: 'T2',
  TUE: 'T3',
  WED: 'T4',
  THU: 'T5',
  FRI: 'T6',
  SAT: 'T7',
  SUN: 'CN',
};

type Props = {
  station: RecyclingStation;
  onClose: () => void;
};

export function StationBottomSheet({ station, onClose }: Props) {
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase()
    .slice(0, 3);
  const todayKey =
    { MON: 'MON', TUE: 'TUE', WED: 'WED', THU: 'THU', FRI: 'FRI', SAT: 'SAT', SUN: 'SUN' }[today] ??
    'MON';
  const todayHours = station.opening_hours?.[todayKey];

  return (
    <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-2xl shadow-black/20">
      {/* Handle bar */}
      <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-200" />

      {/* Close button */}
      <TouchableOpacity className="absolute right-5 top-5 rounded-full p-1" onPress={onClose}>
        <Feather name="x" size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Station name */}
      <Text className="pr-8 font-inter-bold text-lg text-foreground">{station.name}</Text>

      {/* Address */}
      <View className="mt-2 flex-row items-start">
        <Feather name="map-pin" size={14} color="#9ca3af" style={{ marginTop: 2 }} />
        <Text className="text-foreground/60 ml-2 flex-1 font-inter text-sm">{station.address}</Text>
      </View>

      {/* Today hours */}
      <View className="mt-2 flex-row items-center">
        <Feather name="clock" size={14} color="#9ca3af" />
        <Text className="text-foreground/70 ml-2 font-inter-medium text-sm">
          {todayHours ? `Hôm nay: ${todayHours.open} – ${todayHours.close}` : 'Hôm nay: Đóng cửa'}
        </Text>
      </View>

      {/* Phone */}
      {station.contact_phone && (
        <View className="mt-2 flex-row items-center">
          <Feather name="phone" size={14} color="#9ca3af" />
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

      {/* Notes */}
      {station.notes && (
        <Text className="text-foreground/40 mt-3 font-inter text-xs leading-5">
          {station.notes}
        </Text>
      )}
    </View>
  );
}

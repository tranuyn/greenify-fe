import { TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { formatDateLabel } from './eventFilters';

type Props = {
  filterDate: Date | null;
  hasActiveFilter: boolean;
  onOpenDatePicker: () => void;
  onClearDate: () => void;
  onReset: () => void;
};

export function EventDateFilterBar({
  filterDate,
  hasActiveFilter,
  onOpenDatePicker,
  onClearDate,
  onReset,
}: Props) {
  const colors = useThemeColor();

  return (
    <View className="mt-3 flex-row items-center gap-2">
      <TouchableOpacity
        onPress={onOpenDatePicker}
        className={`flex-row items-center rounded-full border px-4 py-2 ${
          filterDate
            ? 'border-primary bg-primary'
            : 'border-primary-100 bg-primary-50 dark:border-white/10 dark:bg-card'
        }`}>
        <Feather name="calendar" size={14} color={filterDate ? 'white' : colors.primary700} />
        <Text
          className={`ml-2 font-inter-medium text-sm ${
            filterDate ? 'text-white' : 'text-primary-700'
          }`}>
          {filterDate ? formatDateLabel(filterDate) : 'Chọn ngày'}
        </Text>
        {filterDate && (
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onClearDate();
            }}
            hitSlop={8}
            className="ml-2">
            <Feather name="x" size={13} color="white" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {hasActiveFilter && (
        <TouchableOpacity
          onPress={onReset}
          className="flex-row items-center rounded-full border border-rose-100 bg-rose-50 px-4 py-2">
          <Feather name="rotate-ccw" size={13} color="#f43f5e" />
          <Text className="ml-1.5 font-inter-medium text-sm text-rose-500">Đặt lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

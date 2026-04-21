import React, { useEffect, useState, forwardRef } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { SortOption } from '@/constants/enums/sortOptions.enum';
import type { MyPostsFilterState } from '@/components/features/community/CommunityFilterSheet';
import { POST_STATUS, type PostStatus } from '@/types/action.types';

interface Props {
  initialFilters: MyPostsFilterState;
  onApply: (filters: MyPostsFilterState) => void;
  onClear: () => void;
}

const FilterChip = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mb-3 mr-3 rounded-full border px-4 py-2 ${
      isSelected ? 'border-primary-700 bg-primary-700' : 'border-primary-200 bg-transparent'
    }`}>
    <Text className={`font-inter-medium ${isSelected ? 'text-white' : 'text-foreground/70'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const STATUS_OPTIONS: Array<{
  value: PostStatus | 'all';
  labelKey: string;
  fallback: string;
}> = [
  { value: 'all', labelKey: 'common.all', fallback: 'Tất cả' },
  { value: POST_STATUS.DRAFT, labelKey: 'community.post_status.draft', fallback: 'Nháp' },
  {
    value: POST_STATUS.PENDING_REVIEW,
    labelKey: 'community.post_status.pending_review',
    fallback: 'Chờ duyệt',
  },
  {
    value: POST_STATUS.PARTIALLY_APPROVED,
    labelKey: 'community.post_status.partially_approved',
    fallback: 'Duyệt một phần',
  },
  { value: POST_STATUS.VERIFIED, labelKey: 'community.post_status.verified', fallback: 'Đã duyệt' },
  { value: POST_STATUS.REJECTED, labelKey: 'community.post_status.rejected', fallback: 'Từ chối' },
  { value: POST_STATUS.FLAGGED, labelKey: 'community.post_status.flagged', fallback: 'Gắn cờ' },
  { value: POST_STATUS.REVOKED, labelKey: 'community.post_status.revoked', fallback: 'Thu hồi' },
];

const PRESET_RANGE_DAYS = 7;

const getLastWeekRange = (days: number) => {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - days);

  return {
    fromDate: fromDate.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0],
  };
};

export const MyPostsFilterSheet = forwardRef<BottomSheetModal, Props>(
  ({ initialFilters, onApply, onClear }, ref) => {
    const { t } = useTranslation();
    const colors = useThemeColor();
    const [tempFilters, setTempFilters] = useState<MyPostsFilterState>(initialFilters);

    useEffect(() => {
      setTempFilters(initialFilters);
    }, [initialFilters]);

    const updateFilters = (patch: Partial<MyPostsFilterState>) => {
      setTempFilters((current) => ({ ...current, ...patch }));
    };

    const clearDateRange = () => updateFilters({ fromDate: undefined, toDate: undefined });

    const applyPresetDateRange = () => updateFilters(getLastWeekRange(PRESET_RANGE_DAYS));

    const setStatus = (status: MyPostsFilterState['status']) => updateFilters({ status });

    const lastWeekRange = getLastWeekRange(PRESET_RANGE_DAYS);
    const isLastWeekSelected = tempFilters.fromDate === lastWeekRange.fromDate;

    const [datePickerConfig, setDatePickerConfig] = useState<{
      show: boolean;
      type: 'from' | 'to';
      value: Date;
    }>({ show: false, type: 'from', value: new Date() });

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setDatePickerConfig((prev) => ({ ...prev, show: false }));
      if (event.type === 'set' && selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        setTempFilters((prev) => ({
          ...prev,
          ...(datePickerConfig.type === 'from' ? { fromDate: dateString } : { toDate: dateString }),
        }));
      } else if (event.type === 'dismissed') {
        setDatePickerConfig((prev) => ({ ...prev, show: false }));
      }
    };

    const showPicker = (type: 'from' | 'to', currentDateString?: string) => {
      const initialDate = currentDateString ? new Date(currentDateString) : new Date();
      setDatePickerConfig({ show: true, type, value: initialDate });
    };

    const renderDateField = (label: string, value: string | undefined, onPress: () => void) => (
      <View className="flex-1">
        <Text className="text-foreground/60 mb-1 font-inter text-xs">{label}</Text>
        <TouchableOpacity
          className="h-12 flex-row items-center rounded-xl border border-primary-200 bg-primary-50 px-3 dark:border-white/10 dark:bg-card"
          onPress={onPress}>
          <Feather name="calendar" size={16} color={colors.primary} />
          <Text className="ml-2 font-inter text-sm text-foreground">
            {value || t('common.select_date')}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['75%']}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
        )}
        backgroundStyle={{ backgroundColor: colors.background, borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: colors.primary300, width: 40 }}>
        <BottomSheetView className="flex-1 px-6 pb-8 pt-2">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-inter-bold text-xl text-foreground">
              {t('community.filters.my_title', 'Bộ lọc bài của tôi')}
            </Text>
            <TouchableOpacity
              onPress={onClear}
              className="rounded-lg bg-rose-50 px-3 py-1.5 dark:bg-rose-500/10">
              <Text className="font-inter-medium text-sm text-rose-500">
                {t('community.filters.clear', 'Xóa tất cả')}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6 flex-row items-center gap-4">
            {renderDateField(t('common.from_date'), tempFilters.fromDate, () =>
              showPicker('from', tempFilters.fromDate)
            )}
            {renderDateField(t('common.to_date'), tempFilters.toDate, () =>
              showPicker('to', tempFilters.toDate)
            )}
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">
            {t('community.filters.statusTitle', 'Trạng thái')}
          </Text>
          <View className="mb-6 flex-row flex-wrap">
            {STATUS_OPTIONS.map((status) => (
              <FilterChip
                key={status.value}
                label={t(status.labelKey, status.fallback)}
                isSelected={tempFilters.status === status.value}
                onPress={() => setStatus(status.value)}
              />
            ))}
          </View>

          <View className="flex-1" />
          <Button
            title={t('community.filters.apply', 'Áp dụng bộ lọc')}
            onPress={() => onApply(tempFilters)}
          />

          {datePickerConfig.show && (
            <DateTimePicker
              value={datePickerConfig.value}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor={colors.foreground}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

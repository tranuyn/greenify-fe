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
import type { FeedFilterState } from '@/components/features/community/CommunityFilterSheet';

interface Props {
  initialFilters: FeedFilterState;
  actionTypes: any[];
  onApply: (filters: FeedFilterState) => void;
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

export const FeedFilterSheet = forwardRef<BottomSheetModal, Props>(
  ({ initialFilters, actionTypes, onApply, onClear }, ref) => {
    const { t } = useTranslation();
    const colors = useThemeColor();
    const [tempFilters, setTempFilters] = useState<FeedFilterState>(initialFilters);

    useEffect(() => {
      setTempFilters(initialFilters);
    }, [initialFilters]);

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
              {t('community.filters.title', 'Bộ lọc cộng đồng')}
            </Text>
            <TouchableOpacity
              onPress={onClear}
              className="rounded-lg bg-rose-50 px-3 py-1.5 dark:bg-rose-500/10">
              <Text className="font-inter-medium text-sm text-rose-500">
                {t('community.filters.clear', 'Xóa tất cả')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">
            {t('community.filters.sortBy', 'Sắp xếp theo')}
          </Text>
          <View className="mb-6 flex-row flex-wrap">
            <FilterChip
              label={t('community.filters.sort.newest')}
              isSelected={tempFilters.sortBy === SortOption.NEWEST}
              onPress={() => setTempFilters({ ...tempFilters, sortBy: SortOption.NEWEST })}
            />
            <FilterChip
              label={t('community.filters.sort.popular')}
              isSelected={tempFilters.sortBy === SortOption.POPULAR}
              onPress={() => setTempFilters({ ...tempFilters, sortBy: SortOption.POPULAR })}
            />
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">
            {t('community.filters.timeTitle', 'Thời gian')}
          </Text>
          <View className="mb-3 flex-row flex-wrap">
            <FilterChip
              label={t('common.all')}
              isSelected={!tempFilters.fromDate && !tempFilters.toDate}
              onPress={() =>
                setTempFilters({ ...tempFilters, fromDate: undefined, toDate: undefined })
              }
            />
            <FilterChip
              label={t('community.filters.time.week')}
              isSelected={
                tempFilters.fromDate ===
                new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
              }
              onPress={() => {
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                setTempFilters({
                  ...tempFilters,
                  toDate: today.toISOString().split('T')[0],
                  fromDate: lastWeek.toISOString().split('T')[0],
                });
              }}
            />
          </View>

          <View className="mb-6 flex-row items-center space-x-4">
            <View className="flex-1">
              <Text className="text-foreground/60 mb-1 font-inter text-xs">
                {t('common.from_date')}
              </Text>
              <TouchableOpacity
                className="h-12 flex-row items-center rounded-xl border border-primary-200 bg-primary-50 px-3 dark:border-white/10 dark:bg-card"
                onPress={() => showPicker('from', tempFilters.fromDate)}>
                <Feather name="calendar" size={16} color={colors.primary} />
                <Text className="ml-2 font-inter text-sm text-foreground">
                  {tempFilters.fromDate || t('common.select_date')}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-foreground/60 mb-1 font-inter text-xs">
                {t('common.to_date')}
              </Text>
              <TouchableOpacity
                className="h-12 flex-row items-center rounded-xl border border-primary-200 bg-primary-50 px-3 dark:border-white/10 dark:bg-card"
                onPress={() => showPicker('to', tempFilters.toDate)}>
                <Feather name="calendar" size={16} color={colors.primary} />
                <Text className="ml-2 font-inter text-sm text-foreground">
                  {tempFilters.toDate || t('common.select_date')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">
            {t('community.filters.actionTitle', 'Hoạt động xanh')}
          </Text>
          <View className="mb-6 flex-row flex-wrap">
            <FilterChip
              label={t('common.all')}
              isSelected={tempFilters.actionTypeId === 'all'}
              onPress={() => setTempFilters({ ...tempFilters, actionTypeId: 'all' })}
            />
            {actionTypes.slice(0, 5).map((type) => (
              <FilterChip
                key={type.id}
                label={type.action_name}
                isSelected={tempFilters.actionTypeId === type.id}
                onPress={() => setTempFilters({ ...tempFilters, actionTypeId: type.id })}
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

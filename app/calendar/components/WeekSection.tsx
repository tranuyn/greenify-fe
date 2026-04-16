import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { IMAGES } from '@/constants/linkMedia';
import { useCreatePlantDailyLog } from '@/hooks/mutations/useGamification';
import { useMyPlant, usePlantDailyLogs } from '@/hooks/queries/useGamification';
import { PlantStatus } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getStartOfWeek = (date: Date) => {
  const cloned = new Date(date);
  const day = cloned.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  cloned.setDate(cloned.getDate() + diff);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
};

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const WeekSection = () => {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draftDate, setDraftDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['42%'], []);

  const weekStart = useMemo(() => getStartOfWeek(selectedDate), [selectedDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, idx) => new Date(weekStart.getTime() + idx * DAY_IN_MS)),
    [weekStart]
  );
  const weekEnd = weekDays[6];

  const { data: myPlant } = useMyPlant();
  const { data: dailyLogs = [], isLoading: isDailyLogsLoading } = usePlantDailyLogs({
    plant_progress_id: myPlant?.id,
    from_date: weekStart.toISOString(),
    to_date: weekEnd.toISOString(),
  });
  const { mutate: createPlantDailyLog, isPending: isCreatingLog } = useCreatePlantDailyLog();

  const activeDates = useMemo(() => {
    return new Set(
      dailyLogs
        .filter((log) => log.is_active_day)
        .map((log) => new Date(log.log_date).toDateString())
    );
  }, [dailyLogs]);

  const selectedDateLabel = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`;

  const applySelectedDate = useCallback(
    (nextDate: Date) => {
      setSelectedDate(nextDate);

      if (!myPlant?.id) {
        return;
      }

      const dateKey = nextDate.toDateString();
      if (activeDates.has(dateKey)) {
        return;
      }

      createPlantDailyLog({
        plant_progress_id: myPlant.id,
        log_date: nextDate.toISOString(),
        stage: myPlant.status ?? PlantStatus.GROWING,
        is_active_day: true,
      });
    },
    [activeDates, createPlantDailyLog, myPlant?.id, myPlant?.status]
  );

  const handleAndroidDateChange = (_: DateTimePickerEvent, pickedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!pickedDate) return;

    applySelectedDate(pickedDate);
  };

  const handleIosDateChange = (_: DateTimePickerEvent, pickedDate?: Date) => {
    if (!pickedDate) return;
    setDraftDate(pickedDate);
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
      return;
    }
    setDraftDate(selectedDate);
    dateSheetRef.current?.present();
  };

  const handleConfirmDate = () => {
    applySelectedDate(draftDate);
    dateSheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <View className="mb-4 rounded-xl p-4">
      <View className="mb-6 flex-row items-center justify-between  ">
        <Text className="font-inter-medium text-[var(--foreground)]">
          {t('calendar.week.title')}
        </Text>
        <Text className="font-inter-medium text-[var(--foreground)]">{selectedDateLabel}</Text>
        <TouchableOpacity onPress={openDatePicker}>
          <Feather name="calendar" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between">
        {weekDays.map((dayDate, idx) => {
          const isActiveDay = activeDates.has(dayDate.toDateString());
          return (
            <View
              key={idx}
              className={`h-10 w-10 items-center justify-center rounded-full ${isActiveDay ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'} `}>
              {isActiveDay ? (
                <FontAwesome5 name="leaf" size={12} color={colors.onPrimary} />
              ) : (
                <Text className="text-xs text-[var(--foreground)]">{dayDate.getDate()}</Text>
              )}
            </View>
          );
        })}
      </View>

      {(isDailyLogsLoading || isCreatingLog) && (
        <View className="mt-3 flex-row items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="ml-2 text-xs text-[var(--muted-foreground)]">
            {t('calendar.week.updating')}
          </Text>
        </View>
      )}

      <TouchableOpacity className="mt-8 flex-row items-center justify-center rounded-lg border border-[var(--primary)] bg-transparent py-2">
        <Text className="mr-2 font-inter-bold text-[var(--foreground)]">
          {t('calendar.week.restore_streak')}
        </Text>
        <Image source={{ uri: IMAGES.recycle }} className="h-6 w-6" />
      </TouchableOpacity>
      <Text className="mt-4 text-center font-inter text-sm text-[var(--foreground)]">
        {t('calendar.week.restore_count', { current: 3, total: 3 })}
      </Text>

      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
        />
      )}

      <BottomSheetModal
        ref={dateSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backgroundStyle={{ backgroundColor: colors.background }}>
        <BottomSheetView className="px-5 pb-8 pt-2">
          <View className="mb-2 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => dateSheetRef.current?.dismiss()}>
              <Text className="font-inter-medium text-sm text-[var(--muted-foreground)]">
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
            <Text className="font-inter-semibold text-base text-[var(--foreground)]">
              {t('calendar.week.pick_date')}
            </Text>
            <TouchableOpacity onPress={handleConfirmDate}>
              <Text className="font-inter-semibold text-sm text-[var(--primary)]">
                {t('common.done')}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={draftDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleIosDateChange}
            style={{ height: 200 }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
export default WeekSection;

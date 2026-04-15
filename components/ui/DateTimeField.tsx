import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { formatDate } from '@/utils/date.util';

type DateTimeFieldProps = {
  label: string;
  date: Date;
  timeString: string;
  onDateChange: (d: Date) => void;
  onTimeChange: (t: string) => void;
};

export function DateTimeField({
  label,
  date,
  timeString,
  onDateChange,
  onTimeChange,
}: DateTimeFieldProps) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const colors = useThemeColor();
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });

  const timeDate = (() => {
    const [h, m] = timeString.split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  })();

  return (
    <View>
      <Text className="text-foreground/70 mb-2 font-inter-medium text-sm">{label}</Text>
      <View className="flex-row gap-3">
        {/* Time */}
        <TouchableOpacity
          onPress={() => setShowTime(true)}
          className="flex-1 flex-row items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-3">
          <Text className="font-inter text-sm text-foreground">{timeString || '09:00'}</Text>
          <Feather name="clock" size={15} color={colors.primary700} />
        </TouchableOpacity>

        {/* Date */}
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          className="flex-1 flex-row items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-3">
          <Text className="font-inter text-sm text-foreground">{formatDate(date)}</Text>
          <Feather name="calendar" size={15} color={colors.primary700} />
        </TouchableOpacity>
      </View>

      {/* Date picker */}
      {showDate && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(_: DateTimePickerEvent, d?: Date) => {
            setShowDate(false);
            if (d) onDateChange(d);
          }}
        />
      )}

      {/* Time picker */}
      {showTime && Platform.OS === 'android' && (
        <DateTimePicker
          value={timeDate}
          mode="time"
          display="default"
          onChange={(_: DateTimePickerEvent, d?: Date) => {
            setShowTime(false);
            if (d) {
              onTimeChange(
                `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
              );
            }
          }}
        />
      )}

      {/* iOS modals */}
      {Platform.OS === 'ios' && (
        <>
          <Modal visible={showDate} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
              <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4 dark:bg-card">
                <View className="mb-2 flex-row justify-between">
                  <TouchableOpacity onPress={() => setShowDate(false)}>
                    <Text className="text-foreground/50 font-inter-medium text-sm">
                      {c('cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDate(false)}>
                    <Text className="font-inter-semibold text-sm text-primary-700">
                      {c('done')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(_: DateTimePickerEvent, d?: Date) => {
                    if (d) onDateChange(d);
                  }}
                  style={{ height: 180 }}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={showTime} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
              <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4 dark:bg-card">
                <View className="mb-2 flex-row justify-between">
                  <TouchableOpacity onPress={() => setShowTime(false)}>
                    <Text className="text-foreground/50 font-inter-medium text-sm">
                      {c('cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowTime(false)}>
                    <Text className="font-inter-semibold text-sm text-primary-700">
                      {c('done')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={timeDate}
                  mode="time"
                  display="spinner"
                  onChange={(_: DateTimePickerEvent, d?: Date) => {
                    if (d)
                      onTimeChange(
                        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
                      );
                  }}
                  style={{ height: 180 }}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

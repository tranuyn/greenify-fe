import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // Thêm AntDesign để dùng icon đóng
import { PointSourceType } from 'types/action.types';
import { LedgerTimeFilter } from 'hooks/queries/useWallet';
import {
  DETAIL_SOURCE_TYPES,
  OTHER_SOURCE_TYPES,
  getSourceTypeLabels,
} from '@/constants/sourceTypeLabel';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useTranslation } from 'react-i18next';

interface CheckboxRowProps {
  label: string;
  isChecked: boolean;
  onPress: () => void;
  checkedColor: string;
  uncheckedColor: string;
}

const CheckboxRow = ({
  label,
  isChecked,
  onPress,
  checkedColor,
  uncheckedColor,
}: CheckboxRowProps) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-2.5">
    <MaterialIcons
      name={isChecked ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={isChecked ? checkedColor : uncheckedColor}
    />
    <Text className="ml-3 text-[15px] text-foreground">{label}</Text>
  </TouchableOpacity>
);

export interface LedgerFilterValue {
  time: LedgerTimeFilter[];
  sourceTypes: PointSourceType[];
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  value: LedgerFilterValue;
  onApply: (value: LedgerFilterValue) => void;
  onReset: () => void;
}

const FilterModal = ({ isVisible, onClose, value, onApply, onReset }: FilterModalProps) => {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState<LedgerTimeFilter[]>(value.time);
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<PointSourceType[]>(
    value.sourceTypes
  );

  const colors = useThemeColor();
  const sourceTypeLabels = getSourceTypeLabels(t);

  useEffect(() => {
    if (isVisible) {
      setSelectedTime(value.time);
      setSelectedSourceTypes(value.sourceTypes);
    }
  }, [isVisible, value.time, value.sourceTypes]);

  const selectedTimeSet = useMemo(() => new Set(selectedTime), [selectedTime]);
  const selectedSet = useMemo(() => new Set(selectedSourceTypes), [selectedSourceTypes]);

  const toggleTime = (time: LedgerTimeFilter) => {
    setSelectedTime((prev) =>
      prev.includes(time) ? prev.filter((item) => item !== time) : [...prev, time]
    );
  };

  const clearTime = () => {
    setSelectedTime([]);
  };

  const toggleSourceType = (sourceType: PointSourceType) => {
    setSelectedSourceTypes((prev) =>
      prev.includes(sourceType) ? prev.filter((item) => item !== sourceType) : [...prev, sourceType]
    );
  };

  const handleApply = () => {
    onApply({ time: selectedTime, sourceTypes: selectedSourceTypes });
    onClose();
  };

  const handleReset = () => {
    setSelectedTime([]);
    setSelectedSourceTypes([]);
    onReset();
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop: ĐỔI flex-direction thành justify-center và items-center ĐỂ CĂN GIỮA */}
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-6" onPress={onClose}>
        <Pressable
          className="w-full rounded-3xl bg-background px-5 pb-7 pt-5 shadow-2xl"
          style={{ maxHeight: '80%' }}>
          <View className="mb-5 flex-row items-center justify-between">
            <View className="w-8" />
            <Text className="text-xl font-bold text-foreground">
              {t('point_history.filter.title')}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <AntDesign name="close" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ... Nội dung các nhóm lọc GIỮ NGUYÊN như file cũ ... */}
            {/* Nhóm 1: Thời gian */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">
                  {t('point_history.filter.by_time')}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.foreground} />
              </View>
              <CheckboxRow
                label={t('point_history.filter.time.week')}
                isChecked={selectedTimeSet.has('week')}
                onPress={() => toggleTime('week')}
                checkedColor={colors.primary}
                uncheckedColor={colors.mutedForeground}
              />
              <CheckboxRow
                label={t('point_history.filter.time.month')}
                isChecked={selectedTimeSet.has('month')}
                onPress={() => toggleTime('month')}
                checkedColor={colors.primary}
                uncheckedColor={colors.mutedForeground}
              />
              <CheckboxRow
                label={t('point_history.filter.time.all')}
                isChecked={selectedTime.length === 0}
                onPress={clearTime}
                checkedColor={colors.primary}
                uncheckedColor={colors.mutedForeground}
              />
            </View>

            {/* Nhóm 2: Chi tiết */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">
                  {t('point_history.filter.detail')}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.foreground} />
              </View>
              {DETAIL_SOURCE_TYPES.map((sourceType) => (
                <CheckboxRow
                  key={sourceType}
                  label={sourceTypeLabels[sourceType]}
                  isChecked={selectedSet.has(sourceType)}
                  onPress={() => toggleSourceType(sourceType)}
                  checkedColor={colors.primary}
                  uncheckedColor={colors.mutedForeground}
                />
              ))}
            </View>

            {/* Nhóm 3: Khác */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">
                  {t('point_history.filter.other')}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.foreground} />
              </View>
              {OTHER_SOURCE_TYPES.map((sourceType) => (
                <CheckboxRow
                  key={sourceType}
                  label={sourceTypeLabels[sourceType]}
                  isChecked={selectedSet.has(sourceType)}
                  onPress={() => toggleSourceType(sourceType)}
                  checkedColor={colors.primary}
                  uncheckedColor={colors.mutedForeground}
                />
              ))}
            </View>
          </ScrollView>

          {/* Nút Actions: GIỮ NGUYÊN */}
          <View className="flex-row gap-x-3 pt-5">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 items-center rounded-2xl border border-primary py-4">
              <Text className="text-base font-bold text-primary">
                {t('point_history.filter.reset')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 items-center rounded-2xl bg-primary py-4">
              <Text className="text-base font-bold text-white">
                {t('point_history.filter.apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default FilterModal;

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // Thêm AntDesign để dùng icon đóng
import { PointSourceType } from 'types/action.types';
import { LedgerTimeFilter } from 'hooks/queries/useWallet';
import {
  DETAIL_SOURCE_TYPES,
  OTHER_SOURCE_TYPES,
  SOURCE_TYPE_LABELS,
} from '@/constants/sourceTypeLabel';

interface CheckboxRowProps {
  label: string;
  isChecked: boolean;
  onPress: () => void;
}

const CheckboxRow = ({ label, isChecked, onPress }: CheckboxRowProps) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-2.5">
    <MaterialIcons
      name={isChecked ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={isChecked ? '#171717' : '#a1a1aa'}
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
  const [selectedTime, setSelectedTime] = useState<LedgerTimeFilter[]>(value.time);
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<PointSourceType[]>(
    value.sourceTypes
  );

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
          className="w-full rounded-3xl bg-white px-5 pb-7 pt-5 shadow-2xl"
          style={{ maxHeight: '80%' }}>
          <View className="mb-5 flex-row items-center justify-between">
            <View className="w-8" />
            <Text className="text-xl font-bold text-foreground">Bộ lọc</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <AntDesign name="close" size={22} color="#71717a" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ... Nội dung các nhóm lọc GIỮ NGUYÊN như file cũ ... */}
            {/* Nhóm 1: Thời gian */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Theo thời gian</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
              <CheckboxRow
                label="Tuần"
                isChecked={selectedTimeSet.has('week')}
                onPress={() => toggleTime('week')}
              />
              <CheckboxRow
                label="Tháng"
                isChecked={selectedTimeSet.has('month')}
                onPress={() => toggleTime('month')}
              />
              <CheckboxRow
                label="Tất cả"
                isChecked={selectedTime.length === 0}
                onPress={clearTime}
              />
            </View>

            {/* Nhóm 2: Chi tiết */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Chi tiết</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
              {DETAIL_SOURCE_TYPES.map((sourceType) => (
                <CheckboxRow
                  key={sourceType}
                  label={SOURCE_TYPE_LABELS[sourceType]}
                  isChecked={selectedSet.has(sourceType)}
                  onPress={() => toggleSourceType(sourceType)}
                />
              ))}
            </View>

            {/* Nhóm 3: Khác */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Khác</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
              {OTHER_SOURCE_TYPES.map((sourceType) => (
                <CheckboxRow
                  key={sourceType}
                  label={SOURCE_TYPE_LABELS[sourceType]}
                  isChecked={selectedSet.has(sourceType)}
                  onPress={() => toggleSourceType(sourceType)}
                />
              ))}
            </View>
          </ScrollView>

          {/* Nút Actions: GIỮ NGUYÊN */}
          <View className="flex-row gap-x-3 pt-5">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 items-center rounded-2xl border border-primary py-4">
              <Text className="text-base font-bold text-primary">Thiết lập lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 items-center rounded-2xl bg-primary py-4">
              <Text className="text-base font-bold text-white">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default FilterModal;

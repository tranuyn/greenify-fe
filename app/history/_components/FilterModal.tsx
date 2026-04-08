import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // Thêm AntDesign để dùng icon đóng

// CheckboxRow giữ nguyên
const CheckboxRow = ({ label, isChecked, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-2.5">
    <MaterialIcons
      name={isChecked ? 'check-box' : 'check-box-outline-blank'}
      size={22}
      color={isChecked ? '#171717' : '#a1a1aa'}
    />
    <Text className="ml-3 text-[15px] text-foreground">{label}</Text>
  </TouchableOpacity>
);

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const FilterModal = ({ isVisible, onClose }: FilterModalProps) => {
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
              <CheckboxRow label="Tuần" isChecked={true} onPress={() => {}} />
              <CheckboxRow label="Tháng" isChecked={false} onPress={() => {}} />
              <CheckboxRow label="Tất cả" isChecked={false} onPress={() => {}} />
            </View>

            {/* Nhóm 2: Chi tiết */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Chi tiết</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
              <CheckboxRow label="Tuần lễ xanh" isChecked={true} onPress={() => {}} />
              <CheckboxRow label="Bài xanh" isChecked={false} onPress={() => {}} />
              <CheckboxRow label="Sự kiện" isChecked={false} onPress={() => {}} />
              <CheckboxRow label="Duyệt bài" isChecked={false} onPress={() => {}} />
            </View>

            {/* Nhóm 3: Khác */}
            <View className="mb-6 border-b border-gray-100 pb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-foreground">Khác</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
              <CheckboxRow label="Trừ điểm" isChecked={false} onPress={() => {}} />
            </View>
          </ScrollView>

          {/* Nút Actions: GIỮ NGUYÊN */}
          <View className="flex-row gap-x-3 pt-5">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 items-center rounded-2xl border border-primary py-4">
              <Text className="text-base font-bold text-primary">Thiết lập lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
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

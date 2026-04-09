import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TimeFilter = () => {
  return (
    <View className="mb-6 px-2">
      {/* Nút chuyển Ngày/Tuần/Tháng */}
      <View className="flex-row rounded-full bg-white p-1 shadow-sm">
        <TouchableOpacity className="flex-1 items-center rounded-full bg-[#65D48D] py-2">
          <Text className="font-bold text-gray-800">Ngày</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="font-medium text-gray-600">Tuần</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-2">
          <Text className="font-medium text-gray-600">Tháng</Text>
        </TouchableOpacity>
      </View>

      {/* Đếm ngược */}
      <View className="mt-4 flex-row justify-between px-4">
        <Text className="font-bold text-white">5 ngày</Text>
        <Text className="font-bold text-white">5 giờ</Text>
        <Text className="font-bold text-white">54 phút</Text>
      </View>
    </View>
  );
};

export default TimeFilter;

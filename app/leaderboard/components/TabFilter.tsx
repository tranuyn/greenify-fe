import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabFilter = () => {
  return (
    <View className="mb-4 flex-row justify-center gap-10">
      <TouchableOpacity className="border-b-2 border-white pb-1">
        <Text className="text-base font-bold text-white">Khu vực</Text>
      </TouchableOpacity>
      <TouchableOpacity className="pb-1">
        <Text className="text-base font-bold text-white/60">Toàn quốc</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabFilter;

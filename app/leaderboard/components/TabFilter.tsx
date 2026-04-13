import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LeaderboardScope } from '@/types/gamification.types';

interface TabFilterProps {
  scope: LeaderboardScope;
  onChangeScope: (scope: LeaderboardScope) => void;
}

const TabFilter = ({ scope, onChangeScope }: TabFilterProps) => {
  const isProvincial = scope === LeaderboardScope.PROVINCIAL;

  return (
    <View className="mb-4 flex-row justify-center gap-10">
      <TouchableOpacity
        onPress={() => onChangeScope(LeaderboardScope.PROVINCIAL)}
        className={isProvincial ? 'border-b-2 border-white pb-1' : 'pb-1'}>
        <Text
          className={
            isProvincial ? 'text-base font-bold text-white' : 'text-base font-bold text-white/60'
          }>
          Khu vực
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeScope(LeaderboardScope.NATIONAL)}
        className={!isProvincial ? 'border-b-2 border-white pb-1' : 'pb-1'}>
        <Text
          className={
            !isProvincial ? 'text-base font-bold text-white' : 'text-base font-bold text-white/60'
          }>
          Toàn quốc
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabFilter;

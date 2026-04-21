import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LeaderboardScope } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

interface TabFilterProps {
  scope: LeaderboardScope;
  onChangeScope: (scope: LeaderboardScope) => void;
}

const TabFilter = ({ scope, onChangeScope }: TabFilterProps) => {
  const { t } = useTranslation();
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
          {t('leaderboard.scope.provincial')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeScope(LeaderboardScope.NATIONAL)}
        className={!isProvincial ? 'border-b-2 border-white pb-1' : 'pb-1'}>
        <Text
          className={
            !isProvincial ? 'text-base font-bold text-white' : 'text-base font-bold text-white/60'
          }>
          {t('leaderboard.scope.national')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabFilter;

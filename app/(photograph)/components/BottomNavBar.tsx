import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export type TabType = 'schedule' | 'scan' | 'nature';

interface Props {
  activeTab: TabType;
}

const BottomNavBar: React.FC<Props> = ({ activeTab }) => {
  const getButtonClass = (tab: TabType) => {
    const isActive = activeTab === tab;
    const bg = isActive ? 'bg-neutral-800/50' : '';
    return `p-5 rounded-full items-center justify-center ${bg}`;
  };

  const handlePress = (tab: TabType) => {
    if (tab === 'schedule') router.replace('/(photograph)/schedule');
    if (tab === 'nature') router.replace('/(photograph)/nature');
    if (tab === 'scan') router.replace('/map');
  };

  return (
    <View className="w-full items-center">
      <View className="w-full flex-row items-center justify-between rounded-full border border-neutral-500 bg-neutral-900/50 px-2 py-1 shadow-xl">
        <TouchableOpacity
          onPress={() => handlePress('schedule')}
          className={getButtonClass('schedule')}>
          <Ionicons
            name="apps-outline"
            size={26}
            color={activeTab === 'schedule' ? '#22c55e' : 'white'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('scan')} className={getButtonClass('scan')}>
          <Ionicons
            name="scan-outline"
            size={26}
            color={activeTab === 'scan' ? '#22c55e' : 'white'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress('nature')}
          className={getButtonClass('nature')}>
          <MaterialCommunityIcons
            name="flower-tulip-outline"
            size={28}
            color={activeTab === 'nature' ? '#22c55e' : 'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavBar;

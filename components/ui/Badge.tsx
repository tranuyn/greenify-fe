import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'pending' | 'approved';
}

export const Badge = ({ label, variant = 'pending' }: BadgeProps) => {
  const bgClass =
    variant === 'pending' ? 'bg-[var(--status-pending)]' : 'bg-[var(--status-approved)]';

  return (
    <View className={`${bgClass} rounded-md px-3 py-1`}>
      <Text className="font-inter-bold text-xs text-[var(--status-text)]">{label}</Text>
    </View>
  );
};

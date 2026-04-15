import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Text } from '@/components/ui/Text';

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
  zIndex?: number;
};

export function FormSection({ title, children, zIndex }: FormSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <View 
      className="mb-4 rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-card"
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      <TouchableOpacity
        onPress={() => setCollapsed((p) => !p)}
        className="flex-row items-center justify-between px-4 py-3.5"
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: collapsed ? 16 : 0,
          borderBottomRightRadius: collapsed ? 16 : 0,
        }}
        activeOpacity={0.85}>
        <Text className="font-inter-bold text-base text-foreground">{title}</Text>
        <Feather name={collapsed ? 'chevron-down' : 'chevron-up'} size={18} color="#9ca3af" />
      </TouchableOpacity>
      {!collapsed && (
        <View 
          className="gap-4 px-4 pb-4 bg-white dark:bg-card"
          style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
        >
          {children}
        </View>
      )}
    </View>
  );
}

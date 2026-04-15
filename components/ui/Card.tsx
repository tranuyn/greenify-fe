import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ className, children, ...props }: ViewProps) => {
  return (
    <View
      className={`rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-sm ${className}`}
      {...props}>
      {children}
    </View>
  );
};

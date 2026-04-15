import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

export interface SearchBarProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  iconColor?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  containerClassName = '',
  inputClassName = '',
  iconColor,
  ...props
}: SearchBarProps) {
  const colors = useThemeColor();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const defaultIconColor = iconColor || colors.neutral500;

  return (
    <View
      className={`flex-row items-center rounded-2xl bg-primary-50 px-4 py-1 dark:bg-card ${containerClassName}`}>
      <Feather name="search" size={18} color={defaultIconColor} />
      <TextInput
        className={`ml-3 flex-1 font-inter text-sm text-foreground ${inputClassName}`}
        placeholderTextColor={defaultIconColor}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        {...props}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={8}>
          <Feather name="x-circle" size={18} color={defaultIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

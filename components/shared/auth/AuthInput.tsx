import React, { forwardRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { Text } from 'components/ui/Text';

export type AuthInputProps = TextInputProps & {
  label: string;
  errorText?: string;
  containerClassName?: string;
  secureToggle?: {
    visible: boolean;
    onToggle: () => void;
  };
};

// Bọc forwardRef để react-hook-form có thể điều khiển được input
export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  (
    {
      label,
      errorText,
      containerClassName = '',
      secureToggle,
      className = '',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(errorText);
    const [isFocused, setIsFocused] = useState(false);

    // Bố cục màu viền: Lỗi (Đỏ) -> Đang gõ (Xanh đậm) -> Bình thường (Xanh nhạt)
    const borderColor = hasError
      ? 'border-rose-400'
      : isFocused
        ? 'border-primary-500' // Đổi sang màu primary đậm hơn của bạn (VD: primary-500)
        : 'border-primary-100';

    return (
      <View className={containerClassName}>
        <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">{label}</Text>

        <View
          className={`flex-row items-center rounded-xl border bg-primary-50 px-3 transition-colors ${borderColor}`}>
          <TextInput
            ref={ref} // Truyền ref vào đây
            placeholderTextColor="#9ca3af"
            className={`flex-1 py-3 font-inter text-base text-foreground ${className}`}
            // Bắt sự kiện focus/blur để đổi màu, đồng thời vẫn gọi hàm từ bên ngoài truyền vào
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {secureToggle ? (
            <Pressable onPress={secureToggle.onToggle} hitSlop={8}>
              <Feather name={secureToggle.visible ? 'eye-off' : 'eye'} size={18} color="#4b5563" />
            </Pressable>
          ) : null}
        </View>

        {hasError ? <Text className="mt-1 text-xs text-rose-600">{errorText}</Text> : null}
      </View>
    );
  }
);

// Khai báo tên Component để React DevTools dễ debug
AuthInput.displayName = 'AuthInput';

import React, { forwardRef } from 'react';
import { Pressable, ActivityIndicator, View, PressableProps } from 'react-native';
import { Text } from './Text';

export interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconLeft?: React.ReactNode; // Hỗ trợ nhét Icon bên trái
  iconRight?: React.ReactNode; // Hỗ trợ nhét Icon bên phải
  className?: string;
  textClassName?: string;
}

// Dùng forwardRef là Best Practice bắt buộc để Component nhận được Ref từ cha truyền xuống
export const Button = forwardRef<View, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      iconLeft,
      iconRight,
      className = '',
      textClassName = '',
      disabled,
      ...props // Hứng toàn bộ các Props mặc định của Pressable (onPress, onLongPress...)
    },
    ref
  ) => {
    // 1. Base Styles
    const baseContainer =
      'flex-row items-center justify-center rounded-xl active:opacity-80 transition-all';

    // 2. Size Styles
    const sizeStyles = {
      sm: 'py-2 px-4',
      md: 'py-3.5 px-6',
      lg: 'py-4 px-8',
    };

    // 3. Variant Styles
    const variantStyles = {
      primary: {
        container: 'bg-primary-600',
        text: 'text-white font-inter-bold',
        spinner: '#ffffff',
      },
      secondary: {
        container: 'bg-primary-100',
        text: 'text-primary-800 font-inter-bold',
        spinner: '#166534',
      },
      outline: {
        container: 'bg-transparent border-2 border-primary-600',
        text: 'text-primary-600 font-inter-bold',
        spinner: '#16a34a',
      },
      ghost: {
        container: 'bg-transparent',
        text: 'text-primary-600 font-inter-medium',
        spinner: '#16a34a',
      },
      danger: {
        container: 'bg-rose-50',
        text: 'text-rose-500 font-inter-medium',
        spinner: '#f43f5e',
      },
    };

    const currentVariant = variantStyles[variant];
    const isActuallyDisabled = disabled || isLoading;

    return (
      <Pressable
        ref={ref}
        disabled={isActuallyDisabled}
        // Gộp class lại với nhau, xử lý luôn trạng thái disabled mờ đi
        className={`
          ${baseContainer} 
          ${sizeStyles[size]} 
          ${currentVariant.container} 
          ${isActuallyDisabled ? 'opacity-50' : ''} 
          ${className}
        `}
        {...props}>
        {/* Render Spinner hoặc Icon Trái */}
        {isLoading ? (
          <ActivityIndicator color={currentVariant.spinner} className="mr-2" size="small" />
        ) : (
          iconLeft && <View className="mr-2">{iconLeft}</View>
        )}

        {/* Render Text */}
        <Text className={`${currentVariant.text} ${textClassName}`}>
          {isLoading ? 'Đang xử lý...' : title}
        </Text>

        {/* Render Icon Phải (ẩn đi nếu đang loading để không bị rối) */}
        {!isLoading && iconRight && <View className="ml-2">{iconRight}</View>}
      </Pressable>
    );
  }
);

// Khai báo displayName cho forwardRef (quy tắc của ESLint)
Button.displayName = 'Button';

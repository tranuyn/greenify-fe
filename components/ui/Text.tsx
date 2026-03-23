import { Text as RNText, TextProps } from 'react-native';

export function Text({ className = '', ...props }: TextProps) {
  return (
    <RNText
      // Mặc định luôn dùng font-sans (Inter)
      className={`font-sans text-foreground ${className}`}
      {...props}
    />
  );
}
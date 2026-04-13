import { Text as RNText, TextProps } from 'react-native';

export function Text({ className = '', ...props }: TextProps) {
  // Kiểm tra xem className truyền vào đã có cấu hình font chưa (ví dụ: font-inter-bold)
  const hasFont = className.includes('font-');

  return (
    <RNText
      // Nếu chưa có font thì dùng mặc định !font-inter, nếu có rồi thì nhường chỗ cho font mới
      className={`${hasFont ? '' : '!font-inter'} text-foreground ${className}`}
      {...props}
    />
  );
}
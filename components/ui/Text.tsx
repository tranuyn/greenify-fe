import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
  useDefaultColor?: boolean;
}

export function Text({ className = '', useDefaultColor = true, ...props }: TextProps) {
  // Kiểm tra xem className truyền vào đã có cấu hình font chưa (ví dụ: font-inter-bold)
  const hasFont = className.includes('font-');

  return (
    <RNText
      // Phân tách rõ ràng: font và màu mặc định được kiểm soát qua bool prop, thay vì check chuỗi dễ sai sót.
      className={`${hasFont ? '' : '!font-inter'} ${useDefaultColor ? 'text-foreground' : ''} ${className}`}
      {...props}
    />
  );
}

import { useColorScheme } from 'nativewind';

export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Trả về bộ mã HEX chuẩn khớp 100% với global.css của bạn
  return {
    foreground: isDark ? '#ededed' : '#171717',
    background: isDark ? '#0a0a0a' : '#ffffff',
    primary: isDark ? '#4ade80' : '#22c55e',
    primary800: '#166534',
    card: isDark ? '#171717' : '#f3f4f6',
    // (viền, lỗi, cảnh báo...)
  };
}
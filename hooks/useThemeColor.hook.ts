import { useColorScheme } from 'nativewind';

export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    background: isDark ? '#0a0a0a' : '#ffffff',
    foreground: isDark ? '#ededed' : '#171717',
    card: isDark ? '#171717' : '#f3f4f6',

    primary: '#22c55e',

    primary50: '#f0fdf4',
    primary100: '#dcfce7',
    primary200: '#bbf7d0',
    primary300: '#86efac',
    primary400: '#4ade80',
    primary500: '#22c55e',
    primary600: '#16a34a',
    primary700: '#15803d',
    primary800: '#166534',
    primary900: '#14532d',
    primary950: '#052e16',

    // Neutral xám (Dùng cho icon TabBar lúc không active)
    neutral400: isDark ? '#a3a3a3' : '#9ca3af',
    neutral500: isDark ? '#737373' : '#737373',
    border: isDark ? '#262626' : '#e5e7eb',
  };
}

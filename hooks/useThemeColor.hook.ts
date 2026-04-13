import { useColorScheme } from 'nativewind';
import { NEUTRAL_COLORS } from '../constants/color.constant';

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

    // Neutral tones aligned with Tailwind/NativeWind neutral palette
    neutral400: NEUTRAL_COLORS[400],
    neutral500: NEUTRAL_COLORS[500],
    border: isDark ? '#262626' : '#e5e7eb',

    error: isDark ? '#f87171' : '#ef4444',   // (Tailwind red-400 / red-500)
    warning: isDark ? '#fbbf24' : '#f59e0b', // (Tailwind amber-400 / amber-500)
    success: isDark ? '#34d399' : '#10b981',
  };
}

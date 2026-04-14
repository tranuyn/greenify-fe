import { useColorScheme } from 'nativewind';
import { NEUTRAL_COLORS } from '../constants/color.constant';
import { getThemeColors } from '../constants/theme.constant';

export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return {
    background: colors.background,
    foreground: colors.foreground,
    card: colors.card,

    primary: colors.primary,
    onPrimary: colors.onPrimary,
    mutedForeground: colors.mutedForeground,
    border: colors.border,

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
    primaryLight: colors.primaryLight,
    dangerBg: colors.dangerBg,
    dangerText: colors.dangerText,

    error: colors.error,
    warning: colors.warning,
    success: colors.success,
  };
}

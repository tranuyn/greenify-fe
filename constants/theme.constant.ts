export const theme = {
  light: {
    colors: {
      background: '#ffffff',
      foreground: '#171717',
      card: '#f3f4f6',
      border: '#e5e7eb',
      mutedForeground: '#71717a',
      primary: '#22c55e',
      onPrimary: '#ffffff',
      primaryLight: '#dcfce7',
      dangerBg: '#fee2e2',
      dangerText: '#ef4444',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
    },
  },
  dark: {
    colors: {
      background: '#0a0a0a',
      foreground: '#ededed',
      card: '#171717',
      border: '#262626',
      mutedForeground: '#a1a1aa',
      primary: '#22c55e',
      onPrimary: '#000000',
      primaryLight: '#14532d',
      dangerBg: '#7f1d1d',
      dangerText: '#fca5a5',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
    },
  },
} as const;

export type AppThemeMode = 'light' | 'dark';

export const getThemeColors = (colorScheme?: 'light' | 'dark' | null) => {
  const mode: AppThemeMode = colorScheme === 'dark' ? 'dark' : 'light';
  return theme[mode].colors;
};

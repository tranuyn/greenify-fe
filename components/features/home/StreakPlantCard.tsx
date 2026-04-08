import { View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useMyStreak } from '@/hooks/queries/useGamification';
import { useMyPlant } from '@/hooks/queries/useGamification';

/**
 * StreakPlantCard — Card hiển thị streak hiện tại và cây đang trồng.
 * Gộp 2 mục (streak + plant) vào 1 card chia 2 cột.
 */
export function StreakPlantCard() {
  const { t } = useTranslation();
  const colors = useThemeColor();

  const { data: streak, isLoading: isLoadingStreak } = useMyStreak();
  const { data: plant, isLoading: isLoadingPlant } = useMyPlant();

  const isLoading = isLoadingStreak || isLoadingPlant;

  if (isLoading) {
    return (
      <View className="mx-5 h-[140px] items-center justify-center rounded-3xl bg-primary-50 dark:bg-card">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  // Plant progress
  const progressDays = plant?.progress_days ?? 0;
  const totalDays = plant?.seed?.days_to_mature ?? 1;
  const progressPercent = Math.min((progressDays / totalDays) * 100, 100);

  return (
    <View className="mx-5 flex-row overflow-hidden rounded-3xl bg-primary-50 dark:bg-card">
      {/* Left: Streak */}
      <View className="flex-1 items-center justify-center border-r border-primary-200/50 py-5 dark:border-white/5">
        {/* Fire emoji */}
        <View className="mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
          <MaterialCommunityIcons name="fire" size={28} color="#f59e0b" />
        </View>

        {/* Streak count */}
        <Text className="font-inter-bold text-2xl text-foreground">
          {streak?.current_streak ?? 0}
        </Text>
        <Text className="font-inter-medium text-xs text-foreground/60">
          {t('home.streak_days')}
        </Text>
        <Text className="mt-1 font-inter text-[10px] text-foreground/40">
          {t('home.streak_record', { count: streak?.longest_streak ?? 0 })}
        </Text>
      </View>

      {/* Right: Plant */}
      <View className="flex-1 items-center justify-center py-5">
        <View className="mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
          <Feather name="trending-up" size={24} color={colors.primary} />
        </View>

        {plant ? (
          <>
            <Text className="line-clamp-1 font-inter-bold text-sm text-foreground">
              {plant.seed?.name ?? ''}
            </Text>
            <Text className="mt-0.5 font-inter text-xs text-primary-700 dark:text-primary-400">
              {t('home.plant_progress', {
                current: progressDays,
                total: totalDays,
              })}
            </Text>

            {/* Progress bar */}
            <View className="mt-2 h-1.5 w-4/5 overflow-hidden rounded-full bg-primary-200/50 dark:bg-primary-800/30">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </>
        ) : (
          <>
            <Text className="font-inter-medium text-sm text-foreground/60">
              {t('home.plant_no_plant')}
            </Text>
            <Feather name="plus-circle" size={16} color={colors.neutral400} style={{ marginTop: 4 }} />
          </>
        )}
      </View>
    </View>
  );
}

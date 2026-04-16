import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from '@/components/ui/Card';
import { IMAGES } from '@/constants/linkMedia';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { usePlantDailyLogs, useMyStreak } from '@/hooks/queries/useGamification';
import { PlantStatus } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

const ProgressSection = () => {
  const { t } = useTranslation();
  const { data: authData } = useCurrentUser();
  const userId = authData?.user?.id;

  const STAGE_LABELS: Record<PlantStatus, string> = {
    [PlantStatus.SEED]: t('calendar.progress.stage.seed'),
    [PlantStatus.SPROUT]: t('calendar.progress.stage.sprout'),
    [PlantStatus.GROWING]: t('calendar.progress.stage.growing'),
    [PlantStatus.BLOOMING]: t('calendar.progress.stage.blooming'),
    [PlantStatus.MATURED]: t('calendar.progress.stage.matured'),
  };

  const todayLogParams = useMemo(
    () => ({
      log_date: new Date().toISOString().slice(0, 10),
      user_id: userId,
    }),
    [userId]
  );

  const { data: streak } = useMyStreak();
  const { data: dailyLogs = [] } = usePlantDailyLogs(todayLogParams);

  const todayLog = useMemo(() => {
    if (!userId || dailyLogs.length === 0) return null;
    return dailyLogs[0];
  }, [dailyLogs, userId]);

  const currentStage = todayLog?.stage
    ? STAGE_LABELS[todayLog.stage]
    : t('calendar.progress.stage.not_started');
  const currentSeedName =
    todayLog?.plant_progress?.seed?.name ?? t('calendar.progress.no_seed_selected');
  const currentStreak = streak?.current_streak ?? 0;

  return (
    <View className="mt-[-110px] px-4">
      <Card className="flex-row items-center rounded-3xl">
        {/* Avatar/Icon đã được gắn Vector Icon */}
        <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--primary-light)]">
          <Image
            source={{ uri: todayLog?.image_url || IMAGES.treeAvatar }}
            className="h-10 w-10 "
          />
        </View>

        {/* Info */}
        <View className="ml-4 flex-1">
          <View className="mb-3 flex-row items-start">
            <Text className="font-interW text-[var(--foreground)]">
              {t('calendar.progress.stage_label')}
            </Text>
            <Text className="flex-1 font-inter text-sm text-[var(--foreground)]">
              {currentStage} - {currentSeedName}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
            <View className="h-full w-1/4 rounded-full bg-[var(--primary)]" />
          </View>

          <View className="mb-3 flex-row">
            <Text className="font-interW text-[var(--foreground)]">
              {t('calendar.progress.green_streak_label')}
            </Text>
            <Text className="font-inter text-sm text-[var(--foreground)]">{currentStreak}</Text>
          </View>
        </View>
      </Card>

      {/* Warning Banner */}
      <View className="mt-10 items-center rounded-lg bg-[var(--danger-bg)] p-2">
        <Text className="font-inter text-sm text-foreground">
          {t('calendar.progress.today_no_action')}
        </Text>
      </View>
    </View>
  );
};

export default ProgressSection;

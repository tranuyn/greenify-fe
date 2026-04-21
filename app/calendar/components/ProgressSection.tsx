import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card } from '@/components/ui/Card';
import { IMAGES } from '@/constants/linkMedia';
import { useMyPlant, useMyStreak } from '@/hooks/queries/useGamification';
import { PlantStatus } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

const ProgressSection = () => {
  const { t } = useTranslation();

  const STAGE_LABELS: Record<PlantStatus, string> = {
    [PlantStatus.SEED]: t('calendar.progress.stage.seed', 'Hạt giống'),
    [PlantStatus.SPROUT]: t('calendar.progress.stage.sprout', 'Mầm'),
    [PlantStatus.GROWING]: t('calendar.progress.stage.growing', 'Đang lớn'),
    [PlantStatus.BLOOMING]: t('calendar.progress.stage.blooming', 'Nở hoa'),
    [PlantStatus.MATURED]: t('calendar.progress.stage.matured', 'Trưởng thành'),
  };

  const { data: streak } = useMyStreak();
  const { data: myPlant } = useMyPlant();

  const currentStage = myPlant?.currentStage
    ? STAGE_LABELS[myPlant.currentStage]
    : t('calendar.progress.stage.not_started', 'Chưa bắt đầu');

  const currentSeedName =
    myPlant?.seedName ?? t('calendar.progress.no_seed_selected', 'Chưa chọn hạt giống');
  const currentStreak = streak?.currentStreak ?? 0;
  let progressPercent = 0;
  if (myPlant?.daysToMature && streak?.currentStreak != null) {
    progressPercent = Math.min(Math.max((currentStreak / myPlant.daysToMature) * 100, 0), 100);
  } else {
    progressPercent = myPlant?.percentComplete ?? 0;
  }
  const currentImageUrl = myPlant?.currentStageImageUrl || IMAGES.treeAvatar;

  console.log('Current Plant Data:', myPlant);
  console.log('Current Streak Data:', streak);

  return (
    <View className="mt-[-110px] px-4">
      <Card className="flex-row items-center rounded-3xl">
        {/* Avatar/Icon đã được gắn Vector Icon */}
        <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--primary-light)]">
          <Image source={{ uri: currentImageUrl }} className="h-10 w-10 " />
        </View>

        {/* Info */}
        <View className="ml-4 flex-1">
          <View className="mb-3 flex-row items-start">
            <Text className="font-interW text-[var(--foreground)]">
              {t('calendar.progress.stage_label', 'Giai đoạn')}
            </Text>
            <Text className="flex-1 font-inter text-sm text-[var(--foreground)]">
              {currentStage} - {currentSeedName}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
            <View
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` as `${number}%` }}
            />
          </View>

          <View className="mb-3 flex-row">
            <Text className="font-interW text-[var(--foreground)]">
              {t('calendar.progress.green_streak_label', 'Số ngày xanh')}
            </Text>
            <Text className="font-inter text-sm text-[var(--foreground)]">{currentStreak}</Text>
          </View>
        </View>
      </Card>

      {/* Warning Banner */}
      <View className="mt-10 items-center rounded-lg bg-[var(--danger-bg)] p-2">
        <Text className="font-inter text-sm text-foreground">
          {t('calendar.progress.today_no_action', 'Hôm nay chưa có hoạt động')}
        </Text>
      </View>
    </View>
  );
};

export default ProgressSection;

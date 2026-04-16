import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { usePlantDailyLogs, useSeeds } from '@/hooks/queries/useGamification';
import SeedSelectionModal from './SeedSelectionModal';
import { CycleType } from '@/types/gamification.types';
import { useTranslation } from 'react-i18next';

type UtilitiesSectionProps = {
  onPressFarm?: () => void;
};

const UtilitiesSection = ({ onPressFarm }: UtilitiesSectionProps) => {
  const { t } = useTranslation();
  const [isSeedModalVisible, setIsSeedModalVisible] = useState(false);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);

  const { data: authData } = useCurrentUser();
  const userId = authData?.user?.id;

  const { data: seeds = [], isLoading: isSeedsLoading } = useSeeds();

  const todayLogParams = useMemo(
    () => ({
      log_date: new Date().toISOString().slice(0, 10),
      user_id: userId,
    }),
    [userId]
  );

  const { data: todayLogs = [] } = usePlantDailyLogs(todayLogParams);

  const longTermSeeds = useMemo(
    () => seeds.filter((seed) => seed.cycle_type === CycleType.LONG_TERM),
    [seeds]
  );

  const shortTermSeeds = useMemo(
    () => seeds.filter((seed) => seed.cycle_type === CycleType.SHORT_TERM),
    [seeds]
  );

  const currentSelectedSeedId = useMemo(() => {
    if (!userId || todayLogs.length === 0) return null;

    return todayLogs[0]?.plant_progress?.seed_id || null;
  }, [todayLogs, userId]);

  const effectiveSelectedSeedId = selectedSeedId ?? currentSelectedSeedId;

  const hasGrowingSeed = todayLogs.length > 0;

  const handleCloseSeedModal = () => {
    setIsSeedModalVisible(false);
    setSelectedSeedId(null);
  };

  return (
    <>
      <Text className="mb-3 font-inter-bold text-[var(--foreground)]">
        {t('calendar.utilities.title')}
      </Text>
      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={() => setIsSeedModalVisible(true)}
          className="mr-2 flex-1 flex-row items-center justify-center rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-3">
          <Text className="mr-3 font-inter-bold text-[var(--foreground)]">
            {t('calendar.utilities.planting')}
          </Text>
          <Image source={{ uri: IMAGES.saveWater }} className="h-6 w-6" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressFarm}
          className="ml-2 flex-1 flex-row items-center justify-center rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-3">
          <Text className="mr-3 font-inter-bold text-[var(--foreground)]">
            {t('calendar.utilities.farm')}
          </Text>
          <Image source={{ uri: IMAGES.house }} className="h-6 w-6" />
        </TouchableOpacity>
      </View>

      <SeedSelectionModal
        visible={isSeedModalVisible}
        onClose={handleCloseSeedModal}
        selectedSeedId={effectiveSelectedSeedId}
        onSelectSeed={setSelectedSeedId}
        longTermSeeds={longTermSeeds}
        shortTermSeeds={shortTermSeeds}
        isSeedsLoading={isSeedsLoading}
        hasGrowingSeed={hasGrowingSeed}
      />
    </>
  );
};

export default UtilitiesSection;

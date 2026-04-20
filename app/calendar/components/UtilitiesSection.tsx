import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useMyPlant, useSeeds } from '@/hooks/queries/useGamification';
import { useChangeCurrentSeed } from '@/hooks/mutations/useGamification';
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
  const userId = authData?.id;

  const { data: seeds = [], isLoading: isSeedsLoading } = useSeeds();

  const { data: myPlant } = useMyPlant();
  const { mutate: changeCurrentSeed, isPending: isChangingSeed } = useChangeCurrentSeed();

  const easySeeds = useMemo(
    () => seeds.filter((seed) => seed.cycleType === CycleType.EASY),
    [seeds]
  );

  const mediumSeeds = useMemo(
    () => seeds.filter((seed) => seed.cycleType === CycleType.MEDIUM),
    [seeds]
  );

  const hardSeeds = useMemo(
    () => seeds.filter((seed) => seed.cycleType === CycleType.HARD),
    [seeds]
  );

  const effectiveSelectedSeedId = selectedSeedId ?? myPlant?.seedId ?? null;

  const hasGrowingSeed = Boolean(myPlant);

  const handleCloseSeedModal = () => {
    setIsSeedModalVisible(false);
    setSelectedSeedId(null);
  };

  const handlePlantSeed = () => {
    if (!effectiveSelectedSeedId) return;

    changeCurrentSeed(effectiveSelectedSeedId, {
      onSuccess: () => {
        handleCloseSeedModal();
      },
    });
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
        easySeeds={easySeeds}
        mediumSeeds={mediumSeeds}
        hardSeeds={hardSeeds}
        isSeedsLoading={isSeedsLoading}
        hasGrowingSeed={hasGrowingSeed}
        isPlanting={isChangingSeed}
        onPlantSeed={handlePlantSeed}
      />
    </>
  );
};

export default UtilitiesSection;

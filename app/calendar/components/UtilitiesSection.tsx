import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { useMyPlant, useSeeds } from '@/hooks/queries/useGamification';

const LONG_TERM_SEED_IDS = ['seed-003'];

const SEED_ICONS = ['🌸', '🌴', '🍁', '🌲', '🌻', '🪷', '🌹', '🌺'];

const UtilitiesSection = () => {
  const [isSeedModalVisible, setIsSeedModalVisible] = useState(false);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(null);

  const { data: seeds = [], isLoading: isSeedsLoading } = useSeeds();
  const { data: myPlant } = useMyPlant();

  const longTermSeeds = useMemo(
    () => seeds.filter((seed) => LONG_TERM_SEED_IDS.includes(seed.id) || seed.days_to_mature >= 30),
    [seeds]
  );

  const shortTermSeeds = useMemo(
    () => seeds.filter((seed) => !LONG_TERM_SEED_IDS.includes(seed.id) && seed.days_to_mature < 30),
    [seeds]
  );

  const hasGrowingSeed = Boolean(myPlant && myPlant.status !== 'MATURED');

  const handleCloseSeedModal = () => {
    setIsSeedModalVisible(false);
    setSelectedSeedId(null);
  };

  const renderSeedItem = (seed: (typeof seeds)[number], index: number) => {
    const isSelected = selectedSeedId === seed.id;
    return (
      <TouchableOpacity
        key={seed.id}
        onPress={() => setSelectedSeedId(seed.id)}
        className={`mb-2 flex-row items-center rounded-lg px-2 py-2 ${isSelected ? 'bg-[var(--primary-light)]/30 border border-[var(--primary)]' : ''}`}>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary-light)]">
          <Text className="text-xl">{SEED_ICONS[index % SEED_ICONS.length]}</Text>
        </View>
        <View className="ml-3">
          <Text className="font-inter-medium text-base text-[var(--foreground)]">{seed.name}</Text>
          <Text className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Thời gian: {seed.days_to_mature} ngày
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Text className="mb-3 font-inter-bold text-[var(--foreground)]">Tiện ích</Text>
      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={() => setIsSeedModalVisible(true)}
          className="mr-2 flex-1 flex-row items-center justify-center rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-3">
          <Text className="mr-3 font-inter-bold text-[var(--foreground)]">Gieo trồng</Text>
          <Image source={{ uri: IMAGES.saveWater }} className="h-6 w-6" />
        </TouchableOpacity>

        <TouchableOpacity className="ml-2 flex-1 flex-row items-center justify-center rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-3">
          <Text className="mr-3 font-inter-bold text-[var(--foreground)]">Nông trại</Text>
          <Image source={{ uri: IMAGES.house }} className="h-6 w-6" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isSeedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSeedModal}>
        <View className="flex-1 items-center justify-center bg-black/40 px-4">
          <View className="max-h-[85%] w-full rounded-3xl bg-background px-3 pb-4 pt-3">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="h-6 w-6" />
              <Text className="font-inter-semibold text-xl text-[var(--foreground)]">
                Chọn giống cây trồng
              </Text>
              <TouchableOpacity onPress={handleCloseSeedModal}>
                <Feather name="x" size={20} color="#171717" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="mb-2 font-inter-semibold text-lg text-[var(--foreground)]">
                Cây dài hạn
              </Text>
              {longTermSeeds.map(renderSeedItem)}

              <Text className="mb-2 mt-3 font-inter-semibold text-lg text-[var(--foreground)]">
                Cây ngắn hạn
              </Text>
              {shortTermSeeds.map((seed, index) =>
                renderSeedItem(seed, index + longTermSeeds.length)
              )}

              {isSeedsLoading && (
                <Text className="py-2 text-sm text-[var(--muted-foreground)]">
                  Đang tải giống cây...
                </Text>
              )}
            </ScrollView>

            {hasGrowingSeed && (
              <View className="mt-3 rounded-lg bg-red-100 px-3 py-2">
                <Text className="text-center text-base text-[var(--foreground)]">
                  Có hạt giống đang phát triển
                </Text>
                <Text className="mt-1 text-center text-base text-[var(--foreground)]">
                  Nếu tiếp tục tiến trình hạt giống hiện tại sẽ mất
                </Text>
                <Text className="text-center font-inter-bold text-xl text-[var(--foreground)]">
                  Bạn có chắc chắn muốn trồng mới?
                </Text>
              </View>
            )}

            <View className="mt-3 flex-row items-center gap-2">
              <TouchableOpacity
                onPress={handleCloseSeedModal}
                className="flex-1 items-center rounded-lg bg-[var(--primary-light)] py-3">
                <Text className="font-inter-semibold text-3xl text-[var(--foreground)]">Thoát</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCloseSeedModal}
                disabled={!selectedSeedId}
                className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${selectedSeedId ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}>
                <Text
                  className={`mr-2 font-inter-semibold text-3xl ${selectedSeedId ? 'text-[var(--on-primary)]' : 'text-[var(--muted-foreground)]'}`}>
                  Trồng cây
                </Text>
                <Image source={{ uri: IMAGES.recycle }} className="h-6 w-6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UtilitiesSection;

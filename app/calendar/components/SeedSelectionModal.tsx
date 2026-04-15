import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { Seed } from 'types/gamification.types';
import { url } from 'zod';

// --- BẮT ĐẦU: COMPONENT MODAL LƯU Ý (THÊM MỚI) ---
const PlantInfoModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  // Dữ liệu giả lập cho Chu kỳ phát triển (Bạn có thể thay icon bằng Image thật sau)
  const growthStages = [
    { id: 1, name: 'Hạt giống', url: IMAGES.saveWater },
    { id: 2, name: 'Nảy mầm', url: IMAGES.growingPlant },
    { id: 4, name: 'Phát triển', url: IMAGES.leafPlant },
    { id: 5, name: 'Trưởng thành', url: IMAGES.palmTree },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="max-h-[90%] w-full rounded-3xl bg-background px-4 pb-6 pt-4">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Feather name="info" size={24} color="#171717" />
            <Text className="font-inter-semibold text-lg text-[var(--foreground)]">Lưu ý</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Feather name="x" size={24} color="#171717" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Phần 1: Chu kỳ phát triển */}
            <Text className="mb-4 font-inter-bold text-base text-[var(--foreground)]">
              Chu kỳ phát triển
            </Text>
            <View className="mb-6 flex-row justify-between px-1">
              {growthStages.map((stage) => (
                <View key={stage.id} className="items-center">
                  <View className="mb-1 h-12 w-12 items-center justify-center rounded-full border border-green-400 bg-green-50">
                    <Image source={{ uri: stage.url }} className="h-6 w-6" />
                  </View>
                  <Text className="text-center text-xs text-[var(--foreground)]">{stage.name}</Text>
                </View>
              ))}
            </View>

            {/* Phần 2: Cây ngắn hạn */}
            <View className="mb-6">
              <Text className="mb-2 font-inter-bold text-base text-[var(--foreground)]">
                🌱 Cây ngắn hạn
              </Text>
              <Text className="mb-2 text-sm text-[var(--foreground)]">
                ⚡ Phù hợp cho người muốn thấy kết quả sớm
              </Text>
              <Text className="mb-2 text-sm text-[var(--foreground)]">Lưu ý khi gieo trồng:</Text>
              <View className="pl-2">
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Cần chăm sóc mỗi ngày để cây phát triển đúng tiến độ
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Bỏ lỡ 1-2 ngày có thể khiến cây chậm lớn
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Thời gian trưởng thành nhanh (7 ngày)
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Phần thưởng nhỏ nhưng nhận nhanh và đều đặn 🎁
                </Text>
              </View>
            </View>

            {/* Phần 3: Cây dài hạn */}
            <View className="mb-4">
              <Text className="font-inter-bold text-base text-[var(--foreground)]">
                🌳 Cây dài hạn
              </Text>
              <Text className="mb-1 text-sm text-[var(--foreground)]">
                🌿 Dành cho người kiên trì & muốn phần thưởng lớn
              </Text>
              <Text className="mb-1 text-sm text-[var(--foreground)]">Lưu ý khi gieo trồng:</Text>
              <View className="pl-2">
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Không cần chăm sóc liên tục mỗi ngày, nhưng nên quay lại thường xuyên
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Có thể chịu được việc bỏ lỡ vài ngày, nhưng sẽ giảm tốc độ phát triển
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Thời gian trưởng thành dài (30 ngày)
                </Text>
                <Text className="mb-1 text-sm text-[var(--foreground)]">
                  • Phần thưởng lớn hơn khi cây trưởng thành 🎉
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
// --- KẾT THÚC: COMPONENT MODAL LƯU Ý ---

type SeedSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedSeedId: string | null;
  onSelectSeed: (seedId: string) => void;
  longTermSeeds: Seed[];
  shortTermSeeds: Seed[];
  isSeedsLoading: boolean;
  hasGrowingSeed: boolean;
};

const SeedSelectionModal = ({
  visible,
  onClose,
  selectedSeedId,
  onSelectSeed,
  longTermSeeds,
  shortTermSeeds,
  isSeedsLoading,
  hasGrowingSeed,
}: SeedSelectionModalProps) => {
  // STATE MỚI: Dùng để điều khiển Modal Lưu ý
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  const renderSeedItem = (seed: Seed) => {
    const isSelected = selectedSeedId === seed.id;

    return (
      <TouchableOpacity
        key={seed.id}
        onPress={() => onSelectSeed(seed.id)}
        className={`mb-2 flex-row items-center rounded-lg px-2 py-2 ${isSelected ? 'bg-[var(--primary-light)]/30 border border-[var(--primary)]' : ''}`}>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary-light)]">
          <Image source={{ uri: seed.stage4_image_url }} className="h-7 w-7" />
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
      <Modal
        visible={visible && !isInfoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}>
        <View className="flex-1 items-center justify-center bg-black/40 px-4">
          <View className="max-h-[85%] w-full rounded-3xl bg-background px-3 pb-4 pt-3">
            <View className="mb-3 flex-row items-center justify-between px-5 py-4">
              {/* ĐÃ SỬA: Thay vì gọi onClose, giờ sẽ mở Modal Lưu ý */}
              <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                <Feather name="info" size={20} color="#171717" />
              </TouchableOpacity>

              <Text className="font-inter-semibold text-xl text-[var(--foreground)]">
                Chọn giống cây trồng
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={20} color="#171717" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-3">
              <Text className="mb-2 font-inter-semibold text-lg text-[var(--foreground)]">
                Cây dài hạn
              </Text>
              {longTermSeeds.map((seed) => renderSeedItem(seed))}

              <Text className="mb-2 mt-3 font-inter-semibold text-lg text-[var(--foreground)]">
                Cây ngắn hạn
              </Text>
              {shortTermSeeds.map((seed) => renderSeedItem(seed))}

              {isSeedsLoading && (
                <Text className="py-2 text-sm text-[var(--muted-foreground)]">
                  Đang tải giống cây...
                </Text>
              )}
            </ScrollView>

            {hasGrowingSeed && (
              <View className="mt-3 rounded-lg bg-red-100 px-3 py-2">
                <Text className="text-center text-sm text-[var(--foreground)]">
                  Có hạt giống đang phát triển
                </Text>
                <Text className="my-1 text-center text-sm text-[var(--foreground)]">
                  Nếu tiếp tục tiến trình hạt giống hiện tại sẽ mất
                </Text>
                <Text className="text-center font-inter-bold text-sm text-[var(--foreground)]">
                  Bạn có chắc chắn muốn trồng mới?
                </Text>
              </View>
            )}

            <View className="mt-3 flex-row items-center gap-2">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 items-center rounded-lg bg-[var(--primary-light)] py-4">
                <Text className="font-inter-semibold text-[var(--foreground)]">Thoát</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                disabled={!selectedSeedId}
                className={`flex-1 flex-row items-center justify-center rounded-lg py-4 ${selectedSeedId ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}>
                <Text
                  className={`mr-1 font-inter-semibold text-[var(--foreground)] ${selectedSeedId ? 'text-[var(--on-primary)]' : 'text-[var(--muted-foreground)]'}`}>
                  Trồng cây
                </Text>
                {/* Đảm bảo IMAGES.growingPlant đã được import hợp lệ */}
                <Image source={{ uri: IMAGES?.growingPlant || '' }} className="h-6 w-6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* RENDER MODAL LƯU Ý NẰM ĐÈ LÊN TRÊN */}
      <PlantInfoModal
        visible={visible && isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
      />
    </>
  );
};

export default SeedSelectionModal;

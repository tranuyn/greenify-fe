import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useGardenArchives } from '@/hooks/queries/useGamification';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

type MyGardenArchiveProps = {
  onBack: () => void;
};

const MyGardenArchive = ({ onBack }: MyGardenArchiveProps) => {
  const { data: archives = [], isLoading } = useGardenArchives();
  const colors = useThemeColor();

  return (
    <View className="mt-6 px-4 pb-24">
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)]">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="font-inter-bold text-lg text-[var(--foreground)]">Bộ sưu tập</Text>
        <View className="h-9 w-9" />
      </View>

      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator />
          <Text className="mt-2 text-sm text-[var(--muted-foreground)]">Đang tải nông trại...</Text>
        </View>
      ) : null}

      {!isLoading && archives.length === 0 ? (
        <View className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-5">
          <Text className="text-center text-sm text-[var(--muted-foreground)]">
            Bạn chưa có cây nào trong kho lưu trữ.
          </Text>
        </View>
      ) : null}

      {!isLoading ? (
        <View className="flex-row flex-wrap">
          {archives.map((archive) => (
            <View key={archive.id} className="mb-3 w-1/5">
              <View className=" h-12 w-12 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary-light)]">
                {archive.seed?.stage4_image_url ? (
                  <Image source={{ uri: archive.seed.stage4_image_url }} className="h-8 w-8" />
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default MyGardenArchive;

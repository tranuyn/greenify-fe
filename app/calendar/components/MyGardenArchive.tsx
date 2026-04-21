import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useGardenArchives } from '@/hooks/queries/useGamification';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useTranslation } from 'react-i18next';

type MyGardenArchiveProps = {
  onBack: () => void;
};

const MyGardenArchive = ({ onBack }: MyGardenArchiveProps) => {
  const { data: archives = [], isLoading } = useGardenArchives();
  const colors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View className="mt-6 px-4 pb-24">
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)]">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="font-inter-bold text-lg text-[var(--foreground)]">
          {t('calendar.archive.title', 'Kho lưu trữ khu vườn')}
        </Text>
        <View className="h-9 w-9" />
      </View>

      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator />
          <Text className="mt-2 text-sm text-[var(--muted-foreground)]">
            {t('calendar.archive.loading', 'Đang tải...')}
          </Text>
        </View>
      ) : null}

      {!isLoading && archives.length === 0 ? (
        <View className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-5">
          <Text className="text-center text-sm text-[var(--muted-foreground)]">
            {t('calendar.archive.empty', 'Chưa có dữ liệu')}
          </Text>
        </View>
      ) : null}

      {!isLoading ? (
        <View className="flex-row flex-wrap">
          {archives.map((archive) => (
            <View key={archive.id} className="mb-3 w-1/5">
              <View className=" h-12 w-12 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary-light)]">
                {archive.seed?.stage4ImageUrl ? (
                  <Image source={{ uri: archive.seed.stage4ImageUrl }} className="h-8 w-8" />
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

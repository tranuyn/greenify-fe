import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { usePredictEvent } from '@/hooks/mutations/useEvents';
import type { EventType, PredictEventResponse } from '@/types/community.types';

export type PredictEventProps = {
  visible: boolean;
  onClose: () => void;
  province: string;
  startTime: string;
  endTime: string;
  minParticipants: number;
  expectedParticipants: number;
  eventType: EventType;
  eventTypeLabel: string;
  title?: string;
  locationAddress?: string;
  participationConditions?: string;
};

function formatDateTime(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const date = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
  const time = `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  return `${time} · ${date}`;
}

const CONCLUSION_LABELS: Record<PredictEventResponse['conclusion'], string> = {
  HIGHLY_FEASIBLE: 'Rất khả thi',
  FEASIBLE: 'Khả thi',
  NEEDS_ADJUSTMENT: 'Cần tối ưu',
  UNFEASIBLE: 'Khó khả thi',
};

export default function PredictEvent({
  visible,
  onClose,
  province,
  startTime,
  endTime,
  minParticipants,
  expectedParticipants,
  eventType,
  eventTypeLabel,
  title,
  locationAddress,
  participationConditions,
}: PredictEventProps) {
  const colors = useThemeColor();
  const predictMutation = usePredictEvent();

  useEffect(() => {
    if (!visible) return;

    predictMutation.mutate({
      province,
      startTime,
      endTime,
      minParticipants,
      expectedParticipants,
      eventType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, province, startTime, endTime, minParticipants, expectedParticipants, eventType]);

  const result = predictMutation.data;
  const isLoading = predictMutation.isPending;
  const isError = predictMutation.isError;

  const overallScore = useMemo(() => {
    if (!result) return 0;
    return Math.max(0, Math.min(100, Math.round(result.expectedRequirementRatio * 100)));
  }, [result]);

  const conclusionLabel = result ? CONCLUSION_LABELS[result.conclusion] : '';

  const renderRow = (label: string, value: string) => (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-foreground/80 flex-1 pr-3 text-sm">
        <Text className="font-inter-semibold text-foreground">{label}: </Text>
        {value || '-'}
      </Text>
      <View className="h-8 w-8 items-center justify-center rounded-full bg-green-400/90">
        <Feather name="check" size={16} color="white" />
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/45" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="max-h-[88%] rounded-t-[28px] bg-white px-4 pb-6 pt-4 dark:bg-card"
          style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}>
            <View className="mb-3 items-center">
              <Text className="font-inter-bold text-xl text-foreground">Kết quả dự đoán</Text>
            </View>

            <View className="mb-4 rounded-xl bg-green-100 px-3 py-2">
              <Text className="text-center font-inter-medium text-sm text-green-800">
                Lưu ý: Kết quả chỉ mang tính gợi ý
              </Text>
            </View>

            {isLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className="text-foreground/70 mt-3 text-sm">Đang dự đoán sự kiện...</Text>
              </View>
            ) : isError ? (
              <View className="rounded-2xl bg-rose-50 px-4 py-4 dark:bg-rose-500/10">
                <Text className="font-inter-semibold text-base text-rose-600">
                  Không thể dự đoán sự kiện
                </Text>
                <Text className="mt-1 text-sm text-rose-500">
                  Vui lòng thử lại sau hoặc kiểm tra dữ liệu đầu vào.
                </Text>
              </View>
            ) : (
              <>
                {renderRow('Khu vực', province)}
                {renderRow('Loại sự kiện', eventTypeLabel)}
                {renderRow(
                  'Thời gian',
                  `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`
                )}
                {renderRow('Số lượng', `${expectedParticipants}`)}
                {renderRow('Điều kiện tham gia', participationConditions || 'Không')}

                <View className="mb-4 items-center pt-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-foreground/90 font-inter-medium text-base">
                      Kết quả tổng quan
                    </Text>
                    <Text className="font-inter-bold text-xl text-green-500">{overallScore}%</Text>
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-green-400/90">
                      <Feather name="check" size={15} color="white" />
                    </View>
                  </View>
                </View>

                <View className="mb-4 rounded-2xl bg-primary-50 px-4 py-4 dark:bg-card">
                  <Text className="text-foreground/80 text-sm leading-6">
                    Có khoảng{' '}
                    <Text className="font-inter-bold text-green-500">
                      {Math.round(result?.averageParticipants ?? 0)}
                    </Text>{' '}
                    người có thể tham gia sự kiện của bạn. {conclusionLabel}.
                  </Text>
                  <Text className="text-foreground/80 mt-2 text-sm leading-6">
                    {result?.message}
                  </Text>
                </View>

                {title ? (
                  <View className="mb-4 rounded-2xl border border-primary-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-card">
                    <Text className="text-foreground/50 text-xs">Tên sự kiện</Text>
                    <Text className="mt-1 font-inter-medium text-sm text-foreground">{title}</Text>
                    {locationAddress ? (
                      <Text className="text-foreground/60 mt-1 text-xs">{locationAddress}</Text>
                    ) : null}
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>

          <Button title="Thoát" onPress={onClose} className="mt-2 bg-neutral-300" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

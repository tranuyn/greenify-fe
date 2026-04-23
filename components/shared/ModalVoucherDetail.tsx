import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { VoucherTemplate } from '@/types/gamification.types';
interface ModalVoucherDetailProps {
  visible: boolean;
  onClose: () => void;
  voucher?: VoucherTemplate | null;
}

const ModalVoucherDetail = ({ visible, onClose, voucher }: ModalVoucherDetailProps) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColor();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="max-h-[88%] w-full rounded-3xl bg-background p-4">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-inter-bold text-lg text-[var(--foreground)]">
              {t('calendar.gift.today_gift_title')}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Feather name="x" size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {voucher ? (
              <>
                <View className="bg-[var(--primary-light)]/20 mb-4 overflow-hidden rounded-2xl">
                  {voucher.thumbnailUrl ? (
                    <Image
                      source={{ uri: voucher.thumbnailUrl }}
                      className="h-44 w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-44 w-full items-center justify-center bg-[var(--border)]">
                      <FontAwesome5 name="gift" size={44} color={colors.primary} />
                    </View>
                  )}
                </View>

                <Text className="mb-1 font-inter-bold text-xl text-[var(--foreground)]">
                  {voucher.name}
                </Text>
                <View className="mb-3 flex-row items-center gap-2">
                  {voucher.partnerLogoUrl ? (
                    <Image
                      source={{ uri: voucher.partnerLogoUrl }}
                      className="h-12 w-12 rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[var(--border)]">
                      <FontAwesome5 name="store" size={20} color={colors.primary} />
                    </View>
                  )}
                  <Text className="font-inter-medium text-sm text-[var(--muted-foreground)]">
                    {voucher.partnerName}
                  </Text>
                </View>

                <View className="bg-[var(--secondary)]/40 mb-3 rounded-2xl p-4">
                  <Text className="mb-1 font-inter-bold text-sm text-[var(--foreground)]">
                    {t('calendar.gift.description')}
                  </Text>
                  <Text className="text-sm leading-5 text-[var(--foreground)]">
                    {voucher.description}
                  </Text>
                </View>

                <View className="mb-4 flex-row flex-wrap gap-3">
                  <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                    <Text className="text-xs text-[var(--muted-foreground)]">
                      {t('calendar.gift.required_points')}
                    </Text>
                    <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                      {voucher.requiredPoints}
                    </Text>
                  </View>
                  <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                    <Text className="text-xs text-[var(--muted-foreground)]">
                      {t('calendar.gift.remaining_usage')}
                    </Text>
                    <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                      {voucher.remainingStock}
                    </Text>
                  </View>
                </View>

                <View className="rounded-2xl border border-[var(--border)] p-4">
                  <Text className="mb-2 font-inter-bold text-sm text-[var(--foreground)]">
                    {t('calendar.gift.usage_conditions')}
                  </Text>
                  <Text className="text-sm leading-5 text-[var(--foreground)]">
                    {voucher.usageConditions}
                  </Text>
                  <Text className="mt-3 text-xs text-[var(--muted-foreground)]">
                    {t('calendar.gift.expire_date', {
                      date: new Date(voucher.validUntil).toLocaleDateString(
                        i18n.resolvedLanguage === 'vi' ? 'vi-VN' : 'en-US'
                      ),
                    })}
                  </Text>
                </View>
              </>
            ) : (
              <View className="bg-[var(--secondary)]/40 items-center justify-center rounded-2xl px-4 py-10">
                <FontAwesome5 name="gift" size={40} color={colors.primary} />
                <Text className="mt-4 text-center font-inter-bold text-base text-[var(--foreground)]">
                  {t('calendar.gift.empty_title')}
                </Text>
                <Text className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                  {t('calendar.gift.empty_message')}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalVoucherDetail;

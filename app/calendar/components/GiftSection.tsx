import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useMyVouchers } from '@/hooks/queries/useGamification';
import { useTranslation } from 'react-i18next';
import { USER_VOUCHER_STATUS } from '@/types/gamification.types';

const GiftSection = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColor();
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [selectedVoucherIndex, setSelectedVoucherIndex] = useState(0);
  const { data: myVouchers } = useMyVouchers({
    page: 0,
    size: 100,
    status: USER_VOUCHER_STATUS.AVAILABLE,
  });
  const voucherList = useMemo(() => myVouchers ?? [], [myVouchers]);
  const voucher = voucherList[selectedVoucherIndex];

  useEffect(() => {
    if (selectedVoucherIndex >= voucherList.length) {
      setSelectedVoucherIndex(0);
    }
  }, [selectedVoucherIndex, voucherList.length]);

  const hasMultipleVouchers = voucherList.length > 1;

  const goPreviousVoucher = () => {
    if (!voucherList.length) return;
    setSelectedVoucherIndex((currentIndex) =>
      currentIndex === 0 ? voucherList.length - 1 : currentIndex - 1
    );
  };

  const goNextVoucher = () => {
    if (!voucherList.length) return;
    setSelectedVoucherIndex((currentIndex) =>
      currentIndex === voucherList.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <>
      <View className="mb-6 px-4">
        <ImageBackground
          source={{
            uri: IMAGES.calendar,
          }}
          className="items-center justify-center overflow-hidden rounded-2xl p-6">
          <View className="absolute inset-0 bg-black/20" />
          <Text className="mb-1 font-inter-bold text-lg text-[var(--on-primary)]">
            {t('calendar.gift.your_gift_title')}
          </Text>
          <Text className="mb-4 font-inter-medium text-sm text-[var(--on-primary)]">
            {t('calendar.gift.total', { count: voucherList.length })}
          </Text>
          <View className="w-full flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => voucherList.length && setIsVoucherModalVisible(true)}
              activeOpacity={voucherList.length ? 0.8 : 1}
              className="items-center justify-center">
              <Image source={{ uri: IMAGES.giftColor }} className="h-20 w-20" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <Modal
        visible={isVoucherModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVoucherModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          <View className="max-h-[88%] w-full rounded-3xl bg-background p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-inter-bold text-lg text-[var(--foreground)]">
                {t('calendar.gift.today_gift_title')}
              </Text>
              <TouchableOpacity onPress={() => setIsVoucherModalVisible(false)} className="p-1">
                <Feather name="x" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {voucher ? (
                <>
                  {hasMultipleVouchers ? (
                    <View className="mb-4 flex-row items-center justify-between">
                      <TouchableOpacity
                        onPress={goPreviousVoucher}
                        className="h-10 w-10 items-center justify-center rounded-full border border-[var(--border)]">
                        <Feather name="chevron-left" size={20} color={colors.foreground} />
                      </TouchableOpacity>

                      <Text className="font-inter-medium text-xs text-[var(--muted-foreground)]">
                        {selectedVoucherIndex + 1}/{voucherList.length}
                      </Text>

                      <TouchableOpacity
                        onPress={goNextVoucher}
                        className="h-10 w-10 items-center justify-center rounded-full border border-[var(--border)]">
                        <Feather name="chevron-right" size={20} color={colors.foreground} />
                      </TouchableOpacity>
                    </View>
                  ) : null}

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
                    {voucher.voucherName}
                  </Text>
                  <View className="mb-3 flex-row items-center gap-2">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[var(--border)]">
                      <FontAwesome5 name="store" size={20} color={colors.primary} />
                    </View>
                    <Text className="font-inter-medium text-sm text-[var(--muted-foreground)]">
                      {voucher.partnerName}
                    </Text>
                  </View>

                  <View className="bg-[var(--secondary)]/40 mb-3 rounded-2xl p-4">
                    <Text className="mb-1 font-inter-bold text-sm text-[var(--foreground)]">
                      {t('calendar.gift.description')}
                    </Text>
                    <Text className="text-sm leading-5 text-[var(--foreground)]">
                      {voucher.source}
                    </Text>
                  </View>

                  <View className="mb-4 flex-row flex-wrap gap-3">
                    <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                      <Text className="text-xs text-[var(--muted-foreground)]">
                        {t('calendar.gift.required_points')}
                      </Text>
                      <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                        {voucher.status}
                      </Text>
                    </View>
                    <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                      <Text className="text-xs text-[var(--muted-foreground)]">
                        {t('calendar.gift.remaining_usage')}
                      </Text>
                      <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                        {voucher.voucherCode}
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-2xl border border-[var(--border)] p-4">
                    <Text className="mb-2 font-inter-bold text-sm text-[var(--foreground)]">
                      {t('calendar.gift.usage_conditions')}
                    </Text>
                    <Text className="text-sm leading-5 text-[var(--foreground)]">
                      {voucher.voucherTemplateId}
                    </Text>
                    <Text className="mt-3 text-xs text-[var(--muted-foreground)]">
                      {t('calendar.gift.expire_date', {
                        date: voucher.expiresAt.toLocaleDateString(
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
    </>
  );
};

export default GiftSection;

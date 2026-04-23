import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { IMAGES } from '@/constants/linkMedia';
import { useMyPlant, useVoucherBySeed } from '@/hooks/queries/useGamification';
import { useTranslation } from 'react-i18next';
// Import component mới tạo
import ModalVoucherDetail from '@/components/shared/ModalVoucherDetail';

const GiftSection = () => {
  const { t } = useTranslation();
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const { data: myPlant } = useMyPlant();
  const { data: voucher } = useVoucherBySeed(myPlant?.seedId);

  return (
    <>
      <View className="mb-6 px-4">
        <ImageBackground
          source={{ uri: IMAGES.calendar }}
          className="items-center justify-center overflow-hidden rounded-2xl p-6">
          <View className="absolute inset-0 bg-black/20" />
          <Text className="mb-1 font-inter-bold text-lg text-[var(--on-primary)]">
            {t('calendar.gift.your_gift_title')}
          </Text>
          <Text className="mb-4 font-inter-medium text-sm text-[var(--on-primary)]">
            {t('calendar.gift.total', { count: voucher ? 1 : 0 })}
          </Text>
          <View className="w-full flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => voucher && setIsVoucherModalVisible(true)}
              activeOpacity={voucher ? 0.8 : 1}
              className="items-center justify-center">
              <Image source={{ uri: IMAGES.giftColor }} className="h-20 w-20" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Gọi component đã tách */}
      <ModalVoucherDetail
        visible={isVoucherModalVisible}
        onClose={() => setIsVoucherModalVisible(false)}
        voucher={voucher}
      />
    </>
  );
};

export default GiftSection;

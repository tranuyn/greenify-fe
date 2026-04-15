import React, { useMemo, useState } from 'react';
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
import { usePlantDailyLogs } from '@/hooks/queries/useGamification';
import { useCurrentUser } from '@/hooks/queries/useAuth';

const GiftSection = () => {
  const colors = useThemeColor();
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const { data: authData } = useCurrentUser();
  const userId = authData?.user?.id;
  const todayLogParams = useMemo(
    () => ({
      log_date: new Date().toISOString().slice(0, 10),
      user_id: userId,
    }),
    [userId]
  );

  const { data: dailyLogs = [] } = usePlantDailyLogs(todayLogParams);

  const todayLog = useMemo(() => {
    if (!userId || dailyLogs.length === 0) return null;
    return dailyLogs[0];
  }, [dailyLogs, userId]);

  const voucherTemplate = todayLog?.plant_progress?.seed?.reward_voucher_template;

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
            Quà tặng của bạn
          </Text>
          <Text className="mb-4 font-inter-medium text-sm text-[var(--on-primary)]">
            Số lượng quà: {voucherTemplate ? 1 : 0}
          </Text>
          <View className="w-full flex-row items-center justify-between">
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]">
              <Feather name="chevron-left" size={20} color={colors.onPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => voucherTemplate && setIsVoucherModalVisible(true)}
              activeOpacity={voucherTemplate ? 0.8 : 1}
              className="items-center justify-center">
              <Image source={{ uri: IMAGES.giftColor }} className="h-20 w-20" />
            </TouchableOpacity>

            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]">
              <Feather name="chevron-right" size={20} color={colors.onPrimary} />
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
                Quà tặng hôm nay
              </Text>
              <TouchableOpacity onPress={() => setIsVoucherModalVisible(false)} className="p-1">
                <Feather name="x" size={22} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {voucherTemplate ? (
                <>
                  <View className="bg-[var(--primary-light)]/20 mb-4 overflow-hidden rounded-2xl">
                    {voucherTemplate.thumbnail_url ? (
                      <Image
                        source={{ uri: voucherTemplate.thumbnail_url }}
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
                    {voucherTemplate.name}
                  </Text>
                  <View className="mb-3 flex-row items-center gap-2">
                    {voucherTemplate.partner_logo_url ? (
                      <Image
                        source={{ uri: voucherTemplate.partner_logo_url }}
                        className="h-12 w-12"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-[var(--border)]">
                        <FontAwesome5 name="store" size={20} color={colors.primary} />
                      </View>
                    )}
                    <Text className="font-inter-medium text-sm text-[var(--muted-foreground)]">
                      {voucherTemplate.partner_name}
                    </Text>
                  </View>

                  <View className="bg-[var(--secondary)]/40 mb-3 rounded-2xl p-4">
                    <Text className="mb-1 font-inter-bold text-sm text-[var(--foreground)]">
                      Mô tả
                    </Text>
                    <Text className="text-sm leading-5 text-[var(--foreground)]">
                      {voucherTemplate.description}
                    </Text>
                  </View>

                  <View className="mb-4 flex-row flex-wrap gap-3">
                    <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                      <Text className="text-xs text-[var(--muted-foreground)]">Điểm cần</Text>
                      <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                        {voucherTemplate.required_points}
                      </Text>
                    </View>
                    <View className="min-w-[48%] flex-1 rounded-2xl border border-[var(--border)] p-3">
                      <Text className="text-xs text-[var(--muted-foreground)]">
                        Lượt dùng còn lại
                      </Text>
                      <Text className="mt-1 font-inter-bold text-base text-[var(--foreground)]">
                        {voucherTemplate.remaining_stock}/{voucherTemplate.total_stock}
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-2xl border border-[var(--border)] p-4">
                    <Text className="mb-2 font-inter-bold text-sm text-[var(--foreground)]">
                      Điều kiện sử dụng
                    </Text>
                    <Text className="text-sm leading-5 text-[var(--foreground)]">
                      {voucherTemplate.usage_conditions}
                    </Text>
                    <Text className="mt-3 text-xs text-[var(--muted-foreground)]">
                      Hết hạn: {new Date(voucherTemplate.valid_until).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </>
              ) : (
                <View className="bg-[var(--secondary)]/40 items-center justify-center rounded-2xl px-4 py-10">
                  <FontAwesome5 name="gift" size={40} color={colors.primary} />
                  <Text className="mt-4 text-center font-inter-bold text-base text-[var(--foreground)]">
                    Chưa có quà tặng cho hôm nay
                  </Text>
                  <Text className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
                    Hãy hoàn thành hoạt động chăm cây để nhận voucher.
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

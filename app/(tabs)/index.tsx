import React, { useState } from 'react';
import { View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ---- Feature components ----
import { HomeHeader } from '@/components/features/home/HomeHeader';
import { HomeActionMenu } from '@/components/features/home/HomeActionMenu';
import { SectionHeader } from '@/components/features/home/SectionHeader';
import { EventCard } from '@/components/features/home/EventCard';
import { VoucherRowCard } from '@/components/features/home/VoucherRowCard';
import { StreakPlantCard } from '@/components/features/home/StreakPlantCard';
import { CommunityFeedPreview } from '@/components/features/home/CommunityFeedPreview';

import { router } from 'expo-router';
import { useAuthRole, useCurrentUser } from '@/hooks/queries/useAuth';
import { usePublishedEvents, useMyRegistrations } from '@/hooks/queries/useEvents';
import { useRegisterEvent } from '@/hooks/mutations/useEvents';
import { useAvailableVouchers, useMyVouchers } from '@/hooks/queries/useGamification';
import { useExchangeVoucher } from '@/hooks/mutations/useGamification';
import { useMyWallet } from '@/hooks/queries/useWallet';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { Text } from '@/components/ui/Text';
import {
  USER_VOUCHER_STATUS,
  type UserVoucher,
  type VoucherTemplate,
} from '@/types/gamification.types';
import { Utilities } from '@/components/profile/Utilities';

// ============================================================
// HOME SCREEN
// Orchestrator: Chỉ import + xếp chồng các sections.
// Mỗi section tự quản lý data fetching & loading state.
// ============================================================

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  // ---- Data fetching ----
  const { data: authData, isLoading: isLoadingMe } = useCurrentUser();
  const { data: wallet } = useMyWallet();
  const { data: eventsData, isLoading: isLoadingEvents } = usePublishedEvents({
    page: 1,
    size: 5,
  });
  const { data: myRegistrations } = useMyRegistrations(authData?.id ?? '');
  const { mutate: registerEvent } = useRegisterEvent();
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);

  const registeredEventIds = new Set((myRegistrations?.content ?? []).map((r) => r.id));

  const handleRegisterEvent = (eventId: string) => {
    setRegisteringEventId(eventId);
    registerEvent(
      { eventId },
      {
        onSettled: () => setRegisteringEventId(null),
      }
    );
  };
  const { data: availableVouchersData, isLoading: isLoadingVouchers } = useAvailableVouchers();
  const { data: myVouchers } = useMyVouchers();
  const { mutate: exchangeVoucher } = useExchangeVoucher();

  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const currentProfile = authData?.userProfile;
  let userName = t('home.welcome_guest', 'Công dân xanh');

  if (currentProfile) {
    userName = currentProfile.displayName;
  }
  const events = eventsData?.content ?? [];
  const allVouchers: VoucherTemplate[] = availableVouchersData?.content ?? [];
  const myVoucherList: UserVoucher[] = myVouchers?.content ?? [];

  const collectedVoucherIds = new Set(
    myVoucherList
      .filter(
        (v) => v.status === USER_VOUCHER_STATUS.AVAILABLE || v.status === USER_VOUCHER_STATUS.USED
      )
      .map((v) => v.voucherTemplateId)
  );

  const handleCollect = (item: VoucherTemplate) => {
    setRedeemingId(item.id);
    exchangeVoucher(item.id, {
      onSettled: () => setRedeemingId(null),
    });
  };

  const authRole = useAuthRole();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      {/* 1. HEADER — Avatar + Tên + Điểm GP            */}
      <HomeHeader
        userName={userName}
        avatarUrl={authData?.userProfile?.avatarUrl || authData?.ngoProfile?.avatar.imageUrl}
        points={wallet?.availablePoints ?? 0}
      />

      {/* 2. QUICK MENU — Bản đồ, Voucher, Leaderboard  */}
      <Utilities isForHome={true} />

      {/* 3. SỰ KIỆN XANH — Carousel ngang              */}
      <SectionHeader title={t('home.section_events')} />

      {isLoadingEvents ? (
        <View className="h-[200px] items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          className="pb-1 pt-1"
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              isRegistered={registeredEventIds.has(item.id)}
              isRegistering={registeringEventId === item.id}
              onPressCard={() => router.push(`/(events)/${item.id}`)}
              onRegister={() => handleRegisterEvent(item.id)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          snapToInterval={316}
          decelerationRate="fast"
          ListEmptyComponent={
            <View className="h-[120px] w-full items-center justify-center">
              <Text className="text-foreground/50 font-inter text-sm">
                Hiện chưa có sự kiện nào.
              </Text>
            </View>
          }
        />
      )}

      {/* 4. ĐỔI VOUCHER — Row list + Carousel          */}
      <SectionHeader title={t('home.section_vouchers')} />

      {/* Row voucher list */}
      {isLoadingVouchers ? (
        <View className="h-[80px] items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <View className="px-5">
          {allVouchers.map((item) => (
            <VoucherRowCard
              key={item.id}
              item={item}
              isCollected={collectedVoucherIds.has(item.id)}
              isCollecting={redeemingId === item.id}
              onCollect={() => handleCollect(item)}
            />
          ))}
        </View>
      )}

      {/* 5. STREAK + CÂY ĐANG TRỒNG                    */}
      <SectionHeader title={t('home.section_streak_plant')} />
      <StreakPlantCard />

      {/* 6. FEED CỘNG ĐỒNG XANH — 3 bài post mới nhất */}
      <SectionHeader title={t('home.section_community')} />
      <CommunityFeedPreview />
    </ScrollView>
  );
}

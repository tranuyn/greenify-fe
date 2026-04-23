import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// ---- Components ----
import { HomeHeader } from '@/components/features/home/HomeHeader';
import { Utilities } from '@/components/profile/Utilities';
import { SectionHeader } from '@/components/features/home/SectionHeader';
import { EventCard } from '@/components/features/home/EventCard';
import { VoucherRowCard } from '@/components/features/home/VoucherRowCard';
import { StreakPlantCard } from '@/components/features/home/StreakPlantCard';
import { CommunityFeedPreview } from '@/components/features/home/CommunityFeedPreview';
import ModalVoucherDetail from '@/components/shared/ModalVoucherDetail'; // Import Modal

// ---- Hooks & Utils ----
import { useAuthRole, useCurrentUser } from '@/hooks/queries/useAuth';
import { usePublishedEvents, useMyRegistrations } from '@/hooks/queries/useEvents';
import { useRegisterEvent, useRegisterWaitlistEvent } from '@/hooks/mutations/useEvents';
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  // ---- States ----
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherTemplate | null>(null); // State cho Modal

  // ---- Data fetching ----
  const { data: authData } = useCurrentUser();
  const { data: wallet } = useMyWallet();
  const { data: eventsData, isLoading: isLoadingEvents } = usePublishedEvents({ page: 1, size: 5 });
  const roleData = useAuthRole();
  const { data: myRegistrations } = useMyRegistrations(authData?.id ?? '');
  const { mutate: registerEvent } = useRegisterEvent();
  const { mutate: registerWaitlistEvent } = useRegisterWaitlistEvent();

  const { data: availableVouchersData, isLoading: isLoadingVouchers } = useAvailableVouchers();
  const { data: myVouchers } = useMyVouchers();
  const { mutate: exchangeVoucher } = useExchangeVoucher();

  const registeredEventIds = new Set((myRegistrations?.content ?? []).map((r) => r.id));

  // ---- Handlers ----
  const handleRegisterEvent = React.useCallback(
    (event: { id: string; isFull?: boolean } | undefined, isFull: boolean = false) => {
      if (!event) return;
      setRegisteringEventId(event.id);
      const mutationFn = isFull ? registerWaitlistEvent : registerEvent;
      mutationFn(
        { eventId: event.id },
        {
          onSuccess: () => setRegisteringEventId(null),
          onError: (err: any) => {
            setRegisteringEventId(null);
            Alert.alert(
              t(
                'events.detail.alert.register_failed_title',
                isFull ? 'Vào danh sách chờ thất bại' : 'Đăng ký thất bại'
              ),
              err?.response?.data?.message ??
                t(
                  'events.detail.alert.register_failed_message',
                  isFull ? 'Không thể vào danh sách chờ' : 'Không thể đăng ký sự kiện'
                )
            );
          },
        }
      );
    },
    [registerEvent, registerWaitlistEvent, t]
  );

  const handleCollect = (item: VoucherTemplate) => {
    setRedeemingId(item.id);
    exchangeVoucher(item.id, {
      onSettled: () => setRedeemingId(null),
    });
  };

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

  const selectedUserVoucher = useMemo(() => {
    if (!selectedVoucher) return null;
    // Tìm trong danh sách voucher đã sở hữu xem có cái nào trùng templateId không
    return myVoucherList.find((v) => v.voucherTemplateId === selectedVoucher.id);
  }, [selectedVoucher, myVoucherList]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <HomeHeader
        userName={
          authData?.userProfile?.displayName || authData?.ngoProfile?.orgName || 'Người dùng'
        }
        avatarUrl={authData?.userProfile?.avatarUrl || authData?.ngoProfile?.avatar?.imageUrl}
        points={wallet?.availablePoints ?? 0}
      />

      <Utilities isForHome={true} />

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
          renderItem={({ item }) => {
            const isFull = (item.participantCount ?? 0) >= item.maxParticipants;
            return (
              <EventCard
                item={item}
                isRegistered={registeredEventIds.has(item.id)}
                isRegistering={registeringEventId === item.id}
                onPressCard={() => router.push(`/(events)/${item.id}`)}
                onRegister={() => handleRegisterEvent(item, isFull)}
              />
            );
          }}
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

      <SectionHeader title={t('home.section_vouchers')} />

      {isLoadingVouchers ? (
        <View className="h-[80px] items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <View className="px-5">
          {allVouchers.map((item) => (
            // Bọc bằng TouchableOpacity để mở Modal khi click vào vùng card
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => setSelectedVoucher(item)}>
              <VoucherRowCard
                item={item}
                isCollected={collectedVoucherIds.has(item.id)}
                isCollecting={redeemingId === item.id}
                onCollect={() => handleCollect(item)}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SectionHeader title={t('home.section_streak_plant')} />
      <StreakPlantCard />

      <SectionHeader title={t('home.section_community')} />
      <CommunityFeedPreview />

      {/* Render Modal */}
      <ModalVoucherDetail
        visible={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
        voucherCode={selectedUserVoucher?.voucherCode}
      />
    </ScrollView>
  );
}

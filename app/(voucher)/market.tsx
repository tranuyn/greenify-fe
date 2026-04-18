import { useState, useMemo, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useAvailableVouchers, useMyVouchers } from '@/hooks/queries/useGamification';
import { useExchangeVoucher } from '@/hooks/mutations/useGamification';

import { VoucherSearchBar } from '@/components/features/voucher/VoucherSearchBar';
import { PartnerFilter } from '@/components/features/voucher/PartnerFilter';
import { VoucherRowCard } from '@/components/features/home/VoucherRowCard';
import { USER_VOUCHER_STATUS, type UserVoucher, type VoucherTemplate } from '@/types/gamification.types';

export default function VoucherMarketScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const router = useRouter();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const { data: availableVouchersData, isLoading } = useAvailableVouchers();
  const { data: myVouchers } = useMyVouchers();
  const { mutate: exchangeVoucher } = useExchangeVoucher();

  const vouchers: VoucherTemplate[] = availableVouchersData?.content ?? [];
  const myVoucherList: UserVoucher[] = myVouchers?.content ?? [];

  const collectedVoucherIds = useMemo(() => {
    return new Set(
      myVoucherList
        .filter(
          (v) => v.status === USER_VOUCHER_STATUS.AVAILABLE || v.status === USER_VOUCHER_STATUS.USED
        )
        .map((v) => v.voucherTemplateId)
    );
  }, [myVoucherList]);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.partnerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPartner = !activePartner || v.partnerName === activePartner;

      return matchSearch && matchPartner;
    });
  }, [vouchers, searchQuery, activePartner]);

  const allPartners = useMemo(() => {
    const set = new Set<string>();
    vouchers.forEach((v) => set.add(v.partnerName));
    return Array.from(set).sort();
  }, [vouchers]);

  const handleCollect = useCallback(
    (item: VoucherTemplate) => {
      setRedeemingId(item.id);
      exchangeVoucher(item.id, {
        onSettled: () => setRedeemingId(null),
      });
    },
    [exchangeVoucher]
  );

  const renderHeader = () => (
    <View className="mb-2">
      <VoucherSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <PartnerFilter
        partners={allPartners}
        activePartner={activePartner}
        onSelect={(p) => setActivePartner((prev) => (prev === p ? null : p))}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-foreground/5 dark:bg-foreground/10 h-10 w-10 items-center justify-center rounded-full active:opacity-70">
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="ml-4 font-inter-semibold text-lg text-foreground">
          {t('home.menu_market')}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVouchers}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          renderItem={({ item }) => (
            <View className="px-5">
              <VoucherRowCard
                item={item}
                isCollected={collectedVoucherIds.has(item.id)}
                isCollecting={redeemingId === item.id}
                onCollect={() => handleCollect(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center px-6">
              <Feather
                name="inbox"
                size={48}
                color={colors.foreground}
                style={{ opacity: 0.3, marginBottom: 16 }}
              />
              <Text className="text-foreground/50 text-center font-inter text-sm">
                Không tìm thấy voucher nào.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

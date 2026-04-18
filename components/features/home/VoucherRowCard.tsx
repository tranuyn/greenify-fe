import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

import { NEUTRAL_COLORS } from '@/constants/color.constant';
import { Text } from '@/components/ui/Text';
import type { VoucherTemplate } from '@/types/gamification.types';

type Props = {
  item: VoucherTemplate;
  isCollected?: boolean;
  isCollecting?: boolean;
  onCollect?: () => void;
};

/** Format ISO to DD/MM/YYYY */
function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * VoucherRowCard — Card dạng hàng ngang cho danh sách voucher.
 * Dùng ở section "Ăn uống thả ga" (vertical list).
 */
export function VoucherRowCard({ item, isCollected, isCollecting, onCollect }: Props) {
  const { t } = useTranslation();
  const isDisabled = isCollected || isCollecting;

  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-background px-3 py-2 shadow-sm shadow-black/70 dark:bg-card">
      <View className="mr-3 h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
        <Image
          source={{ uri: item.thumbnailUrl ?? undefined }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View className="min-w-0 flex-1 py-2 pr-2">
        <View className="mb-0.5 flex-row items-center">
          <View className="mr-1 h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-primary-50">
            <Image
              source={{ uri: item.partnerLogoUrl ?? undefined }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text
            numberOfLines={1}
            className="text-foreground/50 min-w-0 flex-1 font-inter text-[11px]">
            {item.partnerName}
          </Text>
        </View>
        <Text numberOfLines={2} className="text-md min-w-0 font-inter-semibold text-foreground">
          {item.name}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Feather name="box" size={10} color={NEUTRAL_COLORS[400]} />
          <Text
            numberOfLines={1}
            className="text-foreground/40 ml-1 min-w-0 shrink font-inter text-[10px]">
            {t('home.remaining_stock', { count: item.remainingStock })}
          </Text>
          <Text className="text-foreground/20 mx-1.5">•</Text>
          <Feather name="clock" size={10} color={NEUTRAL_COLORS[400]} />
          <Text
            numberOfLines={1}
            className="text-foreground/40 ml-1 min-w-0 flex-1 shrink font-inter text-[10px]">
            {t('home.valid_until', { date: formatDate(item.validUntil) })}
          </Text>
        </View>
      </View>

      {/* Right side: GP + Button */}
      <View className="w-[70px] shrink-0 items-end">
        <Text className="mb-1.5 !font-inter-bold text-lg text-primary">
          {item.requiredPoints}
          <Text className="!font-inter-semibold text-xs text-primary-800"> GP</Text>
        </Text>
        <TouchableOpacity
          className={`min-w-[80px] items-center justify-center rounded-md px-2 py-1 active:opacity-80 ${isDisabled ? 'bg-foreground/50' : 'bg-primary-100'}`}
          disabled={isDisabled}
          onPress={onCollect}>
          {isCollecting ? (
            <ActivityIndicator size="small" color={NEUTRAL_COLORS[500]} />
          ) : (
            <Text
              className={`!font-inter-semibold text-[11px] ${isCollected ? 'text-foreground/50' : 'text-primary-800'}`}>
              {isCollected
                ? t('home.btn_collected', 'Đã thu thập')
                : t('home.btn_collect', 'Thu thập')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

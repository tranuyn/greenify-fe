import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

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

  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-background px-3 shadow-sm shadow-black/70 dark:bg-card">
      <View className="mr-3.5 h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
        <Image
          source={{ uri: item.thumbnail_url ?? undefined }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View className="flex-1 py-3">
        <View className="mb-0.5 flex-row items-center">
          <View className="mr-1 h-5 w-5 items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
            <Image
              source={{ uri: item.partner_logo_url ?? undefined }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-foreground/50 line-clamp-1 font-inter text-[11px]">
            {item.partner_name}
          </Text>
        </View>
        <Text className="line-clamp-1 font-inter-semibold text-[14px] text-foreground">
          {item.name}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Feather name="box" size={10} color="#9ca3af" />
          <Text className="text-foreground/40 ml-1 font-inter text-[10px]">
            {t('home.remaining_stock', { count: item.remaining_stock })}
          </Text>
          <Text className="text-foreground/20 mx-1.5">•</Text>
          <Feather name="clock" size={10} color="#9ca3af" />
          <Text className="text-foreground/40 ml-1 font-inter text-[10px]">
            {t('home.valid_until', { date: formatDate(item.valid_until) })}
          </Text>
        </View>
      </View>

      {/* Right side: GP + Button */}
      <View className="ml-2 items-end">
        <Text className="mb-2 !font-inter-bold text-xl text-primary">
          {item.required_points}
          <Text className="!font-inter-semibold text-xs text-primary-800"> GP</Text>
        </Text>
        <TouchableOpacity
          className={`rounded-md px-3.5 py-1.5 active:opacity-80 ${isCollected || isCollecting ? 'bg-foreground/10' : 'bg-primary-100'}`}
          disabled={isCollected || isCollecting}
          onPress={onCollect}>
          {isCollecting ? (
            <ActivityIndicator size="small" color="#166534" />
          ) : (
            <Text
              className={`!font-inter-semibold text-xs ${isCollected ? 'text-foreground/50' : 'text-primary-800'}`}>
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

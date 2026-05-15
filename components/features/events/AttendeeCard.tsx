import { View, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { IMAGES } from '@/constants/linkMedia';
import { ImageSourcePropType } from 'react-native';
import { REGISTRATION_STATUS, RegistrationStatus } from '@/types/community.types';
import { getRegistrationBadge } from '@/utils/eventUtils';
// Đảm bảo import đúng đường dẫn IMAGES của bạn

type AttendeeCardProps = {
  item: any; // Thay bằng type EventRegistration thực tế của bạn
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

export function AttendeeCard({ item, onApprove, onReject }: AttendeeCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColor();

  const profile = item.userProfile;
  const displayName = profile?.displayName || item.username || item.userId || 'Người dùng ẩn danh';

  // Lấy ra trạng thái hiện tại
  const status = item.registrationStatus as RegistrationStatus;
  const badge = getRegistrationBadge(status);

  // Xử lý chuỗi địa chỉ
  const locationParts = [profile?.ward, profile?.district, profile?.province].filter(
    (part) => part && part.trim().length > 0
  );
  const locationString =
    locationParts.length > 0
      ? locationParts.join(', ')
      : t('events.detail.no_location', 'Chưa cập nhật địa chỉ');

  const fallbackImage = { uri: IMAGES.treeAvatar };

  const avatarSource = (
    profile?.avatarUrl ? { uri: profile.avatarUrl } : fallbackImage
  ) as ImageSourcePropType;

  return (
    <View className="mb-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm shadow-black/5 dark:border-white/5 dark:bg-card">
      <View className="flex-row items-center">
        {/* Avatar */}
        <Image
          source={avatarSource} // Đổi dòng này
          className="h-12 w-12 rounded-full bg-gray-100"
          resizeMode="cover"
        />

        {/* Thông tin User */}
        <View className="ml-3 flex-1 justify-center">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 font-inter-semibold text-sm text-foreground" numberOfLines={1}>
              {displayName}
            </Text>

            {/* Badge Trạng thái */}
            <View className={`ml-2 rounded-full px-2.5 py-0.5 ${badge.bg}`}>
              <Text className={`font-inter-medium text-[10px] ${badge.text}`}>
                {t(`events.my_events.status.${badge.i18nKey}`, { defaultValue: status })}
              </Text>
            </View>
          </View>

          {/* Email (nếu có) */}
          {item.email && (
            <Text className="text-foreground/60 mt-0.5 font-inter text-xs" numberOfLines={1}>
              {item.email}
            </Text>
          )}

          {/* Địa chỉ */}
          <View className="mt-1 flex-row items-center">
            <Feather name="map-pin" size={10} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-1 font-inter text-[11px]" numberOfLines={1}>
              {locationString}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

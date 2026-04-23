import { View, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { IMAGES } from '@/constants/linkMedia';
import { ImageSourcePropType } from 'react-native';
// Đảm bảo import đúng đường dẫn IMAGES của bạn

// Khai báo enum trạng thái
export const REGISTRATION_STATUS = {
  REGISTERED: 'REGISTERED',
  WAITLISTED: 'WAITLISTED',
  CANCELLED: 'CANCELLED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  ATTENDED: 'ATTENDED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type RegistrationStatus = keyof typeof REGISTRATION_STATUS;

// Cấu hình màu sắc cho từng badge trạng thái
const STATUS_BADGE: Record<RegistrationStatus, { bg: string; text: string; i18nKey: string }> = {
  REGISTERED: { bg: 'bg-blue-50', text: 'text-blue-600', i18nKey: 'registered' },
  WAITLISTED: { bg: 'bg-amber-50', text: 'text-amber-600', i18nKey: 'waitlisted' },
  CHECKED_IN: { bg: 'bg-emerald-50', text: 'text-emerald-600', i18nKey: 'checked_in' },
  CHECKED_OUT: { bg: 'bg-indigo-50', text: 'text-indigo-600', i18nKey: 'checked_out' },
  ATTENDED: { bg: 'bg-primary-50', text: 'text-primary-700', i18nKey: 'attended' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-500', i18nKey: 'cancelled' },
  NO_SHOW: { bg: 'bg-rose-50', text: 'text-rose-600', i18nKey: 'no_show' },
};

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
  const badge = STATUS_BADGE[status] || STATUS_BADGE.REGISTERED; // Fallback an toàn

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
                {t(`events.status.${badge.i18nKey}`, status)}
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

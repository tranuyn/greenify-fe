import { REGISTRATION_STATUS, RegistrationStatus } from '@/types/community.types';
import { TFunction } from 'i18next'; // Import type của i18next (hoặc thư viện i18n bạn đang dùng)

export interface GetButtonLabelParams {
  t: TFunction;
  registrationStatus?: RegistrationStatus | null;
  isFull?: boolean;
  isProcessing?: boolean;
}

export const getRegistrationButtonLabel = ({
  t,
  registrationStatus,
  isFull = false,
  isProcessing = false,
}: GetButtonLabelParams): string => {
  // 1. Ưu tiên hiển thị trạng thái đang xử lý
  if (isProcessing) {
    return t('events.detail.actions.processing', 'Đang xử lý...');
  }

  // 2. Nếu user đã có trạng thái tương tác với sự kiện
  if (registrationStatus) {
    switch (registrationStatus) {
      case REGISTRATION_STATUS.REGISTERED:
        return t('events.detail.status.registered', 'Đã đăng ký');
      case REGISTRATION_STATUS.WAITLISTED:
        return t('events.detail.status.waitlisted', 'Đang chờ (Waitlist)');
      case REGISTRATION_STATUS.CANCELLED:
        return t('events.detail.status.cancelled', 'Đã hủy');
      case REGISTRATION_STATUS.CHECKED_IN:
        return t('events.detail.status.checkedIn', 'Đã Check-in');
      case REGISTRATION_STATUS.CHECKED_OUT:
        return t('events.detail.status.checkedOut', 'Đã Check-out');
      case REGISTRATION_STATUS.ATTENDED:
        return t('events.detail.status.attended', 'Đã tham gia');
      case REGISTRATION_STATUS.NO_SHOW:
        return t('events.detail.status.noShow', 'Vắng mặt');
      default:
        // Đề phòng trường hợp lỗi data
        return t('events.detail.actions.register', 'Đăng ký');
    }
  }
  if (isFull) {
    return t('events.detail.actions.full', 'Đã đủ người (vào hàng chờ)');
  }

  // 4. Mặc định: Chưa đăng ký và sự kiện còn chỗ
  return t('events.detail.actions.register', 'Đăng ký');
};

export const getRegistrationBadge = (status?: RegistrationStatus | null) => {
  const map: Record<RegistrationStatus, { bg: string; text: string; i18nKey: string }> = {
    REGISTERED: { bg: 'bg-blue-50', text: 'text-blue-600', i18nKey: 'registered' },
    WAITLISTED: { bg: 'bg-amber-50', text: 'text-amber-600', i18nKey: 'waitlisted' },
    CHECKED_IN: { bg: 'bg-emerald-50', text: 'text-emerald-600', i18nKey: 'checked_in' },
    CHECKED_OUT: { bg: 'bg-indigo-50', text: 'text-indigo-600', i18nKey: 'checked_out' },
    ATTENDED: { bg: 'bg-primary-50', text: 'text-primary-700', i18nKey: 'attended' },
    CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-500', i18nKey: 'cancelled' },
    NO_SHOW: { bg: 'bg-rose-50', text: 'text-rose-600', i18nKey: 'no_show' },
  };

  if (!status) return map.REGISTERED;
  return map[status as RegistrationStatus] || map.REGISTERED;
};

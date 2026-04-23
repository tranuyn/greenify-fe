import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { POST_STATUS, PostStatus } from '@/types/action.types';
import { TFunction } from 'i18next'; // Thay thế bằng type từ thư viện i18n bạn đang dùng nếu khác

export interface GetPostStatusLabelParams {
  t: TFunction;
  status?: PostStatus | null;
}

export const getPostStatusLabel = ({ t, status }: GetPostStatusLabelParams): string => {
  if (!status) {
    return t('post_status.unknown', 'Trạng thái không rõ');
  }

  switch (status) {
    case POST_STATUS.DRAFT:
      return t('post_status.draft', 'Bản nháp');
    case POST_STATUS.PENDING_REVIEW:
      return t('post_status.pending_review', 'Chờ duyệt');
    case POST_STATUS.PARTIALLY_APPROVED:
      return t('post_status.partially_approved', 'Đã duyệt một phần');
    case POST_STATUS.VERIFIED:
      return t('post_status.verified', 'Đã xác minh');
    case POST_STATUS.REJECTED:
      return t('post_status.rejected', 'Bị từ chối');
    case POST_STATUS.FLAGGED:
      return t('post_status.flagged', 'Bị cảnh báo');
    case POST_STATUS.REVOKED:
      return t('post_status.revoked', 'Bị thu hồi');
    default:
      return t('post_status.unknown', 'Trạng thái không rõ');
  }
};

// 1. Hàm ánh xạ trạng thái ra Icon và Mã màu
export const getStatusDisplay = (status: PostStatus) => {
  switch (status) {
    case POST_STATUS.DRAFT:
      return { icon: 'file-text', color: '#9ca3af', textClass: 'text-foreground' }; // #9ca3af là neutral-400
    case POST_STATUS.PENDING_REVIEW:
      return { icon: 'clock', color: '#eab308', textClass: 'text-yellow-500' };
    case POST_STATUS.VERIFIED:
      return { icon: 'check-circle', color: '#22c55e', textClass: 'text-green-500' };
    case POST_STATUS.REJECTED:
      return { icon: 'x-circle', color: '#ef4444', textClass: 'text-red-500' };
    case POST_STATUS.FLAGGED:
      return { icon: 'flag', color: '#f43f5e', textClass: 'text-rose-500' };
    case POST_STATUS.REVOKED:
      return { icon: 'minus-circle', color: '#64748b', textClass: 'text-slate-500' };
    case POST_STATUS.PARTIALLY_APPROVED:
      return { icon: 'check', color: '#f97316', textClass: 'text-orange-500' };
    default:
      return { icon: 'info', color: '#9ca3af', textClass: 'text-foreground' };
  }
};

export type RejectReasonCode =
  | 'NOT_GREEN_ACTION'
  | 'FAKE_IMAGE'
  | 'DUPLICATE'
  | 'UNCLEAR_IMAGE'
  | 'INAPPROPRIATE'
  | 'OTHER';

export const REJECT_REASONS: { code: RejectReasonCode; label: string }[] = [
  { code: 'NOT_GREEN_ACTION', label: 'Không phải hành động xanh' },
  { code: 'FAKE_IMAGE',       label: 'Hình ảnh giả mạo / không liên quan' },
  { code: 'DUPLICATE',        label: 'Bài đăng trùng lặp' },
  { code: 'UNCLEAR_IMAGE',    label: 'Hình ảnh không rõ ràng' },
  { code: 'INAPPROPRIATE',    label: 'Nội dung không phù hợp' },
  { code: 'OTHER',            label: 'Lý do khác' },
];
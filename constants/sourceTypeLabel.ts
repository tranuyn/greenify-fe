import { PointSourceType } from 'types/action.types';

export const SOURCE_TYPE_LABELS: Record<PointSourceType, string> = {
  [PointSourceType.GREEN_ACTION]: 'Bài xanh',
  [PointSourceType.EVENT_ATTEND]: 'Sự kiện',
  [PointSourceType.REVIEW_REWARD]: 'Duyệt bài',
  [PointSourceType.LEADERBOARD]: 'Bảng xếp hạng',
  [PointSourceType.LEADERBOARD_REWARD]: 'Thưởng BXH',
  [PointSourceType.VOUCHER_REDEEM]: 'Đổi voucher',
};

export const DETAIL_SOURCE_TYPES: PointSourceType[] = [
  PointSourceType.GREEN_ACTION,
  PointSourceType.EVENT_ATTEND,
  PointSourceType.REVIEW_REWARD,
];

export const OTHER_SOURCE_TYPES: PointSourceType[] = [
  PointSourceType.LEADERBOARD,
  PointSourceType.LEADERBOARD_REWARD,
  PointSourceType.VOUCHER_REDEEM,
];

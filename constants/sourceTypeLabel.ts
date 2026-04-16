import { PointSourceType } from 'types/action.types';
import type { TFunction } from 'i18next';

export const SOURCE_TYPE_LABEL_KEYS: Record<PointSourceType, string> = {
  [PointSourceType.GREEN_ACTION]: 'point_history.source_type.green_action',
  [PointSourceType.EVENT_ATTEND]: 'point_history.source_type.event_attend',
  [PointSourceType.REVIEW_REWARD]: 'point_history.source_type.review_reward',
  [PointSourceType.LEADERBOARD]: 'point_history.source_type.leaderboard',
  [PointSourceType.LEADERBOARD_REWARD]: 'point_history.source_type.leaderboard_reward',
  [PointSourceType.VOUCHER_REDEEM]: 'point_history.source_type.voucher_redeem',
};

export const getSourceTypeLabels = (t: TFunction): Record<PointSourceType, string> => ({
  [PointSourceType.GREEN_ACTION]: t(SOURCE_TYPE_LABEL_KEYS[PointSourceType.GREEN_ACTION]),
  [PointSourceType.EVENT_ATTEND]: t(SOURCE_TYPE_LABEL_KEYS[PointSourceType.EVENT_ATTEND]),
  [PointSourceType.REVIEW_REWARD]: t(SOURCE_TYPE_LABEL_KEYS[PointSourceType.REVIEW_REWARD]),
  [PointSourceType.LEADERBOARD]: t(SOURCE_TYPE_LABEL_KEYS[PointSourceType.LEADERBOARD]),
  [PointSourceType.LEADERBOARD_REWARD]: t(
    SOURCE_TYPE_LABEL_KEYS[PointSourceType.LEADERBOARD_REWARD]
  ),
  [PointSourceType.VOUCHER_REDEEM]: t(SOURCE_TYPE_LABEL_KEYS[PointSourceType.VOUCHER_REDEEM]),
});

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

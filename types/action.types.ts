// ============================================================
// GREEN ACTION TYPES
// Mapped from: green_action_types, green_action_posts,
//              post_reviews, post_appeals
// ============================================================

export type PostStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PARTIALLY_APPROVED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'FLAGGED'
  | 'REVOKED';

export type ReviewDecision = 'APPROVE' | 'REJECT' | 'REPORT_SUSPICIOUS';

export type AppealStatus =
  | 'APPEAL_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPEAL_ACCEPTED'
  | 'APPEAL_REJECTED';

// ---- Entities ----

export interface GreenActionType {
  id: string;
  group_name: string;
  action_name: string;
  suggested_points: number;
  location_required: boolean;
  is_active: boolean;
}

export interface GreenActionPost {
  id: string;
  user_id: string;
  action_type_id: string;
  caption: string;
  media_url: string;
  latitude: number | null;
  longitude: number | null;
  action_date: string; // "YYYY-MM-DD"
  status: PostStatus;
  approve_count: number;
  reject_count: number;
  created_at: string;
  // Joined fields (API may include these)
  action_type?: GreenActionType;
  user_display_name?: string;
  user_avatar_url?: string | null;
}

export interface PostReview {
  id: string;
  post_id: string;
  reviewer_id: string;
  decision: ReviewDecision;
  reject_reason_code: string | null;
  reject_reason_note: string | null;
  is_valid: boolean;
  created_at: string;
}

export interface PostAppeal {
  id: string;
  post_id: string;
  user_id: string;
  appeal_reason: string;
  evidence_urls: string[] | null;
  attempt_number: 1 | 2;
  status: AppealStatus;
  admin_note: string | null;
  created_at: string;
}

// ---- API Request shapes ----

export type CreatePostRequest = Pick<
  GreenActionPost,
  'action_type_id' | 'caption' | 'media_url' | 'action_date'
> &
  Partial<Pick<GreenActionPost, 'latitude' | 'longitude'>>;

export interface ReviewPostRequest {
  decision: ReviewDecision;
  reject_reason_code?: string;
  reject_reason_note?: string;
}

export interface AppealPostRequest {
  appeal_reason: string;
  evidence_urls?: string[];
}

// ============================================================
// POINT & WALLET TYPES
// Mapped from: point_rules, point_wallets, point_ledger
// ============================================================

export enum PointSourceType {
  GREEN_ACTION = 'GREEN_ACTION',
  REVIEW_REWARD = 'REVIEW_REWARD',
  EVENT_ATTEND = 'EVENT_ATTEND',
  LEADERBOARD = 'LEADERBOARD',
  VOUCHER_REDEEM = 'VOUCHER_REDEEM',
  LEADERBOARD_REWARD = 'LEADERBOARD_REWARD',
}

export type LedgerStatus = 'REWARDED' | 'REVERSED' | 'FROZEN';

export type WalletStatus = 'ACTIVE' | 'FROZEN';

export interface PointWallet {
  id: string;
  user_id: string;
  total_points: number;
  available_points: number;
  weekly_points: number;
  status: WalletStatus;
  updated_at: string;
}

export interface PointLedgerEntry {
  id: string;
  user_id: string;
  amount: number; // positive = earn, negative = spend
  source_type: PointSourceType;
  source_id: string;
  status: LedgerStatus;
  created_at: string;

  /// extraction
  source_name?: string;
  source_display_url?: string | null;
}

export interface PointRule {
  id: string;
  rule_key: string;
  action_type_id: string | null;
  points: number;
  is_active: boolean;
}

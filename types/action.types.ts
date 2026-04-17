// ============================================================
// GREEN ACTION TYPES
// Mapped from: green_action_types, green_action_posts,
//              post_reviews, post_appeals
// ============================================================

import { SortOption } from '@/constants/enums/sortOptions.enum';
import { BaseQueryParams, PaginationParams } from './common.types';
import { MediaDto } from './media.types';

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
  user_displayName?: string;
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
// FEED PARAMS
export interface FeedQueryParams extends BaseQueryParams {
  search?: string;
  action_type_id?: string;
  sort?: SortOption;
}

export interface FeedApiRequestParams {
  page?: number;
  size?: number;
  sort?: string[];
  authorDisplayName?: string;
  actionTypeId?: string;
  fromDate?: string;
  toDate?: string;
}
//ui
export interface MyPostsQueryParams extends BaseQueryParams {
  status?: PostStatus | 'all';
  sort?: SortOption;
}
//api
export interface MyPostsApiRequestParams extends Omit<MyPostsQueryParams, 'status' | 'sort'> {
  status?: string; // Convert 'all' thành undefined trước khi gửi
  sort?: string[]; // Convert SortOption object thành ["createdAt,desc"]
}

// -------------------------------------
// 3. CREATE POST PARAMS
// -------------------------------------

// [UI State] - Gọn nhẹ, chỉ cần những thứ UI có
export interface CreatePostRequest {
  action_type_id: string;
  caption: string;
  media_url: string; // Lúc upload ảnh xong thì có link này
  media_bucket?: string; // (Tùy chọn) Nếu API upload trả về
  media_key?: string; // (Tùy chọn) Nếu API upload trả về
  latitude?: number;
  longitude?: number;
  action_date: string; // YYYY-MM-DD
}

export interface CreatePostApiRequest {
  actionTypeId: string;
  caption: string;
  media: MediaDto;
  latitude?: number;
  longitude?: number;
  actionDate: string;
}

export interface ReviewPostRequest {
  decision: ReviewDecision;
  reject_reason_code?: string;
  reject_reason_note?: string;
}

export interface PostReviewDto {
  reviewId: string;
  reviewerId: string;
  reviewerDisplayName: string;
  decision: ReviewDecision;
  createdAt: string;
  rejectReasonNote?: string | null;
}

export interface GreenActionPostDetailDto {
  id: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
  actionTypeName: string;
  groupName: string;
  caption: string;
  mediaUrl: string;
  approveCount: number;
  rejectCount: number;
  location: string | null;
  reviews: PostReviewDto[];
  actionDate: string;
  status: PostStatus;
  createdAt: string;
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

// ============================================================
// VOUCHER TYPES
// Mapped from: voucher_templates, user_vouchers
// ============================================================

import { Use } from 'react-native-svg';
import { UserProfile } from './user.type';

export type VoucherTemplateStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'DEPLETED';

export const USER_VOUCHER_STATUS = {
  AVAILABLE: 'AVAILABLE',
  USED: 'USED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;

export type UserVoucherStatus = keyof typeof USER_VOUCHER_STATUS;

export type VoucherSource = 'REDEEM' | 'LEADERBOARD_REWARD' | 'GARDEN_REWARD';

export interface VoucherTemplate {
  id: string;
  name: string;
  partner_name: string;
  partner_logo_url: string | null;
  thumbnail_url: string | null;
  description: string;
  required_points: number;
  total_stock: number;
  remaining_stock: number;
  usage_conditions: string;
  valid_until: string;
  status: VoucherTemplateStatus;
}

export interface UserVoucher {
  id: string;
  user_id: string;
  voucher_template_id: string;
  voucher_code: string;
  source: VoucherSource;
  status: UserVoucherStatus;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  // Joined
  template?: VoucherTemplate;
}

export interface RedeemVoucherRequest {
  voucher_template_id: string;
}

// ============================================================
// STREAK & GARDEN TYPES
// Mapped from: streaks, seeds, plant_progresses, garden_archives
// ============================================================

export type StreakStatus = 'NOT_STARTED' | 'ACTIVE' | 'BROKEN';

export enum PlantStatus {
  SEED = 'SEED',
  SPROUT = 'SPROUT',
  GROWING = 'GROWING',
  BLOOMING = 'BLOOMING',
  MATURED = 'MATURED',
}

export enum CycleType {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
}

export type GardenRewardStatus = 'MATURED' | 'REWARDED';

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_valid_date: string | null; // "YYYY-MM-DD"
  status: StreakStatus;
  restore_used_this_month: number;
  restore_month: string | null;
  last_break_date: string | null;
  broken_streak: number;
  updated_at: string;
}

export interface Seed {
  id: string;
  name: string;
  stage1_image_url: string;
  stage2_image_url: string;
  stage3_image_url: string;
  stage4_image_url: string;
  days_to_mature: number;
  stage2_from_day: number;
  stage3_from_day: number;
  stage4_from_day: number;
  reward_voucher_template_id: string | null;
  reward_voucher_template?: VoucherTemplate;
  cycle_type: CycleType;
  is_active: boolean;
}

export interface PlantProgress {
  id: string;
  user_id: string;
  seed_id: string;
  progress_days: number;
  status: PlantStatus;
  started_at: string;
  matured_at: string | null;
  // Joined
  seed?: Seed;
}

export interface PlantDailyLog {
  id: string;
  user_id: string;
  user: UserProfile;
  plant_progress_id: string;
  plant_progress: PlantProgress;
  log_date: Date;
  stage: PlantStatus;
  is_active_day: boolean;
  green_post_url: string;
  image_url: string;
  created_at: string;
}

export interface PlantDailyLogQueryParams {
  plant_progress_id?: string;
  user_id?: string;
  from_date?: string;
  to_date?: string;
  log_date?: string;
}

export interface CreatePlantDailyLogRequest {
  plant_progress_id: string;
  log_date: string;
  stage: PlantStatus;
  is_active_day: boolean;
  green_post_url?: string;
  image_url?: string;
}

export interface GardenArchive {
  id: string;
  user_id: string;
  seed_id: string;
  plant_progress_id: string;
  days_taken: number;
  reward_status: GardenRewardStatus;
  display_image_url: string;
  user_voucher_id: string | null;
  archived_at: string;
  // Joined
  seed?: Seed;
  plant_progress?: PlantProgress;
}

// ============================================================
// LEADERBOARD TYPES
// Mapped from: leaderboard_periods, leaderboard_snapshots
// ============================================================

export enum LeaderboardScope {
  NATIONAL = 'NATIONAL',
  PROVINCIAL = 'PROVINCIAL',
}

export type LeaderboardPeriodStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type SnapshotStatus = 'COMPUTING' | 'PUBLISHED' | 'REVISED';

export type RewardStatus = 'PENDING_REWARD' | 'REWARDED' | 'FAILED';

export interface LeaderboardPeriod {
  id: string;
  week_start: string; // "YYYY-MM-DD"
  week_end: string;
  lock_at: string;
  national_reward_config: Record<number, string>; // rank → voucher_template_id
  provincial_reward_config: Record<number, string>;
  status: LeaderboardPeriodStatus;
}

export interface LeaderboardEntry {
  id: string;
  period_id: string;
  // period: LeaderboardPeriod;
  user_id: string;
  user_profiles: UserProfile;
  scope: LeaderboardScope;
  province: string | null;
  rank: number;
  weekly_points: number;
  is_winner: boolean;
  reward_status: RewardStatus;
  status: SnapshotStatus;
  // Joined
  displayName?: string;
  avatar_url?: string | null;
}

import { apiClient } from 'lib/apiClient';
import {
  Streak,
  PlantProgress,
  GardenArchive,
  Seed,
  VoucherTemplate,
  UserVoucher,
  RedeemVoucherRequest,
  LeaderboardEntry,
  LeaderboardScope,
} from 'types/gamification.types';
import { ApiResponse } from 'types/common.types';

import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_STREAK,
  MOCK_PLANT_PROGRESS,
  MOCK_GARDEN_ARCHIVES,
  MOCK_SEEDS,
  MOCK_VOUCHER_TEMPLATES,
  MOCK_USER_VOUCHERS,
  MOCK_LEADERBOARD_NATIONAL,
} from './mock/gamification.mock';

// ============================================================
// GAMIFICATION SERVICE
// ============================================================
export const gamificationService = {
  async getMyStreak(): Promise<ApiResponse<Streak>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return mockSuccess(MOCK_STREAK);
    }
    const { data } = await apiClient.get<ApiResponse<Streak>>('/streaks/me');
    return data;
  },

  async getMyPlant(): Promise<ApiResponse<PlantProgress | null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return mockSuccess(MOCK_PLANT_PROGRESS);
    }
    const { data } = await apiClient.get<ApiResponse<PlantProgress | null>>('/garden/active');
    return data;
  },

  async getGardenArchives(): Promise<ApiResponse<GardenArchive[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_GARDEN_ARCHIVES);
    }
    const { data } = await apiClient.get<ApiResponse<GardenArchive[]>>('/garden/archives');
    return data;
  },

  async getSeeds(): Promise<ApiResponse<Seed[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return mockSuccess(MOCK_SEEDS.filter((s) => s.is_active));
    }
    const { data } = await apiClient.get<ApiResponse<Seed[]>>('/seeds');
    return data;
  },

  async getAvailableVouchers(): Promise<ApiResponse<VoucherTemplate[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_VOUCHER_TEMPLATES.filter((v) => v.status === 'ACTIVE'));
    }
    const { data } = await apiClient.get<ApiResponse<VoucherTemplate[]>>('/vouchers/available');
    return data;
  },

  async getMyVouchers(): Promise<ApiResponse<UserVoucher[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_USER_VOUCHERS);
    }
    const { data } = await apiClient.get<ApiResponse<UserVoucher[]>>('/vouchers/me');
    return data;
  },

  async redeemVoucher(payload: RedeemVoucherRequest): Promise<ApiResponse<UserVoucher>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const template = MOCK_VOUCHER_TEMPLATES.find((v) => v.id === payload.voucher_template_id);
      if (!template) throw new Error('Voucher not found');
      const newVoucher: UserVoucher = {
        id: `uvoucher-${Date.now()}`,
        user_id: 'usr-001',
        voucher_template_id: template.id,
        voucher_code: `GREEN-MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        source: 'REDEEM',
        status: 'AVAILABLE',
        expires_at: template.valid_until,
        used_at: null,
        created_at: new Date().toISOString(),
        template,
      };
      return mockSuccess(newVoucher);
    }
    const { data } = await apiClient.post<ApiResponse<UserVoucher>>('/vouchers/redeem', payload);
    return data;
  },
};

// ============================================================
// LEADERBOARD SERVICE
// ============================================================
export const leaderboardService = {
  async getLeaderboard(
    scope: LeaderboardScope,
    province?: string
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      return mockSuccess(MOCK_LEADERBOARD_NATIONAL);
    }
    const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', {
      params: { scope, province },
    });
    return data;
  },

  async claimLeaderboardReward(period_id: string): Promise<ApiResponse<VoucherTemplate>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const rewardVoucher = MOCK_VOUCHER_TEMPLATES.find((voucher) => voucher.id === 'vt-004');
      if (!rewardVoucher) throw new Error('Reward voucher template not found');
      return mockSuccess(rewardVoucher);
    }
    const { data } = await apiClient.post<ApiResponse<VoucherTemplate>>('/leaderboard/claim', {
      period_id,
    });
    return data;
  },
};

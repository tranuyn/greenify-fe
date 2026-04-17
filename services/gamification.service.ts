import { apiClient } from 'lib/apiClient';
import {
  Streak,
  PlantProgress,
  GardenArchive,
  PlantDailyLog,
  PlantDailyLogQueryParams,
  CreatePlantDailyLogRequest,
  Seed,
  SeedRewardVoucher,
  VoucherTemplate,
  UserVoucher,
  UserVoucherQueryParams,
  RedeemVoucherRequest,
  LeaderboardScope,
  WeeklyLeaderboard,
  WeeklyLeaderboardPrizes,
} from 'types/gamification.types';
import { ApiResponse, PageResponse } from 'types/common.types';

import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_STREAK,
  MOCK_PLANT_PROGRESS,
  MOCK_GARDEN_ARCHIVES,
  MOCK_PLANT_DAILY_LOGS,
  MOCK_SEEDS,
  MOCK_SEED_REWARD_VOUCHERS,
  MOCK_VOUCHER_TEMPLATES,
  MOCK_USER_VOUCHERS,
  MOCK_LEADERBOARD_NATIONAL,
} from './mock/gamification.mock';

// ============================================================
// GAMIFICATION SERVICE
// ============================================================
export const gamificationService = {
  async getMyStreak(): Promise<Streak> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return MOCK_STREAK;
    }
    const { data } = await apiClient.get<Streak>('/streak/me');
    return data;
  },

  async getMyPlant(): Promise<PlantProgress> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return MOCK_PLANT_PROGRESS;
    }
    const { data } = await apiClient.get<PlantProgress>('/garden/plant/current');
    return data;
  },

  async getGardenArchives(): Promise<PageResponse<GardenArchive>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return {
        content: MOCK_GARDEN_ARCHIVES,
        page: 0,
        size: 100,
        totalElements: MOCK_GARDEN_ARCHIVES.length,
        totalPages: 1,
      };
    }
    const { data } = await apiClient.get<PageResponse<GardenArchive>>('/garden/archives');
    return data;
  },

  async getPlantDailyLogs(params?: PlantDailyLogQueryParams): Promise<PlantDailyLog[]> {
    if (IS_MOCK_MODE) {
      await mockDelay(350);
      let logs = [...MOCK_PLANT_DAILY_LOGS];

      if (params?.from_date) {
        const fromTime = new Date(params.from_date).getTime();
        logs = logs.filter((log) => log.logDate.getTime() >= fromTime);
      }

      if (params?.to_date) {
        const toTime = new Date(params.to_date).getTime();
        logs = logs.filter((log) => log.logDate.getTime() <= toTime);
      }

      if (params?.log_date) {
        const targetTime = new Date(params.log_date).getTime();
        logs = logs.filter((log) => log.logDate.getTime() === targetTime);
      }

      return logs;
    }
    const { data } = await apiClient.get<PlantDailyLog[]>('/garden/plant/daily-logs', {
      params,
    });
    return data;
  },

  async changeCurrentSeed(seedId: string): Promise<PlantProgress> {
    const { data } = await apiClient.post<PlantProgress>('/garden/plant', { seedId });
    return data;
  },

  async createPlantDailyLog(payload: CreatePlantDailyLogRequest): Promise<PlantDailyLog> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const mockLog: PlantDailyLog = {
        logDate: new Date(payload.log_date),
        stage: payload.stage,
        is_active_day: payload.is_active_day,
        isChangeState: true,
        greenPostUrl: payload.green_post_url ?? '',
        imageUrl: payload.image_url ?? '',
      };
      return mockLog;
    }

    const { data } = await apiClient.post<PlantDailyLog>('/garden/daily-logs', payload);
    return data;
  },

  async getSeeds(): Promise<PageResponse<Seed>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return {
        content: MOCK_SEEDS.filter((s) => s.is_active),
        page: 0,
        size: 100,
        totalElements: MOCK_SEEDS.filter((s) => s.is_active).length,
        totalPages: 1,
      };
    }
    const { data } = await apiClient.get<PageResponse<Seed>>('/garden/seeds');
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

  async getVoucherBySeed(seedId: string): Promise<SeedRewardVoucher> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return MOCK_SEED_REWARD_VOUCHERS;
    }
    const { data } = await apiClient.get<SeedRewardVoucher>(
      `/garden/seeds/${seedId}/reward-voucher`
    );
    return data;
  },

  async getMyVouchers(params?: UserVoucherQueryParams): Promise<PageResponse<UserVoucher>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const filteredVouchers = params?.status
        ? MOCK_USER_VOUCHERS.filter((voucher) => voucher.status === params.status)
        : MOCK_USER_VOUCHERS;

      const pageIndex = params?.page ?? 0;
      const pageSize = params?.size ?? 20;
      const start = pageIndex * pageSize;
      const content = filteredVouchers.slice(start, start + pageSize);

      return {
        content,
        page: pageIndex,
        size: pageSize,
        totalElements: filteredVouchers.length,
        totalPages: Math.ceil(filteredVouchers.length / pageSize),
      };
    }
    const { data } = await apiClient.get<PageResponse<UserVoucher>>('/wallet/vouchers', {
      params,
    });
    return data;
  },

  async redeemVoucher(payload: RedeemVoucherRequest): Promise<ApiResponse<UserVoucher>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const template = MOCK_VOUCHER_TEMPLATES[0];
      if (!template) throw new Error('Voucher not found');
      const newVoucher: UserVoucher = {
        id: `uvoucher-${Date.now()}`,
        voucherTemplateId: template.id,
        voucherCode: `GREEN-MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        source: 'REDEEM',
        status: 'AVAILABLE',
        expiresAt: new Date(template.valid_until),
        usedAt: null,
        voucherName: template.name,
        partnerName: template.partner_name,
        thumbnailUrl: template.thumbnail_url || '',
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
    weekStartDate: string,
    province?: string
  ): Promise<WeeklyLeaderboard> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      return {
        ...MOCK_LEADERBOARD_NATIONAL,
        scope,
        province: province ?? MOCK_LEADERBOARD_NATIONAL.province,
        weekStartDate,
      };
    }
    const { data } = await apiClient.get<WeeklyLeaderboard>('/leaderboard/weekly', {
      params: { scope, province, weekStartDate },
    });
    return data;
  },

  async claimLeaderboardReward(weekStartDate: string): Promise<WeeklyLeaderboardPrizes> {
    return this.getWeeklyPrizes(weekStartDate);
  },

  async getWeeklyPrizes(weekStartDate: string): Promise<WeeklyLeaderboardPrizes> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const nationalTemplate = MOCK_VOUCHER_TEMPLATES.find((voucher) => voucher.id === 'vt-004');
      const provincialTemplate = MOCK_VOUCHER_TEMPLATES.find((voucher) => voucher.id === 'vt-001');
      if (!nationalTemplate || !provincialTemplate) {
        throw new Error('Leaderboard weekly prizes mock data not found');
      }

      return {
        prizeConfigId: 'prize-config-001',
        weekStartDate,
        lockAt: `${weekStartDate}T23:59:59Z`,
        status: 'CONFIGURED',
        nationalReservedCount: 5,
        provincialReservedCount: 63,
        distributedAt: null,
        nationalVoucher: {
          id: nationalTemplate.id,
          name: nationalTemplate.name,
          partnerName: nationalTemplate.partner_name,
          description: nationalTemplate.description,
          requiredPoints: nationalTemplate.required_points,
          totalStock: nationalTemplate.total_stock,
          remainingStock: nationalTemplate.remaining_stock,
          usageConditions: nationalTemplate.usage_conditions,
          validUntil: nationalTemplate.valid_until,
          partnerLogoUrl: nationalTemplate.partner_logo_url,
          thumbnailUrl: nationalTemplate.thumbnail_url,
          status: nationalTemplate.status,
        },
        provincialVoucher: {
          id: provincialTemplate.id,
          name: provincialTemplate.name,
          partnerName: provincialTemplate.partner_name,
          description: provincialTemplate.description,
          requiredPoints: provincialTemplate.required_points,
          totalStock: provincialTemplate.total_stock,
          remainingStock: provincialTemplate.remaining_stock,
          usageConditions: provincialTemplate.usage_conditions,
          validUntil: provincialTemplate.valid_until,
          partnerLogoUrl: provincialTemplate.partner_logo_url,
          thumbnailUrl: provincialTemplate.thumbnail_url,
          status: provincialTemplate.status,
        },
      };
    }

    const { data } = await apiClient.get<WeeklyLeaderboardPrizes>('/leaderboard/weekly/prizes', {
      params: { weekStartDate },
    });
    return data;
  },
};

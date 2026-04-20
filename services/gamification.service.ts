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
  LeaderboardScope,
  WeeklyLeaderboard,
  WeeklyLeaderboardPrizes,
  MyVouchersQueryParams,
  AvailableVouchersResponse,
  AvailableVouchersQueryParams,
} from 'types/gamification.types';
import { ApiResponse, PageResponse } from 'types/common.types';

import { mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_STREAK,
  MOCK_PLANT_PROGRESS,
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
    // if (IS_MOCK_MODE) {
    //   await mockDelay(300);
    //   return MOCK_STREAK;
    // }
    const { data } = await apiClient.get<Streak>('/streak/me');
    return data;
  },

  async getMyPlant(): Promise<PlantProgress> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(300);
    //   return MOCK_PLANT_PROGRESS;
    // }
    const { data } = await apiClient.get<PlantProgress>('/garden/plant/current');
    return data;
  },

  async getGardenArchives(): Promise<PageResponse<GardenArchive>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   return {
    //     content: MOCK_GARDEN_ARCHIVES,
    //     page: 0,
    //     size: 100,
    //     totalElements: MOCK_GARDEN_ARCHIVES.length,
    //     totalPages: 1,
    //   };
    // }
    const { data } = await apiClient.get<PageResponse<GardenArchive>>('/garden/archives');
    return data;
  },

  async getPlantDailyLogs(params?: PlantDailyLogQueryParams): Promise<PlantDailyLog[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(350);
    //   let logs = [...MOCK_PLANT_DAILY_LOGS];

    //   if (params?.from_date) {
    //     const fromTime = new Date(params.from_date).getTime();
    //     logs = logs.filter((log) => log.logDate.getTime() >= fromTime);
    //   }

    //   if (params?.to_date) {
    //     const toTime = new Date(params.to_date).getTime();
    //     logs = logs.filter((log) => log.logDate.getTime() <= toTime);
    //   }

    //   if (params?.log_date) {
    //     const targetTime = new Date(params.log_date).getTime();
    //     logs = logs.filter((log) => log.logDate.getTime() === targetTime);
    //   }

    //   return logs;
    // }
    const { data } = await apiClient.get<PlantDailyLog[]>('/garden/plant/daily-logs', {
      params,
    });
    console.log('API Plant Daily Logs:', data);
    return data;
  },

  async changeCurrentSeed(seedId: string): Promise<PlantProgress> {
    const { data } = await apiClient.post<PlantProgress>('/garden/plant', { seedId });
    return data;
  },

  async createPlantDailyLog(payload: CreatePlantDailyLogRequest): Promise<PlantDailyLog> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const mockLog: PlantDailyLog = {
    //     logDate: new Date(payload.log_date),
    //     stage: payload.stage,
    //     is_active_day: payload.is_active_day,
    //     isChangeState: true,
    //     greenPostUrl: payload.green_post_url ?? '',
    //     imageUrl: payload.image_url ?? '',
    //   };
    //   return mockLog;
    // }

    const { data } = await apiClient.post<PlantDailyLog>('/garden/daily-logs', payload);
    return data;
  },

  async getSeeds(): Promise<PageResponse<Seed>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(300);
    //   return {
    //     content: MOCK_SEEDS.filter((s) => s.is_active),
    //     page: 0,
    //     size: 100,
    //     totalElements: MOCK_SEEDS.filter((s) => s.is_active).length,
    //     totalPages: 1,
    //   };
    // }
    const { data } = await apiClient.get<PageResponse<Seed>>('/garden/seeds');
    return data;
  },

  async getAvailableVouchers(
    params?: AvailableVouchersQueryParams
  ): Promise<AvailableVouchersResponse> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);

    //   // Giả định bạn đã update MOCK_VOUCHER_TEMPLATES sang camelCase
    //   let filtered = MOCK_VOUCHER_TEMPLATES.filter((v) => v.status === 'ACTIVE');

    //   // Lọc theo khoảng điểm
    //   if (params?.minRequiredPoints !== undefined) {
    //     filtered = filtered.filter((v) => v.requiredPoints >= params.minRequiredPoints!);
    //   }
    //   if (params?.maxRequiredPoints !== undefined) {
    //     filtered = filtered.filter((v) => v.requiredPoints <= params.maxRequiredPoints!);
    //   }

    //   // Phân trang
    //   const pageIndex = params?.page ?? 1;
    //   const pageSize = params?.size ?? 20;
    //   const start = (pageIndex - 1) * pageSize;
    //   const paginated = filtered.slice(start, start + pageSize);

    //   return mockSuccess({
    //     availablePoints: 1250, // Giả lập user đang có 1250 điểm
    //     content: paginated,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalElements: filtered.length,
    //     totalPages: Math.ceil(filtered.length / pageSize),
    //   });
    // }

    // ==========================================
    // 2. GỌI API THẬT
    // ==========================================
    const { data } = await apiClient.get<AvailableVouchersResponse>(
      '/vouchers', // Endpoint chuẩn Swagger mới
      {
        params: {
          page: params?.page ? params.page - 1 : 0, // Dịch page 1 -> 0
          size: params?.size ?? 20,
          minRequiredPoints: params?.minRequiredPoints,
          maxRequiredPoints: params?.maxRequiredPoints,
        },
      }
    );
    return data;
  },

  async getVoucherBySeed(seedId: string): Promise<SeedRewardVoucher> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return MOCK_SEED_REWARD_VOUCHERS;
    // }
    const { data } = await apiClient.get<SeedRewardVoucher>(
      `/garden/seeds/${seedId}/reward-voucher`
    );
    return data;
  },

  async getMyVouchers(params?: MyVouchersQueryParams): Promise<PageResponse<UserVoucher>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   let mappedVouchers: UserVoucher[] = [...MOCK_USER_VOUCHERS];

    //       // Lọc theo Status (Bỏ qua nếu chọn 'all' hoặc không truyền)
    //   if (params?.status && params.status !== 'all') {
    //     mappedVouchers = mappedVouchers.filter((v) => v.status === params.status);
    //   }

    //   // Lọc theo Source (Bỏ qua nếu chọn 'all' hoặc không truyền)
    //   if (params?.source && params.source !== 'all') {
    //     mappedVouchers = mappedVouchers.filter((v) => v.source === params.source);
    //   }

    //   const pageIndex = params?.page ?? 1;
    //   const pageSize = params?.size ?? 20;
    //   const start = (pageIndex - 1) * pageSize;
    //   const paginatedVouchers = mappedVouchers.slice(start, start + pageSize);

    //   return mockSuccess({
    //     content: paginatedVouchers,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalElements: mappedVouchers.length,
    //     totalPages: Math.ceil(mappedVouchers.length / pageSize),
    //   });
    // }
    const { data } = await apiClient.get<PageResponse<UserVoucher>>('/wallet/vouchers', {
      params: {
        // Xử lý logic lệch trang: UI đếm từ 1, BE đếm từ 0
        page: params?.page ? params.page - 1 : 0,
        size: params?.size ?? 20,
        // Nếu UI gửi 'all', ta chuyển thành undefined để BE không filter
        status: params?.status === 'all' ? undefined : params?.status,
        source: params?.source === 'all' ? undefined : params?.source,
      },
    });
    return data;
  },

  async exchangeVoucher(templateId: string): Promise<UserVoucher> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(800);

    //   const template =
    //     MOCK_VOUCHER_TEMPLATES.find((t) => t.id === templateId) || MOCK_VOUCHER_TEMPLATES[0];
    //   if (!template) throw new Error('Voucher not found');

    //   const newVoucher: UserVoucher = {
    //     id: `uvoucher-${Date.now()}`,
    //     voucherTemplateId: template.id,
    //     voucherCode: `GREEN-MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    //     source: 'REDEEM',
    //     status: 'AVAILABLE',
    //     expiresAt: template.validUntil,
    //     usedAt: null,
    //     voucherName: template.name,
    //     partnerName: template.partnerName,
    //     partnerLogoUrl: template.partnerLogoUrl,
    //     description: template.description,
    //     usageConditions: template.usageConditions,
    //     thumbnailUrl: template.thumbnailUrl,
    //   };

    //   return mockSuccess(newVoucher);
    // }

    const { data } = await apiClient.post<UserVoucher>(`/vouchers/${templateId}/exchange`);
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
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);
    //   return {
    //     ...MOCK_LEADERBOARD_NATIONAL,
    //     scope,
    //     province: province ?? MOCK_LEADERBOARD_NATIONAL.province,
    //     weekStartDate,
    //   };
    // }
    const { data } = await apiClient.get<WeeklyLeaderboard>('/leaderboard/weekly', {
      params: { scope, province, weekStartDate },
    });
    return data;
  },

  async claimLeaderboardReward(weekStartDate: string): Promise<WeeklyLeaderboardPrizes> {
    return this.getWeeklyPrizes(weekStartDate);
  },

  async getWeeklyPrizes(weekStartDate: string): Promise<WeeklyLeaderboardPrizes> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const nationalTemplate = MOCK_VOUCHER_TEMPLATES.find((voucher) => voucher.id === 'vt-004');
    //   const provincialTemplate = MOCK_VOUCHER_TEMPLATES.find((voucher) => voucher.id === 'vt-001');
    //   if (!nationalTemplate || !provincialTemplate) {
    //     throw new Error('Leaderboard weekly prizes mock data not found');
    //   }

    //   return {
    //     prizeConfigId: 'prize-config-001',
    //     weekStartDate,
    //     lockAt: `${weekStartDate}T23:59:59Z`,
    //     status: 'CONFIGURED',
    //     nationalReservedCount: 5,
    //     provincialReservedCount: 63,
    //     distributedAt: null,
    //     nationalVoucher: {
    //       id: nationalTemplate.id,
    //       name: nationalTemplate.name,
    //       partnerName: nationalTemplate.partnerName,
    //       description: nationalTemplate.description,
    //       requiredPoints: nationalTemplate.requiredPoints,
    //       totalStock: nationalTemplate.totalStock,
    //       remainingStock: nationalTemplate.remainingStock,
    //       usageConditions: nationalTemplate.usageConditions,
    //       validUntil: nationalTemplate.validUntil,
    //       partnerLogoUrl: nationalTemplate.partnerLogoUrl,
    //       thumbnailUrl: nationalTemplate.thumbnailUrl,
    //       status: nationalTemplate.status,
    //     },
    //     provincialVoucher: {
    //       id: provincialTemplate.id,
    //       name: provincialTemplate.name,
    //       partnerName: provincialTemplate.partnerName,
    //       description: provincialTemplate.description,
    //       requiredPoints: provincialTemplate.requiredPoints,
    //       totalStock: provincialTemplate.totalStock,
    //       remainingStock: provincialTemplate.remainingStock,
    //       usageConditions: provincialTemplate.usageConditions,
    //       validUntil: provincialTemplate.validUntil,
    //       partnerLogoUrl: provincialTemplate.partnerLogoUrl,
    //       thumbnailUrl: provincialTemplate.thumbnailUrl,
    //       status: provincialTemplate.status,
    //     },
    //   };
    // }

    const { data } = await apiClient.get<WeeklyLeaderboardPrizes>('/leaderboard/weekly/prizes', {
      params: { weekStartDate },
    });
    return data;
  },
};

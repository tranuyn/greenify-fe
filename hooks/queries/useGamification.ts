import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { gamificationService, leaderboardService } from 'services/gamification.service';
import {
  LeaderboardScope,
  PlantDailyLogQueryParams,
  UserVoucherQueryParams,
} from 'types/gamification.types';

export const useMyStreak = () => {
  return useQuery({
    queryKey: QUERY_KEYS.streak.mine(),
    queryFn: () => gamificationService.getMyStreak(),
    // Streak quan trọng, cần tươi — stale sau 1 phút
    staleTime: 60 * 1000,
  });
};

export const useMyPlant = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.active(),
    queryFn: () => gamificationService.getMyPlant(),
    staleTime: 60 * 1000,
  });
};

export const useGardenArchives = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.archives(),
    queryFn: () => gamificationService.getGardenArchives().then((r) => r.content),
  });
};

export const usePlantDailyLogs = (params?: PlantDailyLogQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.dailyLogs(params),
    queryFn: () => gamificationService.getPlantDailyLogs(params).then((r) => r),
  });
};

export const useSeeds = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.seeds(),
    queryFn: () => gamificationService.getSeeds().then((r) => r.content),
    staleTime: 30 * 60 * 1000,
  });
};

export const useAvailableVouchers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchers.available(),
    queryFn: () => gamificationService.getAvailableVouchers().then((r) => r.data),
  });
};

export const useMyVouchers = (params?: UserVoucherQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchers.mine(params),
    queryFn: () => gamificationService.getMyVouchers(params).then((r) => r.content),
  });
};

export const useVoucherBySeed = (seedId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchers.bySeed(seedId ?? ''),
    queryFn: () => gamificationService.getVoucherBySeed(seedId ?? ''),
    enabled: Boolean(seedId),
  });
};

export const useLeaderboard = (
  scope: LeaderboardScope,
  weekStartDate: string,
  province?: string
) => {
  return useQuery({
    queryKey: QUERY_KEYS.leaderboard.scope(scope, weekStartDate, province),
    queryFn: () => leaderboardService.getLeaderboard(scope, weekStartDate, province),
    enabled: Boolean(weekStartDate),
    // Leaderboard update theo tuần, không cần fresh liên tục
    staleTime: 5 * 60 * 1000,
  });
};

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { gamificationService, leaderboardService } from 'services/gamification.service';
import { LeaderboardScope, PlantDailyLogQueryParams } from 'types/gamification.types';

export const useMyStreak = () => {
  return useQuery({
    queryKey: QUERY_KEYS.streak.mine(),
    queryFn: () => gamificationService.getMyStreak().then((r) => r.data),
    // Streak quan trọng, cần tươi — stale sau 1 phút
    staleTime: 60 * 1000,
  });
};

export const useMyPlant = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.active(),
    queryFn: () => gamificationService.getMyPlant().then((r) => r.data),
    staleTime: 60 * 1000,
  });
};

export const useGardenArchives = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.archives(),
    queryFn: () => gamificationService.getGardenArchives().then((r) => r.data),
  });
};

export const usePlantDailyLogs = (params?: PlantDailyLogQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.dailyLogs(params),
    queryFn: () => gamificationService.getPlantDailyLogs(params).then((r) => r.data),
  });
};

export const useSeeds = () => {
  return useQuery({
    queryKey: QUERY_KEYS.garden.seeds(),
    queryFn: () => gamificationService.getSeeds().then((r) => r.data),
    staleTime: 30 * 60 * 1000, // seed là master data
  });
};

export const useAvailableVouchers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchers.available(),
    queryFn: () => gamificationService.getAvailableVouchers().then((r) => r.data),
  });
};

export const useMyVouchers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchers.mine(),
    queryFn: () => gamificationService.getMyVouchers().then((r) => r.data),
  });
};

export const useLeaderboard = (scope: LeaderboardScope, province?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.leaderboard.scope(scope, province),
    queryFn: () => leaderboardService.getLeaderboard(scope, province).then((r) => r.data),
    // Leaderboard update theo tuần, không cần fresh liên tục
    staleTime: 5 * 60 * 1000,
  });
};

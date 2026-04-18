import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { gamificationService, leaderboardService } from 'services/gamification.service';
import { CreatePlantDailyLogRequest } from 'types/gamification.types';

export const useExchangeVoucher = () => {
  return useMutation({
    mutationFn: (templateId: string) => gamificationService.exchangeVoucher(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers.all });
    },
  });
};

export const useClaimLeaderboardReward = (weekStartDate: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.leaderboard.weeklyPrizes(weekStartDate),
    queryFn: () => leaderboardService.getWeeklyPrizes(weekStartDate),
    enabled: enabled && Boolean(weekStartDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useWeeklyLeaderboardPrizes = (weekStartDate: string, enabled = true) => {
  return useClaimLeaderboardReward(weekStartDate, enabled);
};

export const useCreatePlantDailyLog = () => {
  return useMutation({
    mutationFn: (payload: CreatePlantDailyLogRequest) =>
      gamificationService.createPlantDailyLog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.dailyLogs() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.active() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak.mine() });
    },
  });
};

export const useChangeCurrentSeed = () => {
  return useMutation({
    mutationFn: (seedId: string) => gamificationService.changeCurrentSeed(seedId),
    onSuccess: (updatedPlant) => {
      queryClient.setQueryData(QUERY_KEYS.garden.active(), updatedPlant);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.active() });
    },
  });
};

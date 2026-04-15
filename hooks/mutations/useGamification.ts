import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { gamificationService, leaderboardService } from 'services/gamification.service';
import { CreatePlantDailyLogRequest, RedeemVoucherRequest } from 'types/gamification.types';

export const useRedeemVoucher = () => {
  return useMutation({
    mutationFn: (payload: RedeemVoucherRequest) => gamificationService.redeemVoucher(payload),
    onSuccess: () => {
      // Điểm giảm + ví voucher thay đổi → invalidate cả hai
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers.all });
    },
  });
};

export const useClaimLeaderboardReward = () => {
  return useMutation({
    mutationFn: (periodId: string) => leaderboardService.claimLeaderboardReward(periodId),
    onSuccess: (_response, periodId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaderboard.claim(periodId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaderboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers.mine() });
    },
  });
};

export const useCreatePlantDailyLog = () => {
  return useMutation({
    mutationFn: (payload: CreatePlantDailyLogRequest) => gamificationService.createPlantDailyLog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.dailyLogs() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.active() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak.mine() });
    },
  });
};

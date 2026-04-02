import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { gamificationService } from 'services/gamification.service';
import { RedeemVoucherRequest } from 'types/gamification.types';

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
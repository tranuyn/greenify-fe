import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { walletService } from 'services/action.service';
import { PaginationParams } from 'types/common.types';
import { PointSourceType } from 'types/action.types';

export type LedgerTimeFilter = 'week' | 'month';

export interface PointLedgerQueryParams extends PaginationParams {
  time?: LedgerTimeFilter[];
  source_type?: PointSourceType[];
}

export const useMyWallet = () => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.mine(),
    queryFn: () => walletService.getMyWallet(),
  });
};

export const usePointLedger = (params?: PointLedgerQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.ledger(params),
    queryFn: () => walletService.getMyPointHistory(params),
  });
};

export const useMyCo2e = () => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.co2e(),
    queryFn: () => walletService.getMyCo2e(),
  });
};

export const useMyCo2eHistory = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.co2eHistory(params),
    queryFn: () => walletService.getMyCo2eHistory(params),
  });
};

export const useUITBannerCo2e = () => {
  const query = useMyCo2e();

  return {
    ...query,
    totalCo2eKg: query.data?.totalCo2eKg ?? 0,
  };
};

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
    queryFn: () => walletService.getMyWallet().then((r) => r.data),
  });
};

export const usePointLedger = (params?: PointLedgerQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.ledger(params),
    queryFn: () => walletService.getLedger(params).then((r) => r.data),
  });
};

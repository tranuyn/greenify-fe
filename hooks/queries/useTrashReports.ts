import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { trashService } from 'services/community.service';
import { PaginationParams } from 'types/common.types';

export const useTrashReports = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.trashReports.list(params),
    queryFn: () => trashService.getReports(params).then((r) => r.data),
  });
};
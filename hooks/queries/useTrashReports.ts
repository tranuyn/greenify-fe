import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { trashService } from 'services/community.service';
import { TrashSpotQueryParams } from 'types/community.types';

export const useTrashSpots = (params?: TrashSpotQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.trashSpots.list(params),
    queryFn: () => trashService.getTrashSpots(params),
  });
};

export const useTrashSpotDetail = (id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.trashSpots.detail(id ?? ''),
    queryFn: () => trashService.getTrashSpotById(id as string),
    enabled: Boolean(id),
  });
};

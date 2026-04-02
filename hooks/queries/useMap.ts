import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { mapService } from 'services/community.service';

export const useStations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stations.all,
    queryFn: () => mapService.getStations().then((r) => r.data),
    // Danh sách trạm ít thay đổi
    staleTime: 15 * 60 * 1000,
  });
};
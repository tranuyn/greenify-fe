import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { mapService } from 'services/community.service';

export const useStations = (wasteTypeID?: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.stations.list(wasteTypeID ?? undefined),
    queryFn: () => mapService.getStations(wasteTypeID ?? undefined),
    // Danh sách trạm ít thay đổi
    staleTime: 15 * 60 * 1000,
  });
};

export const useWasteTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stations.wasteTypes(),
    queryFn: () => mapService.getAllWasteType(),
    staleTime: 60 * 60 * 1000,
  });
};
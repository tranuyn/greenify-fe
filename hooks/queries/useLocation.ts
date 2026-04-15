import { useQuery } from '@tanstack/react-query';
import { locationService } from 'services/location.service';
import { QUERY_KEYS } from 'constants/queryKeys';

// Data địa lý gần như không đổi → stale 30 phút
const LOCATION_STALE_TIME = 30 * 60 * 1000;

export const useProvinces = () => {
  return useQuery({
    queryKey: QUERY_KEYS.location.provinces(),
    queryFn: () => locationService.getProvinces().then((r) => r.data),
    staleTime: LOCATION_STALE_TIME,
  });
};

export const useWards = (provinceCode: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.location.wards(provinceCode),
    queryFn: () => locationService.getWards(provinceCode).then((r) => r.data),
    enabled: !!provinceCode,
    staleTime: LOCATION_STALE_TIME,
  });
};

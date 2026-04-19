import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { trashService } from 'services/community.service';
import {
  CreateTrashSpotReportRequest,
  CreateTrashSpotVerificationRequest,
} from 'types/community.types';

export const useCreateTrashSpotReport = () => {
  return useMutation({
    mutationFn: (payload: CreateTrashSpotReportRequest) =>
      trashService.createTrashSpotReport(payload),
    onSuccess: () => {
      // Tối ưu: Chỉ gọi lại danh sách để tiết kiệm Data, không gọi lại toàn bộ
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trashSpots.list() });
    },
  });
};

export const useVerifyTrashSpot = (trashSpotId: string) => {
  return useMutation({
    mutationFn: (payload: CreateTrashSpotVerificationRequest) =>
      trashService.verifyTrashSpot(trashSpotId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trashSpots.detail(trashSpotId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trashSpots.list() });
    },
  });
};

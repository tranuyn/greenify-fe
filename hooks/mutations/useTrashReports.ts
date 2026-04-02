import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { trashService } from 'services/community.service';
import { CreateTrashReportRequest } from 'types/community.types';

export const useCreateTrashReport = () => {
  return useMutation({
    mutationFn: (payload: CreateTrashReportRequest) => trashService.createReport(payload),
    onSuccess: () => {
      // Tối ưu: Chỉ gọi lại danh sách để tiết kiệm Data, không gọi lại toàn bộ
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trashReports.list() });
    },
  });
};
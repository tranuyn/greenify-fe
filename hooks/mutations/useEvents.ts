import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { eventService } from 'services/community.service';

export const useRegisterEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => eventService.registerEvent(eventId),
    onSuccess: (_, eventId) => {
      // Số người đăng ký thay đổi → invalidate detail của event đó
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.detail(eventId) });
      // Cập nhật danh sách event của mình
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.myRegistrations() });
    },
  });
};
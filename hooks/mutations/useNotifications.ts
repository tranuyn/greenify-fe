import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';
import { notificationService } from '@/services/notification.service';

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markNotificationAsRead(id),
    onSuccess: () => {
      // Gọi invalidate trực tiếp
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount() });
    },
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onSuccess: () => {
      // Gọi invalidate trực tiếp
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount() });
    },
  });
};

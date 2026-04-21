import { useMutation } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';
import { notificationService } from '@/services/notification.service';

const invalidateNotificationQueries = () => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount() });
};

export const useReadNotification = () => {
  return useMutation({
    mutationFn: (id: string) => notificationService.markNotificationAsRead(id),
    onSuccess: () => {
      invalidateNotificationQueries();
    },
  });
};

export const useReadAllNotifications = () => {
  return useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onSuccess: () => {
      invalidateNotificationQueries();
    },
  });
};

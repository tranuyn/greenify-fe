import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { notificationService } from '@/services/notification.service';
import type { MyNotificationsQueryParams } from '@/types/notification.types';

export const useMyNotifications = (params?: MyNotificationsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.me(params),
    queryFn: () => notificationService.getMyNotifications(params),
    enabled,
  });
};

export const useUnreadNotificationCount = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.unreadCount(),
    queryFn: () => notificationService.getUnreadNotificationCount(),
    enabled,
  });
};

import { apiClient } from '@/lib/apiClient';
import type {
  MyNotificationsQueryParams,
  MyNotificationsResponse,
} from '@/types/notification.types';

export const notificationService = {
  async getMyNotifications(params?: MyNotificationsQueryParams): Promise<MyNotificationsResponse> {
    const apiParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 100,
    };

    const { data } = await apiClient.get<MyNotificationsResponse>('/notifications/me', {
      params: apiParams,
    });

    return data;
  },

  async markNotificationAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await apiClient.patch('/notifications/me/read-all');
  },

  async getUnreadNotificationCount(): Promise<number> {
    const { data } = await apiClient.get<number>('/notifications/me/unread-count');
    return data;
  },
};

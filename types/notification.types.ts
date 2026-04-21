import type { PageResponse, PaginationParams } from './common.types';

export type NotificationType = string;

export interface UserNotification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  targetId: string;
  createdAt: string;
  read: boolean;
}

export type MyNotificationsQueryParams = PaginationParams;

export type MyNotificationsResponse = PageResponse<UserNotification>;

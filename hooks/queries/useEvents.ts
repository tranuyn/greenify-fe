import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { eventService } from 'services/community.service';
import { PaginationParams } from 'types/common.types';

export const usePublishedEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params),
    queryFn: () => eventService.getPublishedEvents(params).then((r) => r.data),
  });
};

export const useEventDetail = (eventId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId),
    queryFn: () => eventService.getEventById(eventId).then((r) => r.data),
    enabled: !!eventId,
  });
};

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.events.myRegistrations(),
    queryFn: () => eventService.getMyRegistrations().then((r) => r.data),
  });
};

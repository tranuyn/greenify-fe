import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { eventService } from 'services/community.service';
import { PaginationParams } from 'types/common.types';
import { EventQueryParams } from 'types/community.types';

export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params),
    queryFn: () => eventService.getEvents(params).then((r) => r.data),
  });
};

export const usePublishedEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list({ ...params, status: 'PUBLISHED' }),
    queryFn: () =>
      eventService
        .getEvents({ ...params, status: 'PUBLISHED' })
        .then((r) => r.data),
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

export const useNgoEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.ngoList(params),
    queryFn: () => eventService.getNgoEvents(params).then((r) => r.data),
  });
};
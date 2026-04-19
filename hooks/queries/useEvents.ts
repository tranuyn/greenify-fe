import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { eventService } from 'services/community.service';
import { PaginationParams } from 'types/common.types';
import { EventQueryParams } from 'types/community.types';

export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params),
    queryFn: () => eventService.getEvents(params),
  });
};

export const usePublishedEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list({ ...params, status: 'PUBLISHED' }),
    queryFn: () => eventService.getEvents({ ...params, status: 'PUBLISHED' }),
  });
};

export const useEventDetail = (eventId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId),
    queryFn: () => eventService.getEventById(eventId),
    enabled: !!eventId,
  });
};

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.events.myRegistrations(),
    queryFn: () => eventService.getMyRegistrations(),
  });
};

export const useNgoEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.ngoList(params),
    queryFn: () => eventService.getNgoEvents(params),
  });
};

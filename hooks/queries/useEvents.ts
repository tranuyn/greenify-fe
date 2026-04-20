import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { eventService } from 'services/community.service';
import { PaginationParams } from 'types/common.types';
import {
  EventQueryParams,
  PublicEventQueryParams,
  ParticipatedEventQueryParams,
  MyNgoEventQueryParams,
} from 'types/community.types';

export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params),
    queryFn: () => eventService.getEvents(params),
  });
};

export const usePublishedEvents = (params?: PublicEventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.publicList(params),
    queryFn: () => eventService.getPublicEvents(params),
  });
};

export const useEventDetail = (eventId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId),
    queryFn: () => eventService.getEventById(eventId),
    enabled: !!eventId,
  });
};

export const useMyRegistrations = (
  userId: string,
  params?: ParticipatedEventQueryParams
) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.myRegistrations(userId, params),
    queryFn: () => eventService.getMyRegistrations(userId, params),
    enabled: !!userId,
  });
};

export const useNgoEvents = (ngoId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.ngoList(ngoId, params),
    queryFn: () => eventService.getNgoEvents(ngoId, params),
    enabled: !!ngoId,
  });
};

export const useMyNgoEvents = (params?: MyNgoEventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.myNgoList(params),
    queryFn: () => eventService.getMyNgoEvents(params),
  });
};

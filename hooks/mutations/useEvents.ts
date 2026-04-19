import {
  CreateEventRequest,
  RegisterEventPayload,
  UpdateEventRequest,
} from '@/types/community.types';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { eventService } from 'services/community.service';

export const useRegisterEvent = () => {
  return useMutation({
    mutationFn: (payload: RegisterEventPayload) => eventService.registerEvent(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(payload.eventId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useRegisterWaitlistEvent = () => {
  return useMutation({
    mutationFn: (payload: RegisterEventPayload) => eventService.registerWaitlistEvent(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(payload.eventId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: (payload: CreateEventRequest) =>
      eventService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useUpdateEvent = (eventId: string) => {
  return useMutation({
    mutationFn: (payload: UpdateEventRequest) =>
      eventService.updateEvent(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useCheckInAttendee = (eventId: string) => {
  return useMutation({
    mutationFn: (code: string) => eventService.checkInAttendee(code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
    },
  });
};

export const useCheckOutAttendee = (eventId: string) => {
  return useMutation({
    mutationFn: (code: string) => eventService.checkOutAttendee(code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
    },
  });
};

export const useCancelRegistration = (eventId: string) => {
  return useMutation({
    mutationFn: (registrationId: string) => eventService.cancelRegistration(registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};
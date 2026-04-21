import {
  CreateEventRequest,
  PredictEventRequest,
  RegisterEventPayload,
  UpdateEventRequest,
} from '@/types/community.types';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { eventService } from 'services/community.service';
import { Alert } from 'react-native';

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
    mutationFn: (payload: CreateEventRequest) => eventService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const usePredictEvent = () => {
  return useMutation({
    mutationFn: (payload: PredictEventRequest) => eventService.predictEvent(payload),
  });
};

export const useUpdateEvent = (eventId: string) => {
  return useMutation({
    mutationFn: (payload: UpdateEventRequest) => eventService.updateEvent(eventId, payload),
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      Alert.alert(
        'Check-in thành công',
        data?.username ? `Chào mừng ${data.username}!` : 'Check-in thành công.'
      );
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Check-in thất bại.';
      Alert.alert('Check-in thất bại', msg);
    },
  });
};

export const useCheckOutAttendee = (eventId: string) => {
  return useMutation({
    mutationFn: (code: string) => eventService.checkOutAttendee(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      Alert.alert(
        'Check-out thành công',
        data?.username ? `Tạm biệt ${data.username}!` : 'Check-out thành công.'
      );
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Check-out thất bại.';
      Alert.alert('Check-out thất bại', msg);
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

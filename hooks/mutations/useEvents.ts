import {
  CreateEventRequest,
  RejectEventRequest,
  UpdateEventRequest,
} from '@/types/community.types';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { eventService } from 'services/community.service';

export const useRegisterEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => eventService.registerEvent(eventId),
    onSuccess: (_, eventId) => {
      // Số người đăng ký thay đổi → invalidate detail của event đó
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      // Cập nhật danh sách event của mình
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.myRegistrations(),
      });
      // Cập nhật danh sách chung (số người tham gia có thể được hiển thị)
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.ngoList() });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.ngoList() });
    },
  });
};

export const useApproveEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => eventService.approveEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.all });
    },
  });
};

export const useRejectEvent = () => {
  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string;
      payload: RejectEventRequest;
    }) => eventService.rejectEvent(eventId, payload),
    onSuccess: (_, { eventId }) => {
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events.ngoList() });
    },
  });
};

export const useCheckInAttendee = (eventId: string) => {
  return useMutation({
    mutationFn: (qrToken: string) =>
      eventService.checkInAttendee(eventId, qrToken),
    onSuccess: () => {
      // Check-in thành công có thể thay đổi trạng thái đăng ký của attendee đó
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.events.detail(eventId),
      });
    },
  });
};
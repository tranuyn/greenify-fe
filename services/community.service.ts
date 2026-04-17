import { apiClient } from 'lib/apiClient';
import type {
  Event,
  EventRegistration,
  RecyclingStation,
  TrashSpotReport,
  CreateTrashReportRequest,
  CreateEventRequest,
} from 'types/community.types';
import { ApiResponse, PageResponse, PaginationParams } from '@/types/common.types';

import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_EVENTS,
  MOCK_MY_REGISTRATIONS,
  MOCK_STATIONS,
  MOCK_TRASH_REPORTS,
} from './mock/community.mock';

// ============================================================
// EVENT SERVICE
// ============================================================
export const eventService = {
  async getPublishedEvents(params?: PaginationParams): Promise<ApiResponse<PageResponse<Event>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      const published = MOCK_EVENTS.filter((e) => e.status === 'PUBLISHED');
      return mockSuccess({
        content: published,
        totalElements: published.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        totalPages: Math.ceil(published.length / (params?.size ?? 10)),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<Event>>>('/events', {
      params,
    });
    return data;
  },

  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const event = MOCK_EVENTS.find((e) => e.id === eventId);
      if (!event) throw new Error('Event not found');
      return mockSuccess(event);
    }
    const { data } = await apiClient.get<ApiResponse<Event>>(`/events/${eventId}`);
    return data;
  },

  async registerEvent(eventId: string): Promise<ApiResponse<EventRegistration>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const event = MOCK_EVENTS.find((e) => e.id === eventId);
      const reg: EventRegistration = {
        id: `reg-${Date.now()}`,
        event_id: eventId,
        user_id: 'usr-001',
        qr_token: `QR_${eventId}_USR001_${Date.now()}`,
        status: 'REGISTERED',
        checked_in_at: null,
        checked_out_at: null,
        attended_valid: false,
        reward_status: 'PENDING_REWARD',
        created_at: new Date().toISOString(),
        event,
      };
      return mockSuccess(reg);
    }
    const { data } = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/register`
    );
    return data;
  },

  async getMyRegistrations(): Promise<ApiResponse<EventRegistration[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_MY_REGISTRATIONS);
    }
    const { data } = await apiClient.get<ApiResponse<EventRegistration[]>>(
      '/events/registrations/me'
    );
    return data;
  },

  async getNgoEvents(params?: PaginationParams): Promise<ApiResponse<PageResponse<Event>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      return mockSuccess({
        content: MOCK_EVENTS,
        totalElements: MOCK_EVENTS.length,
        page: params?.page ?? 1,
        size: params?.size ?? 20,
        totalPages: Math.ceil(MOCK_EVENTS.length / (params?.size ?? 20)),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<Event>>>('/ngo/events', {
      params,
    });
    return data;
  },

  async createEvent(payload: CreateEventRequest): Promise<ApiResponse<Event>> {
    if (IS_MOCK_MODE) {
      await mockDelay(900);
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        ngo_id: 'usr-003',
        status: 'PENDING_APPROVAL',
        admin_note: null,
        created_at: new Date().toISOString(),
        ngo_name: 'Green Future Vietnam',
        registered_count: 0,
        ...payload,
      };
      return mockSuccess(newEvent);
    }
    const { data } = await apiClient.post<ApiResponse<Event>>('/ngo/events', payload);
    return data;
  },

  async checkInAttendee(
    eventId: string,
    qrToken: string
  ): Promise<ApiResponse<{ registration_id: string; user_name: string; status: string }>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        registration_id: 'reg-001',
        user_name: 'Nhã Uyên',
        status: 'CHECKED_IN',
      });
    }
    const { data } = await apiClient.post(`/ngo/events/${eventId}/check-in`, { qr_token: qrToken });
    return data;
  },
};

// ============================================================
// MAP SERVICE
// ============================================================
export const mapService = {
  async getStations(): Promise<ApiResponse<RecyclingStation[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_STATIONS.filter((s) => s.status === 'ACTIVE'));
    }
    const { data } = await apiClient.get<ApiResponse<RecyclingStation[]>>('/stations');
    return data;
  },
};

// ============================================================
// COMMUNITY / TRASH REPORT SERVICE
// ============================================================
export const trashService = {
  async getReports(params?: PaginationParams): Promise<ApiResponse<PageResponse<TrashSpotReport>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        content: MOCK_TRASH_REPORTS,
        totalElements: MOCK_TRASH_REPORTS.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        totalPages: Math.ceil(MOCK_TRASH_REPORTS.length / (params?.size ?? 10)),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<TrashSpotReport>>>(
      '/trash-reports',
      { params }
    );
    return data;
  },

  async createReport(payload: CreateTrashReportRequest): Promise<ApiResponse<TrashSpotReport>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const report: TrashSpotReport = {
        id: `trash-${Date.now()}`,
        reporter_id: 'usr-001',
        after_media_urls: null,
        verify_count: 0,
        hot_score: 0,
        assigned_ngo_id: null,
        status: 'SUBMITTED',
        resolve_note: null,
        resolve_completed_at: null,
        admin_resolve_note: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      };
      return mockSuccess(report);
    }
    const { data } = await apiClient.post<ApiResponse<TrashSpotReport>>('/trash-reports', payload);
    return data;
  },
};

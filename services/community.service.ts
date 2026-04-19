import { apiClient } from '@/lib/apiClient';
import type {
  Event,
  EventRegistration,
  OpeningHours,
  RecyclingStation,
  RecyclingStationApiModel,
  TrashSpotListItem,
  TrashSpotQueryParams,
  TrashSpotReport,
  TrashSpotVerification,
  CreateTrashSpotReportRequest,
  CreateTrashSpotVerificationRequest,
  CreateEventRequest,
  EventQueryParams,
  UpdateEventRequest,
  WasteType,
  ParticipatedEventQueryParams,
  MyNgoEventQueryParams,
  RegisterEventPayload,
  PublicEventQueryParams,
} from '@/types/community.types';
import { ApiResponse, PageResponse, PaginationParams } from '@/types/common.types';
import { mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_EVENTS,
  MOCK_MY_REGISTRATIONS,
  MOCK_STATIONS,
  MOCK_TRASH_SPOT_DETAILS,
  MOCK_TRASH_SPOTS,
} from './mock/community.mock';
import { SortOption } from '@/constants/enums/sortOptions.enum';

const DAY_OF_WEEK_MAP: Record<string, string> = {
  MONDAY: 'MON',
  TUESDAY: 'TUE',
  WEDNESDAY: 'WED',
  THURSDAY: 'THU',
  FRIDAY: 'FRI',
  SATURDAY: 'SAT',
  SUNDAY: 'SUN',
};

const formatTime = (time?: string) => (time ? time.slice(0, 5) : '');

const mapOpenTimesToOpeningHours = (
  openTimes: RecyclingStationApiModel['openTimes']
): OpeningHours => {
  const openingHours: OpeningHours = {};

  openTimes.forEach((item) => {
    const day = DAY_OF_WEEK_MAP[item.dayOfWeek];
    if (!day) return;

    openingHours[day] = {
      open: formatTime(item.startTime),
      close: formatTime(item.endTime),
    };
  });

  return openingHours;
};

const mapStationFromApi = (station: RecyclingStationApiModel): RecyclingStation => ({
  id: station.id,
  name: station.name,
  address: [
    station.address?.addressDetail,
    station.address?.ward,
    station.address?.district,
    station.address?.province,
  ]
    .filter(Boolean)
    .join(', '),
  latitude: station.address?.latitude ?? 0,
  longitude: station.address?.longitude ?? 0,
  waste_types: station.wasteTypes?.map((w) => w.name) ?? [],
  opening_hours: mapOpenTimesToOpeningHours(station.openTimes ?? []),
  contact_phone: station.phoneNumber,
  notes: station.description || null,
  status: station.status,
});

// ============================================================
// EVENT SERVICE
// ============================================================
export const eventService = {
  async getEvents(params?: EventQueryParams): Promise<PageResponse<Event>> {
    const apiParams = {
      ...params,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>('/events', {
      params: apiParams,
    });

    return data;
  },

  async getPublicEvents(params?: PublicEventQueryParams): Promise<PageResponse<Event>> {
    const apiParams = {
      title: params?.title,
      eventType: params?.eventType === 'all' ? undefined : params?.eventType,
      from: params?.from,
      to: params?.to,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    // 2. GỌI API THẬT
    const { data } = await apiClient.get<PageResponse<Event>>('/events/public', {
      params: apiParams,
    });

    return data;
  },

  async getEventById(eventId: string): Promise<Event> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const event = MOCK_EVENTS.find((e) => e.id === eventId);
    //   if (!event) throw new Error('Event not found');
    //   return mockSuccess(event);
    // }
    const { data } = await apiClient.get<Event>(`/events/${eventId}`);
    return data;
  },

  async getMyRegistrations(
    userId: string,
    params?: ParticipatedEventQueryParams
  ): Promise<PageResponse<Event>> {
    const apiParams = {
      title: params?.title,
      address: params?.address,
      status: params?.status === 'all' ? undefined : params?.status,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>(`/events/participated/${userId}`, {
      params: apiParams,
    });
    return data;
  },

  async getNgoEvents(ngoId: string, params?: PaginationParams): Promise<PageResponse<Event>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);
    //   return mockSuccess({
    //     content: MOCK_EVENTS,
    //     totalElements: MOCK_EVENTS.length,
    //     page: params?.page ?? 1,
    //     size: params?.size ?? 20,
    //     totalPages: Math.ceil(MOCK_EVENTS.length / (params?.size ?? 20)),
    //   });
    // }
    const apiParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>(`/events/ngo/${ngoId}`, {
      params: apiParams,
    });
    return data;
  },

  async getMyNgoEvents(params?: MyNgoEventQueryParams): Promise<PageResponse<Event>> {
    const apiParams = {
      title: params?.title,
      eventType: params?.eventType === 'all' ? undefined : params?.eventType,
      status: params?.status === 'all' ? undefined : params?.status,
      from: params?.from,
      to: params?.to,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>('/events/ngo/my-events', {
      params: apiParams,
    });

    return data;
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const { data } = await apiClient.get<EventRegistration[]>(`/events/${eventId}/registrations`);
    return data;
  },

  async createEvent(payload: CreateEventRequest): Promise<Event> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(900);

    //   const newEvent: Event = {
    //     id: `evt-${Date.now()}`,
    //     ...payload,
    //     status: payload.status === 'DRAFT' ? 'DRAFT' : 'PENDING_APPROVAL',
    //     rejectReason: null,
    //     rejectedCount: 0,
    //     address: {
    //       id: `addr-${Date.now()}`,
    //       ...payload.address,
    //     },
    //     // Thêm ID giả cho ảnh để React render key cho mượt
    //     thumbnail: {
    //       id: `img-${Date.now()}-thumb`,
    //       ...payload.thumbnail,
    //     },
    //     images: payload.images.map((img, idx) => ({
    //       id: `img-${Date.now()}-gal-${idx}`,
    //       ...img,
    //     })),
    //     createdAt: new Date().toISOString(),
    //     lastModifiedAt: new Date().toISOString(),
    //   };

    //   MOCK_EVENTS.unshift(newEvent);

    //   return mockSuccess(newEvent);
    // }

    const { data } = await apiClient.post<Event>('/events', payload);
    return data;
  },

  async updateEvent(eventId: string, payload: UpdateEventRequest): Promise<Event> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(700);

    //   // Tìm vị trí của sự kiện trong mảng giả lập
    //   const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    //   if (eventIndex === -1) throw new Error('Event not found');

    //   // Cập nhật dữ liệu mới đè lên dữ liệu cũ
    //   const updatedEvent: Event = {
    //     ...MOCK_EVENTS[eventIndex],
    //     ...payload,
    //     // Cập nhật các object lồng nhau (tránh bị mất ID cũ)
    //     address: {
    //       ...MOCK_EVENTS[eventIndex].address,
    //       ...payload.address,
    //     },
    //     thumbnail: {
    //       ...MOCK_EVENTS[eventIndex].thumbnail,
    //       ...payload.thumbnail,
    //     },
    //     images: payload.images.map((img, idx) => ({
    //       id: `img-${Date.now()}-gal-${idx}`,
    //       ...img,
    //     })),
    //     lastModifiedAt: new Date().toISOString(),
    //   };

    //   // Lưu lại vào mảng Mock
    //   MOCK_EVENTS[eventIndex] = updatedEvent;

    //   return mockSuccess(updatedEvent);
    // }

    const { data } = await apiClient.put<Event>(`/events/${eventId}`, payload);
    return data;
  },

  async registerEvent(payload: RegisterEventPayload): Promise<EventRegistration> {
    // 1. MOCK DATA
    // if (IS_MOCK_MODE) {
    //   await mockDelay(700);
    //   // ... logic mock nếu cần
    // }

    // 2. GỌI API THẬT
    // Đã chuyển sang endpoint mới và truyền data qua Body
    const { data } = await apiClient.post<EventRegistration>('/event-registrations', payload);
    return data;
  },

  async registerWaitlistEvent(payload: RegisterEventPayload): Promise<EventRegistration> {
    const { data } = await apiClient.post<EventRegistration>(
      '/event-registrations/waitlist',
      payload
    );
    return data;
  },

  async deleteEvent(eventId: string): Promise<null> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);

    //   const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    //   if (eventIndex === -1) throw new Error('Event not found');

    //   MOCK_EVENTS.splice(eventIndex, 1);

    //   return mockSuccess(null);
    // }

    const { data } = await apiClient.delete<null>(`/events/${eventId}`);
    return data;
  },

  async checkInAttendee(code: string): Promise<EventRegistration> {
    const { data } = await apiClient.post<EventRegistration>(
      '/event-registrations/check-in',
      null,
      { params: { code } }
    );
    return data;
  },

  async checkOutAttendee(code: string): Promise<EventRegistration> {
    const { data } = await apiClient.post<EventRegistration>(
      '/event-registrations/check-out',
      null,
      { params: { code } }
    );
    return data;
  },

  async getRegistrationCode(eventId: string, userId: string): Promise<string> {
    const { data } = await apiClient.get<string>('/event-registrations/code', {
      params: { eventId, userId },
    });
    return data;
  },

  async cancelRegistration(registrationId: string): Promise<null> {
    const { data } = await apiClient.delete<null>(`/event-registrations/${registrationId}`);
    return data;
  },
};

// ============================================================
// MAP SERVICE
// ============================================================
export const mapService = {
  async getStations(wasteTypeID?: string): Promise<RecyclingStation[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return MOCK_STATIONS.filter((s) => s.status === 'ACTIVE');
    // }
    const { data } = await apiClient.get<RecyclingStationApiModel[]>('/recycling-stations', {
      params: wasteTypeID ? { wasteTypeID } : undefined,
    });
    return data.map(mapStationFromApi);
  },

  async getAllWasteType(): Promise<WasteType[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(300);
    //   const uniqueNames = new Set<string>();
    //   MOCK_STATIONS.forEach((station) => {
    //     station.waste_types.forEach((name) => uniqueNames.add(name));
    //   });

    //   return Array.from(uniqueNames).map((name) => ({
    //     id: name.toLowerCase().replace(/\s+/g, '-'),
    //     name,
    //     description: '',
    //   }));
    // }

    const { data } = await apiClient.get<WasteType[]>('/waste-types');
    return data;
  },
};

// ============================================================
// COMMUNITY / TRASH REPORT SERVICE
// ============================================================
export const trashService = {
  async getTrashSpots(params?: TrashSpotQueryParams): Promise<TrashSpotListItem[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return MOCK_TRASH_SPOTS;
    // }
    const { data } = await apiClient.get<TrashSpotListItem[]>('/trash-spots', {
      params: {
        province: params?.province,
        status: params?.status,
        severityTier: params?.severityTier,
      },
    });
    return data;
  },

  async createTrashSpotReport(payload: CreateTrashSpotReportRequest): Promise<TrashSpotReport> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(800);
    //   return MOCK_TRASH_SPOT_DETAILS;
    // }
    const { data } = await apiClient.post<TrashSpotReport>('/trash-spots', payload);
    return data;
  },

  async getTrashSpotById(id: string): Promise<TrashSpotReport> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   return MOCK_TRASH_SPOT_DETAILS;
    // }
    const { data } = await apiClient.get<TrashSpotReport>(`/trash-spots/${id}`);
    return data;
  },

  async verifyTrashSpot(
    id: string,
    payload: CreateTrashSpotVerificationRequest
  ): Promise<TrashSpotVerification> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const verification = {
    //     id: `verify-${Date.now()}`,
    //     verifierId: 'usr-001',
    //     verifierDisplayName: 'Mock Verifier',
    //     note: payload.note,
    //     createdAt: new Date().toISOString(),
    //   } satisfies TrashSpotVerification;

    //   return verification;
    // }

    const { data } = await apiClient.post<TrashSpotVerification>(
      `/trash-spots/${id}/verifications`,
      {
        note: payload.note,
      }
    );
    return data;
  },
};

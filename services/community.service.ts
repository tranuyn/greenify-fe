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
  EventApiRequestParams,
  EventQueryParams,
  UpdateEventRequest,
  RejectEventRequest,
  WasteType,
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
    // 1. ADAPTER: CHUYỂN ĐỔI PARAMS TỪ UI -> BE
    // Truyền thẳng fromDate và toDate vào đây luôn cho gọn
    const apiParams: EventApiRequestParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
      fromDate: params?.fromDate,
      toDate: params?.toDate,
    };

    if (params?.title) apiParams.title = params.title;

    if (params?.eventType && params.eventType !== 'all') {
      apiParams.eventType = params.eventType;
    }

    if (params?.status && params.status !== 'all') {
      apiParams.status = params.status;
    }

    if (params?.sort === SortOption.POPULAR) {
      // Ví dụ: sort theo số người tham gia (nếu API có hỗ trợ)
      apiParams.sort = ['maxParticipants,desc'];
    } else if (params?.sort === SortOption.NEWEST) {
      apiParams.sort = ['startTime,desc'];
    }

    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);
    //   let filteredEvents = [...MOCK_EVENTS];

    //   if (params?.title) {
    //     const lowerSearch = params.title.toLowerCase();
    //     filteredEvents = filteredEvents.filter((e) => e.title.toLowerCase().includes(lowerSearch));
    //   }
    //   if (params?.eventType && params.eventType !== 'all') {
    //     filteredEvents = filteredEvents.filter((e) => e.eventType === params.eventType);
    //   }
    //   if (params?.status && params.status !== 'all') {
    //     filteredEvents = filteredEvents.filter((e) => e.status === params.status);
    //   }
    //   if (params?.fromDate) {
    //     const fromTime = new Date(params.fromDate).getTime();
    //     filteredEvents = filteredEvents.filter((e) => new Date(e.startTime).getTime() >= fromTime);
    //   }
    //   if (params?.toDate) {
    //     const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
    //     filteredEvents = filteredEvents.filter((e) => new Date(e.startTime).getTime() <= toTime);
    //   }

    //   const pageIndex = params?.page ?? 1;
    //   const pageSize = params?.size ?? 10;
    //   const start = (pageIndex - 1) * pageSize;
    //   const paginatedEvents = filteredEvents.slice(start, start + pageSize);

    //   return mockSuccess({
    //     content: paginatedEvents,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalElements: filteredEvents.length,
    //     totalPages: Math.ceil(filteredEvents.length / pageSize),
    //   });
    // }

    const { data } = await apiClient.get<PageResponse<Event>>('/events', {
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

  async registerEvent(eventId: string): Promise<EventRegistration> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(700);
    //   const event = MOCK_EVENTS.find((e) => e.id === eventId);
    //   const reg: EventRegistration = {
    //     id: `reg-${Date.now()}`,
    //     event_id: eventId,
    //     user_id: 'usr-001',
    //     qr_token: `QR_${eventId}_USR001_${Date.now()}`,
    //     status: 'REGISTERED',
    //     checked_in_at: null,
    //     checked_out_at: null,
    //     attended_valid: false,
    //     reward_status: 'PENDING_REWARD',
    //     created_at: new Date().toISOString(),
    //     event,
    //   };
    //   return mockSuccess(reg);
    // }
    const { data } = await apiClient.post<EventRegistration>(`/events/${eventId}/register`);
    return data;
  },

  async getMyRegistrations(): Promise<EventRegistration[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return mockSuccess(MOCK_MY_REGISTRATIONS);
    // }
    const { data } = await apiClient.get<EventRegistration[]>('/events/registrations/me');
    return data;
  },

  async getNgoEvents(params?: PaginationParams): Promise<PageResponse<Event>> {
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
    const { data } = await apiClient.get<PageResponse<Event>>('/ngo/events', {
      params: {
        page: params?.page,
        size: params?.size,
      },
    });
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

  async approveEvent(eventId: string): Promise<null> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);

    //   const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    //   if (eventIndex === -1) throw new Error('Event not found');

    //   const updatedEvent: Event = {
    //     ...MOCK_EVENTS[eventIndex],
    //     status: 'PUBLISHED',
    //     rejectReason: null,
    //     lastModifiedAt: new Date().toISOString(),
    //   };

    //   MOCK_EVENTS[eventIndex] = updatedEvent;
    //   return mockSuccess(null);
    // }

    const { data } = await apiClient.post<null>(`/events/${eventId}/approve`);
    return data;
  },

  // TỪ CHỐI SỰ KIỆN (Dành cho Admin/Mod)
  async rejectEvent(eventId: string, payload: RejectEventRequest): Promise<null> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);

    //   const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    //   if (eventIndex === -1) throw new Error('Event not found');

    //   const updatedEvent: Event = {
    //     ...MOCK_EVENTS[eventIndex],
    //     status: 'REJECTED',
    //     rejectReason: payload.reason,
    //     rejectedCount: (MOCK_EVENTS[eventIndex].rejectedCount || 0) + 1,
    //     lastModifiedAt: new Date().toISOString(),
    //   };

    //   MOCK_EVENTS[eventIndex] = updatedEvent;
    //   return mockSuccess(null);
    // }

    const { data } = await apiClient.post<null>(`/events/${eventId}/reject`, payload);
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

  async checkInAttendee(
    eventId: string,
    qrToken: string
  ): Promise<{ registration_id: string; user_name: string; status: string }> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return mockSuccess({
    //     registration_id: 'reg-001',
    //     user_name: 'Nhã Uyên',
    //     status: 'CHECKED_IN',
    //   });
    // }
    const { data } = await apiClient.post(`/ngo/events/${eventId}/check-in`, {
      qr_token: qrToken,
    });
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
    const requestParams = {
      province: params?.province,
      status: params?.status,
      wasteTypeId: params?.wasteTypeId,
      severityTier: params?.severityTier,
    };
    const { data } = await apiClient.get<TrashSpotListItem[]>('/trash-spots', {
      params: requestParams,
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

  async reportTrashSpot(
    id: string,
    payload: CreateTrashSpotVerificationRequest
  ): Promise<TrashSpotReport> {
    const { data } = await apiClient.post<TrashSpotReport>(`/trash-spots/${id}/reports`, {
      note: payload.note,
    });
    return data;
  },
};

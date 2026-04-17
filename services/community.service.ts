import { apiClient } from "@/lib/apiClient";
import type {
  Event,
  EventRegistration,
  RecyclingStation,
  TrashSpotReport,
  CreateTrashReportRequest,
  CreateEventRequest,
  EventApiRequestParams,
  EventQueryParams,
  UpdateEventRequest,
  RejectEventRequest,
} from "@/types/community.types";
import {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/common.types";
import { IS_MOCK_MODE, mockDelay, mockSuccess } from "./mock/config";
import {
  MOCK_EVENTS,
  MOCK_MY_REGISTRATIONS,
  MOCK_STATIONS,
  MOCK_TRASH_REPORTS,
} from "./mock/community.mock";
import { SortOption } from "@/constants/enums/sortOptions.enum";

// ============================================================
// EVENT SERVICE
// ============================================================
export const eventService = {
  async getEvents(
    params?: EventQueryParams,
  ): Promise<ApiResponse<PageResponse<Event>>> {
    // 1. ADAPTER: CHUYỂN ĐỔI PARAMS TỪ UI -> BE
    // Truyền thẳng fromDate và toDate vào đây luôn cho gọn
    const apiParams: EventApiRequestParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
      fromDate: params?.fromDate,
      toDate: params?.toDate,
    };

    if (params?.title) apiParams.title = params.title;

    if (params?.eventType && params.eventType !== "all") {
      apiParams.eventType = params.eventType;
    }

    if (params?.status && params.status !== "all") {
      apiParams.status = params.status;
    }

    if (params?.sort === SortOption.POPULAR) {
      // Ví dụ: sort theo số người tham gia (nếu API có hỗ trợ)
      apiParams.sort = ["maxParticipants,desc"];
    } else if (params?.sort === SortOption.NEWEST) {
      apiParams.sort = ["startTime,desc"];
    }

    if (IS_MOCK_MODE) {
      await mockDelay(600);
      let filteredEvents = [...MOCK_EVENTS];

      if (params?.title) {
        const lowerSearch = params.title.toLowerCase();
        filteredEvents = filteredEvents.filter((e) =>
          e.title.toLowerCase().includes(lowerSearch),
        );
      }
      if (params?.eventType && params.eventType !== "all") {
        filteredEvents = filteredEvents.filter(
          (e) => e.eventType === params.eventType,
        );
      }
      if (params?.status && params.status !== "all") {
        filteredEvents = filteredEvents.filter(
          (e) => e.status === params.status,
        );
      }
      if (params?.fromDate) {
        const fromTime = new Date(params.fromDate).getTime();
        filteredEvents = filteredEvents.filter(
          (e) => new Date(e.startTime).getTime() >= fromTime,
        );
      }
      if (params?.toDate) {
        const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
        filteredEvents = filteredEvents.filter(
          (e) => new Date(e.startTime).getTime() <= toTime,
        );
      }

      const pageIndex = params?.page ?? 1;
      const pageSize = params?.size ?? 10;
      const start = (pageIndex - 1) * pageSize;
      const paginatedEvents = filteredEvents.slice(start, start + pageSize);

      return mockSuccess({
        content: paginatedEvents,
        page: pageIndex,
        size: pageSize,
        totalElements: filteredEvents.length,
        totalPages: Math.ceil(filteredEvents.length / pageSize),
      });
    }

    const { data } = await apiClient.get<ApiResponse<PageResponse<Event>>>(
      "/events",
      {
        params: apiParams,
      },
    );
    return data;
  },

  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const event = MOCK_EVENTS.find((e) => e.id === eventId);
      if (!event) throw new Error("Event not found");
      return mockSuccess(event);
    }
    const { data } = await apiClient.get<ApiResponse<Event>>(
      `/events/${eventId}`,
    );
    return data;
  },

  async registerEvent(
    eventId: string,
  ): Promise<ApiResponse<EventRegistration>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const event = MOCK_EVENTS.find((e) => e.id === eventId);
      const reg: EventRegistration = {
        id: `reg-${Date.now()}`,
        event_id: eventId,
        user_id: "usr-001",
        qr_token: `QR_${eventId}_USR001_${Date.now()}`,
        status: "REGISTERED",
        checked_in_at: null,
        checked_out_at: null,
        attended_valid: false,
        reward_status: "PENDING_REWARD",
        created_at: new Date().toISOString(),
        event,
      };
      return mockSuccess(reg);
    }
    const { data } = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/register`,
    );
    return data;
  },

  async getMyRegistrations(): Promise<ApiResponse<EventRegistration[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_MY_REGISTRATIONS);
    }
    const { data } = await apiClient.get<ApiResponse<EventRegistration[]>>(
      "/events/registrations/me",
    );
    return data;
  },

  async getNgoEvents(
    params?: PaginationParams,
  ): Promise<ApiResponse<PageResponse<Event>>> {
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
    const { data } = await apiClient.get<ApiResponse<PageResponse<Event>>>(
      "/ngo/events",
      {
        params: {
          page: params?.page,
          size: params?.size,
        },
      },
    );
    return data;
  },

  async createEvent(payload: CreateEventRequest): Promise<ApiResponse<Event>> {
    if (IS_MOCK_MODE) {
      await mockDelay(900);

      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        ...payload,
        status: payload.status === "DRAFT" ? "DRAFT" : "PENDING_APPROVAL",
        rejectReason: null,
        rejectedCount: 0,
        address: {
          id: `addr-${Date.now()}`,
          ...payload.address,
        },
        // Thêm ID giả cho ảnh để React render key cho mượt
        thumbnail: {
          id: `img-${Date.now()}-thumb`,
          ...payload.thumbnail,
        },
        images: payload.images.map((img, idx) => ({
          id: `img-${Date.now()}-gal-${idx}`,
          ...img,
        })),
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
      };

      MOCK_EVENTS.unshift(newEvent);

      return mockSuccess(newEvent);
    }

    const { data } = await apiClient.post<ApiResponse<Event>>(
      "/events",
      payload,
    );
    return data;
  },

  async updateEvent(
    eventId: string,
    payload: UpdateEventRequest,
  ): Promise<ApiResponse<Event>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);

      // Tìm vị trí của sự kiện trong mảng giả lập
      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error("Event not found");

      // Cập nhật dữ liệu mới đè lên dữ liệu cũ
      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        ...payload,
        // Cập nhật các object lồng nhau (tránh bị mất ID cũ)
        address: {
          ...MOCK_EVENTS[eventIndex].address,
          ...payload.address,
        },
        thumbnail: {
          ...MOCK_EVENTS[eventIndex].thumbnail,
          ...payload.thumbnail,
        },
        images: payload.images.map((img, idx) => ({
          id: `img-${Date.now()}-gal-${idx}`,
          ...img,
        })),
        lastModifiedAt: new Date().toISOString(),
      };

      // Lưu lại vào mảng Mock
      MOCK_EVENTS[eventIndex] = updatedEvent;

      return mockSuccess(updatedEvent);
    }

    const { data } = await apiClient.put<ApiResponse<Event>>(
      `/events/${eventId}`,
      payload,
    );
    return data;
  },

  async approveEvent(eventId: string): Promise<ApiResponse<null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error("Event not found");

      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        status: "PUBLISHED",
        rejectReason: null,
        lastModifiedAt: new Date().toISOString(),
      };

      MOCK_EVENTS[eventIndex] = updatedEvent;
      return mockSuccess(null);
    }

    const { data } = await apiClient.post<ApiResponse<null>>(
      `/events/${eventId}/approve`,
    );
    return data;
  },

  // TỪ CHỐI SỰ KIỆN (Dành cho Admin/Mod)
  async rejectEvent(
    eventId: string,
    payload: RejectEventRequest,
  ): Promise<ApiResponse<null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error("Event not found");

      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        status: "REJECTED",
        rejectReason: payload.reason,
        rejectedCount: (MOCK_EVENTS[eventIndex].rejectedCount || 0) + 1,
        lastModifiedAt: new Date().toISOString(),
      };

      MOCK_EVENTS[eventIndex] = updatedEvent;
      return mockSuccess(null);
    }

    const { data } = await apiClient.post<ApiResponse<null>>(
      `/events/${eventId}/reject`,
      payload,
    );
    return data;
  },

  async deleteEvent(eventId: string): Promise<ApiResponse<null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);

      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) throw new Error("Event not found");

      MOCK_EVENTS.splice(eventIndex, 1);

      return mockSuccess(null);
    }

    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/events/${eventId}`,
    );
    return data;
  },

  async checkInAttendee(
    eventId: string,
    qrToken: string,
  ): Promise<
    ApiResponse<{ registration_id: string; user_name: string; status: string }>
  > {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        registration_id: "reg-001",
        user_name: "Nhã Uyên",
        status: "CHECKED_IN",
      });
    }
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
  async getStations(): Promise<ApiResponse<RecyclingStation[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_STATIONS.filter((s) => s.status === "ACTIVE"));
    }
    const { data } =
      await apiClient.get<ApiResponse<RecyclingStation[]>>("/stations");
    return data;
  },
};

// ============================================================
// COMMUNITY / TRASH REPORT SERVICE
// ============================================================
export const trashService = {
  async getReports(
    params?: PaginationParams,
  ): Promise<ApiResponse<PageResponse<TrashSpotReport>>> {
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
    const { data } = await apiClient.get<
      ApiResponse<PageResponse<TrashSpotReport>>
    >("/trash-reports", {
      params: {
        page: params?.page,
        size: params?.size,
      },
    });
    return data;
  },

  async createReport(
    payload: CreateTrashReportRequest,
  ): Promise<ApiResponse<TrashSpotReport>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const report: TrashSpotReport = {
        id: `trash-${Date.now()}`,
        reporter_id: "usr-001",
        after_media_urls: null,
        verify_count: 0,
        hot_score: 0,
        assigned_ngo_id: null,
        status: "SUBMITTED",
        resolve_note: null,
        resolve_completed_at: null,
        admin_resolve_note: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      };
      return mockSuccess(report);
    }
    const { data } = await apiClient.post<ApiResponse<TrashSpotReport>>(
      "/trash-reports",
      payload,
    );
    return data;
  },
};

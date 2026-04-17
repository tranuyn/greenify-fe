// ============================================================
// EVENT TYPES
// Mapped from: events, event_registrations, event_predictions
// ============================================================

import { SortOption } from "@/constants/enums/sortOptions.enum";
import { BaseQueryParams, SortParams } from "./common.types";
import { MediaDto } from "./media.types";

export type EventStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_REVISION"
  | "PUBLISHED"
  | "CLOSED"
  | "CANCELLED";

export const REGISTRATION_STATUS = {
  REGISTERED: "REGISTERED",
  WAITLISTED: "WAITLISTED",
  CANCELLED: "CANCELLED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  ATTENDED: "ATTENDED",
  NO_SHOW: "NO_SHOW",
} as const;

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];

export type RegistrationRewardStatus =
  | "PENDING_REWARD"
  | "REWARDED"
  | "REVERSED";

export type EventType =
  | "CLEANUP"
  | "PLANTING"
  | "RECYCLING"
  | "EDUCATION"
  | "OTHER";
export interface EventAddress {
  id?: string;
  province: string;
  ward: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
}
export interface EventImage extends MediaDto {
  id?: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  startTime: string; // ISO 8601
  endTime: string;
  maxParticipants: number;
  minParticipants: number;
  cancelDeadlineHoursBefore: number;
  signUpDeadlineHoursBefore: number;
  reminderHoursBefore: number;
  thankYouHoursAfter: number;
  rewardPoints: number;
  status: EventStatus;
  rejectReason?: string | null;
  rejectedCount: number;
  address: EventAddress;
  thumbnail: EventImage;
  images: EventImage[];
  createdAt: string;
  lastModifiedAt: string;
  // UI Helpers (Joined from other tables)
  registeredCount?: number;
  ngoName?: string;
}
export interface EventQueryParams
  extends BaseQueryParams, SortParams<SortOption> {
  title?: string;
  eventType?: EventType | "all";
  status?: EventStatus | "all";
}
export interface EventApiRequestParams extends Omit<
  EventQueryParams,
  "eventType" | "status" | "sort"
> {
  eventType?: string;
  status?: string;
  sort?: string[];
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  qr_token: string;
  status: RegistrationStatus;
  checked_in_at: string | null;
  checked_out_at: string | null;
  attended_valid: boolean;
  reward_status: RegistrationRewardStatus;
  created_at: string;
  // Joined
  event?: Event;
}

export interface EventPrediction {
  id: string;
  ngo_id: string;
  event_id: string | null;
  input_params: {
    province: string;
    event_type: string;
    start_time: string;
    expected_scale: number;
  };
  feasibility_score: number; // 0–100
  predicted_attendance: number;
  created_at: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: EventType;
  startTime: string; // ISO 8601
  endTime: string;
  maxParticipants: number;
  minParticipants: number;
  cancelDeadlineHoursBefore: number;
  signUpDeadlineHoursBefore: number;
  reminderHoursBefore: number;
  thankYouHoursAfter: number;
  rewardPoints: number;
  status: EventStatus; // Thường là 'DRAFT' hoặc 'APPROVAL_WAITING'
  thumbnail: MediaDto;
  images: MediaDto[];
  address: Omit<EventAddress, "id">;
}

export type UpdateEventRequest = CreateEventRequest;

export interface RejectEventRequest {
  reason: string;
}
// ============================================================
// MAP / RECYCLING STATION TYPES
// Mapped from: recycling_stations
// ============================================================

export type StationStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "TEMPORARY_CLOSED";

export interface OpeningHours {
  [day: string]: { open: string; close: string } | null; // null = closed
}

export interface RecyclingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  waste_types: string[]; // e.g. ["Giấy", "Nhựa", "Pin"]
  opening_hours: OpeningHours;
  contact_phone: string;
  notes: string | null;
  status: StationStatus;
}

// ============================================================
// TRASH SPOT REPORT TYPES
// Mapped from: trash_spot_reports, trash_spot_verifications
// ============================================================

export type TrashSpotStatus =
  | "SUBMITTED"
  | "PENDING_VERIFY"
  | "VERIFIED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "PENDING_RESOLVE_APPROVAL"
  | "RESOLVED"
  | "REOPENED"
  | "FLAGGED";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH";

export type VerificationDecision = "VERIFY" | "REPORT_FAKE";

export interface TrashSpotReport {
  id: string;
  reporter_id: string;
  description: string;
  latitude: number;
  longitude: number;
  before_media_urls: string[];
  after_media_urls: string[] | null;
  severity_level: SeverityLevel;
  verify_count: number;
  hot_score: number;
  assigned_ngo_id: string | null;
  status: TrashSpotStatus;
  resolve_note: string | null;
  resolve_completed_at: string | null;
  admin_resolve_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrashSpotVerification {
  id: string;
  report_id: string;
  verifier_id: string;
  decision: VerificationDecision;
  is_valid: boolean;
  created_at: string;
}

export type CreateTrashReportRequest = Pick<
  TrashSpotReport,
  | "description"
  | "latitude"
  | "longitude"
  | "before_media_urls"
  | "severity_level"
>;

// ============================================================
// NOTIFICATION TYPES
// Mapped from: notifications
// ============================================================

export type NotificationStatus = "QUEUED" | "SENT" | "FAILED" | "READ";

export type NotificationTemplateKey =
  | "POST_VERIFIED"
  | "POST_REJECTED"
  | "POINTS_EARNED"
  | "CTV_ELIGIBLE"
  | "EVENT_PUBLISHED"
  | "LEADERBOARD_RESULT"
  | "VOUCHER_RECEIVED"
  | "STREAK_BROKEN"
  | "GARDEN_MATURED"
  | "TRASH_VERIFIED";

export interface Notification {
  id: string;
  user_id: string;
  template_key: NotificationTemplateKey;
  title: string;
  body: string;
  source_id: string | null;
  status: NotificationStatus;
  created_at: string;
}

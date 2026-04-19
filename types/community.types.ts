// ============================================================
// EVENT TYPES
// Mapped from: events, event_registrations, event_predictions
// ============================================================

import { SortOption } from '@/constants/enums/sortOptions.enum';
import { BaseQueryParams, SortParams } from './common.types';
import { MediaDto } from './media.types';

export type EventStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_REVISION'
  | 'PUBLISHED'
  | 'CLOSED'
  | 'CANCELLED';

export const REGISTRATION_STATUS = {
  REGISTERED: 'REGISTERED',
  WAITLISTED: 'WAITLISTED',
  CANCELLED: 'CANCELLED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  ATTENDED: 'ATTENDED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];

export type RegistrationRewardStatus = 'PENDING_REWARD' | 'REWARDED' | 'REVERSED';

export type EventType = 'CLEANUP' | 'PLANTING' | 'RECYCLING' | 'EDUCATION' | 'OTHER';

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
export interface EventQueryParams extends BaseQueryParams, SortParams<SortOption> {
  title?: string;
  eventType?: EventType | 'all';
  status?: EventStatus | 'all';
}
export interface EventApiRequestParams extends Omit<
  EventQueryParams,
  'eventType' | 'status' | 'sort'
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
  address: Omit<EventAddress, 'id'>;
}

export type UpdateEventRequest = CreateEventRequest;

export interface RejectEventRequest {
  reason: string;
}
// ============================================================
// MAP / RECYCLING STATION TYPES
// Mapped from: recycling_stations
// ============================================================

export type StationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'TEMPORARY_CLOSED';

export interface AddressDto {
  id: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
}

export interface RecyclingStationWasteTypeDto {
  id: string;
  name: string;
  description: string;
}

export interface RecyclingStationOpenTimeDto {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

export interface RecyclingStationApiModel {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  status: StationStatus;
  address: AddressDto;
  wasteTypes: RecyclingStationWasteTypeDto[];
  openTimes: RecyclingStationOpenTimeDto[];
}

export interface WasteType {
  id: string;
  name: string;
  description: string;
}

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
  | 'SUBMITTED'
  | 'PENDING_VERIFY'
  | 'VERIFIED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'PENDING_RESOLVE_APPROVAL'
  | 'RESOLVED'
  | 'REOPENED'
  | 'FLAGGED';

export enum SeverityTier {
  SEVERITY_LOW = 'SEVERITY_LOW',
  SEVERITY_MEDIUM = 'SEVERITY_MEDIUM',
  SEVERITY_HIGH = 'SEVERITY_HIGH',
}

export interface TrashSpotQueryParams {
  province?: string;
  status?: TrashSpotStatus;
  severityTier?: SeverityTier;
  wasteTypeId?: string;
}

export interface TrashSpotListItem {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  province: string;
  status: TrashSpotStatus;
  severityTier: SeverityTier;
  hotScore: number;
  verificationCount: number;
  primaryImageUrl: string;
  wasteTypeNames: string[];
  createdAt: string;
}

export interface TrashSpotReport {
  id: string;
  name: string;
  reporterId: string;
  reporterDisplayName: string;
  description: string;
  latitude: number;
  longitude: number;
  province: string;
  status: TrashSpotStatus;
  verificationCount: number;
  hotScore: number;
  severityTier: SeverityTier;
  assignedNgoId: string | null;
  assignedNgoDisplayName: string | null;
  claimedAt: string | null;
  resolvedAt: string | null;
  imageUrls: string[];
  wasteTypeIds: string[];
  wasteTypeNames: string[];
  verifications: TrashSpotVerification[];
  resolveRequests: TrashSpotResolveRequest[];
  createdAt: string;
  lastModifiedAt: string;
}

export interface TrashSpotVerification {
  id: string;
  verifierId: string;
  verifierDisplayName: string;
  note: string;
  createdAt: string;
}

export interface CreateTrashSpotVerificationRequest {
  note: string;
}

export type TrashSpotResolveRequestStatus = 'PENDING_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED';

export interface TrashSpotResolveRequest {
  id: string;
  trashSpotId: string;
  ngoId: string;
  ngoDisplayName: string;
  description: string;
  cleanedAt: string;
  status: TrashSpotResolveRequestStatus;
  rejectReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  imageUrls: string[];
  createdAt: string;
}

export interface CreateTrashSpotReportRequest {
  images: MediaDto[];
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  wasteTypeIds: string[];
  description: string;
}

export type CreateTrashReportRequest = CreateTrashSpotReportRequest;

// ============================================================
// NOTIFICATION TYPES
// Mapped from: notifications
// ============================================================

export type NotificationStatus = 'QUEUED' | 'SENT' | 'FAILED' | 'READ';

export type NotificationTemplateKey =
  | 'POST_VERIFIED'
  | 'POST_REJECTED'
  | 'POINTS_EARNED'
  | 'CTV_ELIGIBLE'
  | 'EVENT_PUBLISHED'
  | 'LEADERBOARD_RESULT'
  | 'VOUCHER_RECEIVED'
  | 'STREAK_BROKEN'
  | 'GARDEN_MATURED'
  | 'TRASH_VERIFIED';

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

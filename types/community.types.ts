// ============================================================
// EVENT TYPES
// Mapped from: events, event_registrations, event_predictions
// ============================================================

export type EventStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_REVISION'
  | 'PUBLISHED'
  | 'CLOSED'
  | 'CANCELLED';

export type RegistrationStatus =
  | 'REGISTERED'
  | 'WAITLISTED'
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'ATTENDED'
  | 'NO_SHOW';

export type RegistrationRewardStatus = 'PENDING_REWARD' | 'REWARDED' | 'REVERSED';

export interface Event {
  id: string;
  ngo_id: string;
  title: string;
  description: string;
  event_type: string;
  cover_image_url: string;
  location_address: string;
  latitude: number;
  longitude: number;
  start_time: string;
  end_time: string;
  max_participants: number;
  reward_points: number;
  participation_conditions: string;
  cancel_deadline_days: number;
  status: EventStatus;
  admin_note: string | null;
  created_at: string;
  // Joined
  ngo_name?: string;
  registered_count?: number;
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

export type CreateEventRequest = Omit<
  Event,
  'id' | 'ngo_id' | 'status' | 'admin_note' | 'created_at' | 'ngo_name' | 'registered_count'
>;

// ============================================================
// MAP / RECYCLING STATION TYPES
// Mapped from: recycling_stations
// ============================================================

export type StationStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'TEMPORARY_CLOSED';

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

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type VerificationDecision = 'VERIFY' | 'REPORT_FAKE';

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
  'description' | 'latitude' | 'longitude' | 'before_media_urls' | 'severity_level'
>;

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

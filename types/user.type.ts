export type UserRole = 'USER' | 'CTV' | 'NGO' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'FLAGGED';
export type CtvStatus =
  | 'NOT_ELIGIBLE'
  | 'ELIGIBLE'
  | 'PENDING_UPGRADE'
  | 'ACTIVE_CTV'
  | 'DOWNGRADED';

export type OtpStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'FAILED';

export type NgoVerifyStatus = 'PENDING_VERIFY' | 'VERIFIED' | 'REJECTED';

// ---- Entities ----
export interface User {
  id: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  ctv_status: CtvStatus;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  province: string;
  district: string | null;
  ward: string | null;
  free_time_slots: FreeTimeSlot[] | null;
}

export interface FreeTimeSlot {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  from: string; // "08:00"
  to: string; // "12:00"
}

export interface NgoProfile {
  id: string;
  user_id: string;
  org_name: string;
  representative_name: string;
  hotline: string;
  contact_email: string;
  address: string;
  description: string;
  verification_docs: string[]; // array of URLs
  verify_status: NgoVerifyStatus;
  reject_reason: string | null;
}

export interface OtpRequest {
  id: string;
  email: string;
  status: OtpStatus;
  expires_at: string;
  created_at: string;
}

// ---- API Request/Response shapes ----

export interface RegisterEmailRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp_code: string;
}

export interface SetPasswordRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  profile: UserProfile | null;
}

export interface CompleteProfileRequest {
  display_name: string;
  avatar_url?: string;
  province: string;
  district?: string;
  ward?: string;
}

// User với profile gộp lại — dùng ở phần lớn màn hình
export interface AuthenticatedUser {
  user: User;
  profile: UserProfile;
}

export interface CreateUserInput {
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}

export type UpdateUserInput = Partial<Pick<User, 'phone' | 'status' | 'ctv_status'>>;

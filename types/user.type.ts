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
  avatar_url: string | null;
  hotline: string;
  contact_email: string;
  // address: string;
  province: string;
  ward: string | null;
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

export type RegisterEmailRequest = Pick<User, 'email'>;

export interface VerifyOtpRequest extends RegisterEmailRequest {
  otp_code: string;
}

export interface LoginRequest extends RegisterEmailRequest {
  password: string;
}

// Kế thừa CẢ 2 hàm => Sẽ tự động gộp thành { email, otp_code, password }
export interface SetPasswordRequest extends VerifyOtpRequest, LoginRequest {}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  profile: UserProfile | NgoProfile | null;
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
  profile: UserProfile | NgoProfile | null;
}

export interface CreateUserInput {
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}

export type UpdateUserInput = Partial<Pick<User, 'phone' | 'status' | 'ctv_status'>>;

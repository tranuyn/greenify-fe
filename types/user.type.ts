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
  firstName: string;
  lastName: string;
  displayName: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  status: UserStatus;
  avatarUrl: string;
  //free_time_slots: FreeTimeSlot[] | null;
}

export interface FreeTimeSlot {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  from: string; // "08:00"
  to: string; // "12:00"
}

export interface NgoProfile {
  id: string;
  user_id: string;
  orgName: string;
  representativeName: string;
  avatarUrl: string | null;
  hotline: string;
  contactEmail: string;
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

export interface RegisterEmailRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verificationToken: string;
}

export interface SetPasswordRequest {
  verificationToken: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  identifier: string; // email hoặc phone
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface CompleteProfileRequest {
  displayName: string;
  avatar_url?: string;
  province: string;
  district?: string;
  ward?: string;
}

// User với profile gộp lại — dùng ở phần lớn màn hình
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole[];
  phoneNumber: string;
  username: string;
  user: User;
  userProfile: UserProfile;
  ngoProfile?: NgoProfile; // Có thể có ngoProfile nếu user là NGO, nhưng không bắt buộc phải có (nếu chưa hoàn thành hồ sơ)
}

export interface CreateUserInput {
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}

export type UpdateUserInput = Partial<Pick<User, 'phone' | 'status' | 'ctv_status'>>;

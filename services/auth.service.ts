import { apiClient, tokenStorage } from 'lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterEmailRequest,
  VerifyOtpRequest,
  SetPasswordRequest,
  CompleteProfileRequest,
  UserProfile,
  AuthenticatedUser,
} from 'types/user.type';
import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import { MOCK_AUTH_RESPONSE, MOCK_AUTHENTICATED_USER, MOCK_USER_PROFILE } from './mock/user.mock';
import { ApiResponse } from 'types/common.types';

export const authService = {
  /**
   * Bước 1: Gửi email để nhận OTP
   */
  async requestOtp(payload: RegisterEmailRequest): Promise<ApiResponse<{ message: string }>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      return mockSuccess({ message: 'OTP đã được gửi đến email của bạn.' });
    }
    const { data } = await apiClient.post('/auth/otp/request', payload);
    return data;
  },

  /**
   * Bước 2: Xác minh OTP
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<ApiResponse<{ message: string }>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      // Mock: bất kỳ mã 6 số nào đều pass
      if (payload.otp_code.length !== 6) {
        throw {
          response: { data: { message: 'Mã OTP không hợp lệ.', error_code: 'OTP_INVALID' } },
        };
      }
      return mockSuccess({ message: 'Xác minh OTP thành công.' });
    }
    const { data } = await apiClient.post('/auth/otp/verify', payload);
    return data;
  },

  /**
   * Bước 3: Đặt mật khẩu (đăng ký)
   */
  async setPassword(payload: SetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({ message: 'Mật khẩu đã được đặt thành công.' });
    }
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  /**
   * Đăng nhập → nhận token
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      await tokenStorage.setAccess(MOCK_AUTH_RESPONSE.access_token);
      await tokenStorage.setRefresh(MOCK_AUTH_RESPONSE.refresh_token);
      return mockSuccess(MOCK_AUTH_RESPONSE);
    }
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    if (data.success) {
      await tokenStorage.setAccess(data.data.access_token);
      await tokenStorage.setRefresh(data.data.refresh_token);
    }
    return data;
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    if (!IS_MOCK_MODE) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Ignore logout API errors — vẫn clear local token
      }
    }
    await tokenStorage.clear();
  },

  /**
   * Hoàn thiện hồ sơ sau đăng ký
   */
  async completeProfile(payload: CompleteProfileRequest): Promise<ApiResponse<UserProfile>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const profile: UserProfile = {
        ...MOCK_USER_PROFILE,
        display_name: payload.display_name,
        province: payload.province,
        ward: payload.ward ?? null,
        avatar_url: payload.avatar_url ?? null,
      };
      return mockSuccess(profile);
    }
    const { data } = await apiClient.post<ApiResponse<UserProfile>>('/users/me/profile', payload);
    return data;
  },

  /**
   * Lấy thông tin user hiện tại (dùng khi app khởi động)
   */
  async getMe(): Promise<ApiResponse<AuthenticatedUser>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_AUTHENTICATED_USER);
    }
    const { data } = await apiClient.get<ApiResponse<AuthenticatedUser>>('/users/me');
    return data;
  },

  async updateProfile(payload: CompleteProfileRequest): Promise<ApiResponse<UserProfile>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const profile: UserProfile = {
        ...MOCK_USER_PROFILE,
        display_name: payload.display_name,
        province: payload.province,
        ward: payload.ward ?? null,
        avatar_url: payload.avatar_url ?? null,
      };
      return mockSuccess(profile);
    }
    const { data } = await apiClient.patch<ApiResponse<UserProfile>>('/users/me/profile', payload);
    return data;
  },
};

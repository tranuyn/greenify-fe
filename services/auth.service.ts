import { apiClient, tokenStorage } from 'lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterEmailRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SetPasswordRequest,
  LogoutRequest,
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
   * POST /auth/register/send-otp
   */
  async requestOtp(payload: RegisterEmailRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      if (IS_MOCK_MODE) {
        await mockDelay(800);
        return mockSuccess({ message: 'OTP đã được gửi đến email của bạn.' });
      }
      const { data } = await apiClient.post('/auth/otp/request', payload);
      return data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Bước 2: Xác minh OTP
   * POST /auth/register/verify-otp
   * Response: { verificationToken }
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      if (payload.otp.length !== 6) {
        throw {
          response: { data: { message: 'Mã OTP không hợp lệ.', error_code: 'OTP_INVALID' } },
        };
      }
      return mockSuccess({ verificationToken: 'mock_verification_token_' + payload.identifier });
    }
    const { data } = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
      '/auth/register/verify-otp',
      payload
    );
    return data;
  },

  /**
   * Bước 3: Đặt mật khẩu (đăng ký)
   * POST /auth/register
   * Response: { access_token, refresh_token }
   */
  async setPassword(payload: SetPasswordRequest): Promise<ApiResponse<LoginResponse>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const tokens = {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
      };
      return mockSuccess(tokens);
    }
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', payload);
    if (data.success) {
      await tokenStorage.setAccess(data.data.access_token);
      await tokenStorage.setRefresh(data.data.refresh_token);
    }
    return data;
  },

  /**
   * Đăng nhập → nhận token
   * POST /auth/authenticate
   * Body: { identifier, password }
   * Response: { access_token, refresh_token }
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const tokens = {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
      };
      await tokenStorage.setAccess(tokens.access_token);
      await tokenStorage.setRefresh(tokens.refresh_token);
      return mockSuccess(tokens);
    }
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/authenticate',
      payload
    );
    if (data.success) {
      await tokenStorage.setAccess(data.data.access_token);
      await tokenStorage.setRefresh(data.data.refresh_token);
    }
    return data;
  },

  /**
   * Refresh token → nhận access token mới
   * POST /auth/refresh-token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      const tokens = {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
      };
      return mockSuccess(tokens);
    }
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh-token', {
      refreshToken,
    });
    if (data.success) {
      await tokenStorage.setAccess(data.data.access_token);
      await tokenStorage.setRefresh(data.data.refresh_token);
    }
    return data;
  },

  /**
   * Đăng xuất
   * POST /auth/logout
   * Headers: Authorization: Bearer {access_token}
   * Body: { refreshToken }
   */
  async logout(): Promise<void> {
    if (!IS_MOCK_MODE) {
      try {
        const refreshToken = await tokenStorage.getRefresh();
        if (refreshToken) {
          await apiClient.post('/auth/logout', { refreshToken });
        }
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

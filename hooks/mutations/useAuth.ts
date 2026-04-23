import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { queryClient } from 'lib/queryClient';
import { authService } from 'services/auth.service';
import {
  CompleteProfileRequest,
  CreateNgoProfileRequest,
  LoginRequest,
  RegisterEmailRequest,
  VerifyOtpRequest,
  SetPasswordRequest,
  SetPasswordWhenForgotRequest,
} from 'types/user.type';
import { QUERY_KEYS } from 'constants/queryKeys';

/**
 * Gửi OTP về email.
 *
 * Cách dùng trong component:
 *   const { mutate: requestOtp, isPending } = useRequestOtp();
 *   requestOtp({ identifier: 'email@example.com' }, {
 *     onSuccess: () => router.push('/(auth)/verify-email'),
 *     onError: (err) => setError(parseApiError(err)),
 *   });
 *
 * Lý do onSuccess/onError để ở component thay vì hook:
 * - Navigation logic thuộc về UI layer
 * - Mỗi màn hình có thể handle error khác nhau (show toast, show inline error...)
 * - Hook chỉ lo phần gọi API
 */
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: RegisterEmailRequest) => authService.requestOtp(payload),
  });
};

export const useRequestOtpWhenForgot = () => {
  return useMutation({
    mutationFn: (payload: RegisterEmailRequest) => authService.requestOtpForgot(payload),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
  });
};

export const useVerifyOtpWhenForgot = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtpForgot(payload),
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (payload: SetPasswordRequest) => authService.setPassword(payload),
  });
};

export const useSetPasswordWhenForgot = () => {
  return useMutation({
    mutationFn: (payload: SetPasswordWhenForgotRequest) => authService.setPasswordOtp(payload),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: () => {
      // Đăng nhập user mới -> xóa cache user cũ để các query refetch lại đúng tài khoản.
      queryClient.clear();
    },
  });
};

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: (payload: CompleteProfileRequest) => authService.completeProfile(payload),
    onSuccess: () => {
      // Profile đã thay đổi → invalidate cache /me để refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload: CompleteProfileRequest) => authService.updateProfile(payload),
    onSuccess: () => {
      // Profile đã thay đổi → invalidate cache /me để refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useCreateNgoProfile = () => {
  return useMutation({
    mutationFn: (payload: CreateNgoProfileRequest) => authService.createNgoProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useUpdateNgoProfile = () => {
  return useMutation({
    mutationFn: (payload: CreateNgoProfileRequest) => authService.updateNgoProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Dù API logout thành công hay lỗi, vẫn dọn cache + về auth để tránh lộ data user cũ.
      queryClient.clear();
      router.replace('/(auth)');
    },
  });
};

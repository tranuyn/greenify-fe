import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { queryClient } from 'lib/queryClient';
import { authService } from 'services/auth.service';
import {
  CompleteProfileRequest,
  LoginRequest,
  RegisterEmailRequest,
  VerifyOtpRequest,
  SetPasswordRequest,
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

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (payload: SetPasswordRequest) => authService.setPassword(payload),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
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

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Xóa toàn bộ cache khi logout — tránh data của user cũ còn sót
      queryClient.clear();
      router.replace('/(auth)');
    },
  });
};

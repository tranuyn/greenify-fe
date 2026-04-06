import { z } from 'zod';

// Rule chung cho password để tái sử dụng ở nhiều form (Đăng ký, Đổi pass...)
export const passwordRule = z
  .string()
  .min(1, 'Vui lòng nhập mật khẩu.')
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.');

// Schema cho form Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Định dạng email không hợp lệ.'),
  password: passwordRule,
});

// Tự động suy luận Type từ Schema ra (Không cần gõ lại bằng tay)
export type LoginFormData = z.infer<typeof loginSchema>;

// Định nghĩa form nhập Email đăng ký
export const signupEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Định dạng email không hợp lệ.'),
});
export type SignupEmailFormData = z.infer<typeof signupEmailSchema>;

// Định nghĩa form Mật khẩu (có check khớp nhau)
export const signupPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp.',
    path: ['confirmPassword'], // Báo lỗi ở ô confirm
  });
export type SignupPasswordFormData = z.infer<typeof signupPasswordSchema>;

export const completeProfileSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Vui lòng nhập họ và tên.')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự.'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố.'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã.'),
});
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

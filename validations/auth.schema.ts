import { z } from 'zod';

// Rule chung cho password để tái sử dụng ở nhiều form (Đăng ký, Đổi pass...)
export const passwordRule = z
  .string()
  .min(1, 'Vui lòng nhập mật khẩu.')
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.');

// Schema cho form Login
export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email.').email('Định dạng email không hợp lệ.'),
  password: passwordRule,
});

// Tự động suy luận Type từ Schema ra (Không cần gõ lại bằng tay)
export type LoginFormData = z.infer<typeof loginSchema>;

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { authService } from 'services/auth.service';

/**
 * Lấy thông tin user đang đăng nhập.
 * Dùng ở _layout hoặc màn hình profile để biết user là ai.
 *
 * enabled: false by default — chỉ fetch khi có token.
 * Bạn sẽ truyền enabled={!!token} từ auth store sau.
 */
export const useGetMe = (enabled = false) => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: () => authService.getMe().then((res) => res.data),
    enabled,
    // Thông tin user ít thay đổi → stale lâu hơn default
    staleTime: 5 * 60 * 1000,
  });
};
import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Singleton QueryClient — import vào _layout.tsx thay vì tạo inline.
 * Tách ra file riêng để có thể dùng queryClient.invalidateQueries()
 * bên ngoài React component tree (ví dụ trong service layer).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Trên mobile không có "window focus" event nên tắt
      refetchOnWindowFocus: false,
      // Stale sau 2 phút — phù hợp cho data bán tĩnh (action types, stations)
      staleTime: 2 * 60 * 1000,
      // Giữ cache 5 phút sau khi component unmount
      gcTime: 5 * 60 * 1000,
      // Retry thông minh: không retry lỗi 4xx (lỗi do client)
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status ?? 0;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      // Mutation không retry mặc định
      retry: false,
    },
  },
});

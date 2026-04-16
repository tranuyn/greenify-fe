import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { authService } from 'services/auth.service';
import { AuthenticatedUser } from 'types/user.type'; // Import type để typescript support

/**
 * Lấy thông tin user hiện tại.
 * Đã được pre-populate từ `index.tsx` khi restart app hoặc `useLogin` khi đăng nhập.
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: async () => {
      const res = await authService.getMe();
      return res.data;
    },
    // Data sống được 10 phút. Trong 10 phút này nếu component mount,
    // nó lấy thẳng từ cache (Sync 100%, không loading)
    staleTime: 10 * 60 * 1000,
  });
};

export const useAuthRole = () => {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<AuthenticatedUser>(QUERY_KEYS.auth.me());

  return {
    userId: authData?.user?.id ?? null,
    role: authData?.user?.role ?? null,
    isNgo: authData?.user?.role === 'NGO',
    isCitizen: authData?.user?.role === 'USER',
    isCtv: authData?.user?.role === 'CTV' || authData?.user?.ctv_status === 'ACTIVE_CTV',
    isAdmin: authData?.user?.role === 'ADMIN',
  };
};

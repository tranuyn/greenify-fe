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
      return authService.getMe();
    },
    // Data sống được 10 phút. Trong 10 phút này nếu component mount,
    // nó lấy thẳng từ cache (Sync 100%, không loading)
    staleTime: 10 * 60 * 1000,
  });
};

export const useAuthRole = () => {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<AuthenticatedUser>(QUERY_KEYS.auth.me());
  const roles = authData?.roles ?? [];

  return {
    userId: authData?.id ?? null,
    role: roles,
    isNgo: roles.includes('NGO'),
    isCitizen: roles.includes('USER'),
    isCtv: roles.includes('CTV'),
    isAdmin: roles.includes('ADMIN'),
  };
};

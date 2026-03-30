import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { userApi } from '../../api/userApi';
import { QUERY_KEYS } from '../../constants/queryKeys';

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (data) => {
      // Xóa cache của danh sách user cũ.
      // Tự động gọi lại API để hiện user mới trong danh sách.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      Alert.alert('Thành công', 'Đã thêm người dùng mới!');
    },

    // khi API thất bại
    onError: (error) => {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tạo người dùng. Vui lòng thử lại!');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (data) => {
      // Xóa cache của danh sách user cũ.
      // Tự động gọi lại API để hiện danh sách đã xóa user.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      Alert.alert('Thành công', 'Đã xóa người dùng!');
    },
    onError: (error) => {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể xóa người dùng. Vui lòng thử lại!');
    },
  });
};

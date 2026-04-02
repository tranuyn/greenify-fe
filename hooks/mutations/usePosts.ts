import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { actionService } from 'services/action.service';
import { CreatePostRequest } from 'types/action.types';

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (payload: CreatePostRequest) => actionService.createPost(payload),
    onSuccess: () => {
      // Invalidate feed + my posts cùng lúc vì posts.all là prefix chung
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      // Streak có thể tăng sau khi đăng bài → invalidate luôn
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak.mine() });
    },
  });
};
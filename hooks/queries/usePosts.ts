import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { FeedQueryParams, PaginationParams } from 'types/common.types';
import { actionService } from 'services/action.service';

export const useFeedPosts = (params?: FeedQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.feed(params),
    queryFn: () => actionService.getFeedPosts(params).then((r) => r.data),
  });
};

export const useMyPosts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.mine(params),
    queryFn: () => actionService.getMyPosts(params).then((r) => r.data),
  });
};

export const useActionTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.actionTypes.all,
    queryFn: () => actionService.getActionTypes().then((r) => r.data),
    staleTime: 30 * 60 * 1000, // 30 phút — master data, ít thay đổi
  });
};

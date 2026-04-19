import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { PaginationParams } from 'types/common.types';
import { actionService } from 'services/action.service';
import { FeedQueryParams, MyPostsQueryParams } from '@/types/action.types';

export const useFeedPosts = (params?: FeedQueryParams, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.feed(params),
    queryFn: () => actionService.getFeedPosts(params),
    enabled,
  });
};

export const useMyPosts = (params?: MyPostsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.mine(params),
    queryFn: () => actionService.getMyPosts(params),
    enabled,
  });
};

export const useActionTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.actionTypes.all,
    queryFn: () => actionService.getActionTypes(),
    staleTime: 30 * 60 * 1000, // 30 phút — master data, ít thay đổi
  });
};

export const usePostDetail = (postId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(postId),
    queryFn: () => actionService.getPostById(postId),
    enabled: !!postId,
  });
};

// export const usePostReviews = (postId: string) => {
//   return useQuery({
//     queryKey: QUERY_KEYS.posts.reviews(postId),
//     queryFn: () => actionService.getPostReviews(postId).then((r) => r.data),
//     enabled: !!postId,
//   });
// };

export const usePendingReviewPosts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.pendingReview(params),
    queryFn: () => actionService.getPendingReviewPosts(params),
  });
};

export const usePostHistory = (params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.history(params),
    queryFn: () => actionService.getPostHistory(params),
  });
};

export const usePostHistoryInfinite = (size = 10) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.posts.history({ size }),
    queryFn: ({ pageParam = 0 }) =>
      actionService.getPostHistory({
        page: pageParam,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });
};

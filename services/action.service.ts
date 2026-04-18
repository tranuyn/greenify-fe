import { apiClient } from 'lib/apiClient';
import type {
  GreenActionType,
  CreatePostRequest,
  PointWallet,
  PointHistoryEntry,
  PostReview,
  ReviewPostRequest,
  GreenActionPostDetailDto,
  MyPostsQueryParams,
  MyPostsApiRequestParams,
  FeedApiRequestParams,
  FeedQueryParams,
  CreatePostApiRequest,
} from 'types/action.types';
import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import {
  MOCK_ACTION_TYPES,
  MOCK_POSTS,
  MOCK_POINT_WALLET,
  MOCK_LEDGER,
  MOCK_POST_REVIEWS,
} from './mock/action.mock';
import { ApiResponse, PageResponse, PaginationParams } from 'types/common.types';
import { SortOption } from '@/constants/enums/sortOptions.enum';

// ============================================================
// GREEN ACTION SERVICE
// ============================================================
export const actionService = {
  async getActionTypes(): Promise<ApiResponse<GreenActionType[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_ACTION_TYPES.filter((a) => a.is_active));
    }
    const { data } = await apiClient.get<ApiResponse<GreenActionType[]>>('/action-types');
    return data;
  },

  async getFeedPosts(
    params?: FeedQueryParams
  ): Promise<ApiResponse<PageResponse<GreenActionPostDetailDto>>> {
    const apiParams: FeedApiRequestParams = {
      page: params?.page ? params.page - 1 : 0, // BE Spring Boot thường đếm page từ 0
      size: params?.size ?? 10,
    };

    if (params?.search) apiParams.authorDisplayName = params.search;
    if (params?.action_type_id && params.action_type_id !== 'all') {
      apiParams.actionTypeId = params.action_type_id;
    }
    if (params?.fromDate) apiParams.fromDate = params.fromDate;
    if (params?.toDate) apiParams.toDate = params.toDate;

    if (params?.sort === SortOption.POPULAR) {
      apiParams.sort = ['approveCount,desc'];
    } else {
      apiParams.sort = ['createdAt,desc']; // Default là newest
    }

    // 2. XỬ LÝ MOCK DATA (Chạy khi chưa có BE hoặc DB trống)
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      let filteredPosts = [...MOCK_POSTS];

      // Lọc theo Search (Keyword)
      if (params?.search) {
        const lowerSearch = params.search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.caption.toLowerCase().includes(lowerSearch) ||
            (post.authorDisplayName && post.authorDisplayName.toLowerCase().includes(lowerSearch))
        );
      }

      // Lọc theo Loại hành động
      if (params?.action_type_id && params.action_type_id !== 'all') {
        filteredPosts = filteredPosts.filter(
          (post) => post.actionTypeName === params.action_type_id
        );
      }

      // Lọc theo Khoảng thời gian (fromDate, toDate)
      if (params?.fromDate) {
        const fromTime = new Date(params.fromDate).getTime();
        filteredPosts = filteredPosts.filter(
          (post) => new Date(post.createdAt).getTime() >= fromTime
        );
      }
      if (params?.toDate) {
        // Cộng thêm 23h:59m:59s để bao gồm trọn vẹn ngày toDate
        const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
        filteredPosts = filteredPosts.filter(
          (post) => new Date(post.createdAt).getTime() <= toTime
        );
      }

      // Sắp xếp (Sort)
      if (params?.sort === SortOption.POPULAR) {
        filteredPosts.sort((a, b) => b.approveCount - a.approveCount);
      } else {
        filteredPosts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // Phân trang (Pagination)
      const pageIndex = params?.page ?? 1;
      const pageSize = params?.size ?? 10;
      const start = (pageIndex - 1) * pageSize;
      const paginatedPosts = filteredPosts.slice(start, start + pageSize);

      // Trả về đúng chuẩn PageResponse của Spring Boot
      return mockSuccess({
        content: paginatedPosts,
        page: pageIndex,
        size: pageSize,
        totalElements: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / pageSize),
      });
    }

    // 3. GỌI API THẬT (Khi IS_MOCK_MODE = false)
    const { data } = await apiClient.get<ApiResponse<PageResponse<GreenActionPostDetailDto>>>(
      '/posts/feed',
      { params: apiParams }
    );
    return data;
  },

  async getMyPosts(
    params?: MyPostsQueryParams
  ): Promise<ApiResponse<PageResponse<GreenActionPostDetailDto>>> {
    const apiParams: MyPostsApiRequestParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    if (params?.status && params.status !== 'all') {
      apiParams.status = params.status;
    }

    if (params?.fromDate) apiParams.fromDate = params.fromDate;
    if (params?.toDate) apiParams.toDate = params.toDate;

    if (IS_MOCK_MODE) {
      await mockDelay(500);

      let filteredPosts = MOCK_POSTS.filter((p) => p.authorDisplayName === 'Nhã Uyên');

      if (params?.status && params.status !== 'all') {
        filteredPosts = filteredPosts.filter((post) => post.status === params.status);
      }

      if (params?.fromDate) {
        const fromTime = new Date(params.fromDate).getTime();
        filteredPosts = filteredPosts.filter(
          (post) => new Date(post.createdAt).getTime() >= fromTime
        );
      }
      if (params?.toDate) {
        const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
        filteredPosts = filteredPosts.filter(
          (post) => new Date(post.createdAt).getTime() <= toTime
        );
      }

      // Phân trang
      const pageIndex = params?.page ?? 1;
      const pageSize = params?.size ?? 10;
      const start = (pageIndex - 1) * pageSize;
      const paginatedPosts = filteredPosts.slice(start, start + pageSize);

      return mockSuccess({
        content: paginatedPosts,
        page: pageIndex,
        size: pageSize,
        totalElements: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / pageSize),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<GreenActionPostDetailDto>>>(
      '/posts/me/history',
      { params: apiParams }
    );
    return data;
  },
  async createPost(payload: CreatePostRequest): Promise<ApiResponse<GreenActionPostDetailDto>> {
    // 1. ADAPTER: CHUYỂN ĐỔI BODY TỪ UI -> BE
    const apiPayload: CreatePostApiRequest = {
      actionTypeId: payload.action_type_id,
      caption: payload.caption,
      // Map thành object media theo ý BE
      media: {
        bucketName: payload.media_bucket || 'default-bucket',
        objectKey: payload.media_key || 'default-key',
        imageUrl: payload.media_url,
      },
      latitude: payload.latitude,
      longitude: payload.longitude,
      actionDate: payload.action_date,
    };

    // ==========================================
    // 2. XỬ LÝ MOCK DATA
    // ==========================================
    if (IS_MOCK_MODE) {
      await mockDelay(900);

      // Tìm xem user vừa đăng action gì để lấy tên hiển thị
      const actionType = MOCK_ACTION_TYPES.find((a) => a.id === payload.action_type_id);

      // Tạo cục data y hệt GreenActionPostDetailDto
      const newPost: GreenActionPostDetailDto = {
        id: `post-${Date.now()}`,
        authorDisplayName: 'Nhã Uyên',
        authorAvatarUrl: 'https://i.redd.it/ya8qikz9kn0f1.png',
        actionTypeName: actionType?.action_name || 'Hành động xanh',
        groupName: actionType?.group_name || 'Chung',
        caption: payload.caption,
        mediaUrl: payload.media_url,
        approveCount: 0,
        rejectCount: 0,
        location: payload.latitude
          ? `${payload.latitude}, ${payload.longitude}`
          : 'Chưa cập nhật vị trí',
        reviews: [],
        actionDate: payload.action_date,
        status: 'PENDING_REVIEW', // Swagger báo DRAFT, nhưng mock PENDING cho thực tế
        createdAt: new Date().toISOString(),
      };

      MOCK_POSTS.unshift(newPost);

      return mockSuccess(newPost);
    }

    const { data } = await apiClient.post<ApiResponse<GreenActionPostDetailDto>>(
      '/green-action/posts',
      apiPayload
    );
    return data;
  },

  async getPendingReviewPosts(
    params?: PaginationParams
  ): Promise<ApiResponse<PageResponse<GreenActionPostDetailDto>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const pending = MOCK_POSTS.filter((p) => p.status === 'PENDING_REVIEW');
      return mockSuccess({
        content: pending,
        totalElements: pending.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        has_next: false,
        totalPages: Math.ceil(pending.length / (params?.size ?? 10)),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<GreenActionPostDetailDto>>>(
      '/posts/pending-review',
      { params }
    );
    return data;
  },

  async getPostById(postId: string): Promise<ApiResponse<GreenActionPostDetailDto>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (!post) throw new Error('Post not found');
      return mockSuccess(post);
    }
    const { data } = await apiClient.get<ApiResponse<GreenActionPostDetailDto>>(
      `/green-action/posts/${postId}`
    );
    return data;
  },

  // async getPostReviews(postId: string): Promise<ApiResponse<PostReview[]>> {
  //   if (IS_MOCK_MODE) {
  //     await mockDelay(300);
  //     return mockSuccess(MOCK_POST_REVIEWS[postId] ?? []);
  //   }
  //   const { data } = await apiClient.get<ApiResponse<PostReview[]>>(`/posts/${postId}/reviews`);
  //   return data;
  // },

  async reviewPost(postId: string, payload: ReviewPostRequest): Promise<ApiResponse<PostReview>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      const review: PostReview = {
        id: `rev-${Date.now()}`,
        post_id: postId,
        reviewer_id: 'usr-002',
        decision: payload.decision,
        reject_reason_code: payload.reject_reason_code ?? null,
        reject_reason_note: payload.reject_reason_note ?? null,
        is_valid: true,
        created_at: new Date().toISOString(),
      };
      return mockSuccess(review);
    }
    const { data } = await apiClient.post<ApiResponse<PostReview>>(
      `/posts/${postId}/review`,
      payload
    );
    return data;
  },
};

// ============================================================
// POINT WALLET SERVICE
// ============================================================
export const walletService = {
  async getMyWallet(): Promise<PointWallet> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return MOCK_POINT_WALLET;
    }
    const { data } = await apiClient.get<PointWallet>('/green-action/points/me');
    return data;
  },

  async getMyPointHistory(
    params?: PaginationParams
  ): Promise<ApiResponse<PageResponse<PointHistoryEntry>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const pageSize = params?.size ?? 100;
      const pageIndex = params?.page ?? 1;
      const start = (pageIndex - 1) * pageSize;
      const historyItems = MOCK_LEDGER.slice(start, start + pageSize);
      return mockSuccess({
        content: historyItems,
        totalElements: MOCK_LEDGER.length,
        page: pageIndex,
        size: pageSize,
        totalPages: Math.ceil(MOCK_LEDGER.length / pageSize),
      });
    }
    const { data } = await apiClient.get<ApiResponse<PageResponse<PointHistoryEntry>>>(
      '/green-action/points/me/history',
      { params }
    );
    return data;
  },
};

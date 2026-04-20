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
  ReviewPostResponse,
  PostStatus,
  CreateActionTypeRequest,
  UpdateActionTypeRequest,
} from 'types/action.types';
import { mockDelay, mockSuccess } from './mock/config';
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
  async getActionTypes(): Promise<GreenActionType[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   return MOCK_ACTION_TYPES.filter((a) => a.isActive);
    // }

    const { data } = await apiClient.get<GreenActionType[]>('/green-action/action-types');
    return data;
  },
  async createActionType(payload: CreateActionTypeRequest): Promise<GreenActionType> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);

    //   const newAction: GreenActionType = {
    //     id: `act-${Date.now()}`,
    //     ...payload,
    //   };

    //   MOCK_ACTION_TYPES.unshift(newAction);

    //   return newAction;
    // }
    const { data } = await apiClient.post<GreenActionType>(
      '/admin/green-action/action-types',
      payload
    );
    return data;
  },
  async updateActionType(id: string, payload: UpdateActionTypeRequest): Promise<GreenActionType> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);

    //   const idx = MOCK_ACTION_TYPES.findIndex((a) => a.id === id);
    //   if (idx === -1) throw new Error('Action type not found');

    //   // Ghi đè dữ liệu mới lên dữ liệu cũ
    //   const updatedAction: GreenActionType = {
    //     ...MOCK_ACTION_TYPES[idx],
    //     ...payload,
    //   };

    //   MOCK_ACTION_TYPES[idx] = updatedAction;
    //   return updatedAction;
    // }

    const { data } = await apiClient.patch<GreenActionType>(
      `/admin/green-action/action-types/${id}`,
      payload
    );

    return { ...data, id };
  },
  async getFeedPosts(params?: FeedQueryParams): Promise<PageResponse<GreenActionPostDetailDto>> {
    const apiParams: FeedApiRequestParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    if (params?.search) apiParams.authorDisplayName = params.search;
    if (params?.actionTypeId && params.actionTypeId !== 'all') {
      apiParams.actionTypeId = params.actionTypeId;
    }
    if (params?.status && params.status !== 'all') {
      apiParams.status = params.status;
    }
    if (params?.fromDate) apiParams.fromDate = params.fromDate;
    if (params?.toDate) apiParams.toDate = params.toDate;

    if (params?.sort === SortOption.POPULAR) {
      apiParams.sort = ['approveCount,desc'];
    } else {
      apiParams.sort = ['createdAt,desc']; // Default là newest
    }

    // 2. XỬ LÝ MOCK DATA (Chạy khi chưa có BE hoặc DB trống)
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);
    //   let filteredPosts = [...MOCK_POSTS];

    //   // Lọc theo Search (Keyword)
    //   if (params?.search) {
    //     const lowerSearch = params.search.toLowerCase();
    //     filteredPosts = filteredPosts.filter(
    //       (post) =>
    //         post.caption.toLowerCase().includes(lowerSearch) ||
    //         (post.authorDisplayName && post.authorDisplayName.toLowerCase().includes(lowerSearch))
    //     );
    //   }

    //   // Lọc theo Loại hành động
    //   if (params?.action_type_id && params.action_type_id !== 'all') {
    //     filteredPosts = filteredPosts.filter(
    //       (post) => post.actionTypeName === params.action_type_id
    //     );
    //   }

    //   // Lọc theo Khoảng thời gian (fromDate, toDate)
    //   if (params?.fromDate) {
    //     const fromTime = new Date(params.fromDate).getTime();
    //     filteredPosts = filteredPosts.filter(
    //       (post) => new Date(post.createdAt).getTime() >= fromTime
    //     );
    //   }
    //   if (params?.toDate) {
    //     // Cộng thêm 23h:59m:59s để bao gồm trọn vẹn ngày toDate
    //     const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
    //     filteredPosts = filteredPosts.filter(
    //       (post) => new Date(post.createdAt).getTime() <= toTime
    //     );
    //   }

    //   // Sắp xếp (Sort)
    //   if (params?.sort === SortOption.POPULAR) {
    //     filteredPosts.sort((a, b) => b.approveCount - a.approveCount);
    //   } else {
    //     filteredPosts.sort(
    //       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //     );
    //   }

    //   // Phân trang (Pagination)
    //   const pageIndex = params?.page ?? 1;
    //   const pageSize = params?.size ?? 10;
    //   const start = (pageIndex - 1) * pageSize;
    //   const paginatedPosts = filteredPosts.slice(start, start + pageSize);

    //   // Trả về đúng chuẩn PageResponse của Spring Boot
    //   return mockSuccess({
    //     content: paginatedPosts,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalElements: filteredPosts.length,
    //     totalPages: Math.ceil(filteredPosts.length / pageSize),
    //   });
    // }

    // 3. GỌI API THẬT (Khi IS_MOCK_MODE = false)
    const { data } = await apiClient.get<PageResponse<GreenActionPostDetailDto>>(
      '/green-action/posts',
      {
        params: apiParams,
      }
    );
    return data;
  },

  async getMyPosts(params?: MyPostsQueryParams): Promise<PageResponse<GreenActionPostDetailDto>> {
    const apiParams: MyPostsApiRequestParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    if (params?.status && params.status !== 'all') {
      apiParams.status = params.status;
    }

    if (params?.fromDate) apiParams.fromDate = params.fromDate;
    if (params?.toDate) apiParams.toDate = params.toDate;

    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);

    //   let filteredPosts = MOCK_POSTS.filter((p) => p.authorDisplayName === 'Nhã Uyên');

    //   if (params?.status && params.status !== 'all') {
    //     filteredPosts = filteredPosts.filter((post) => post.status === params.status);
    //   }

    //   if (params?.fromDate) {
    //     const fromTime = new Date(params.fromDate).getTime();
    //     filteredPosts = filteredPosts.filter(
    //       (post) => new Date(post.createdAt).getTime() >= fromTime
    //     );
    //   }
    //   if (params?.toDate) {
    //     const toTime = new Date(params.toDate).setHours(23, 59, 59, 999);
    //     filteredPosts = filteredPosts.filter(
    //       (post) => new Date(post.createdAt).getTime() <= toTime
    //     );
    //   }

    //   // Phân trang
    //   const pageIndex = params?.page ?? 1;
    //   const pageSize = params?.size ?? 10;
    //   const start = (pageIndex - 1) * pageSize;
    //   const paginatedPosts = filteredPosts.slice(start, start + pageSize);

    //   return mockSuccess({
    //     content: paginatedPosts,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalElements: filteredPosts.length,
    //     totalPages: Math.ceil(filteredPosts.length / pageSize),
    //   });
    // }
    const { data } = await apiClient.get<PageResponse<GreenActionPostDetailDto>>(
      'green-action/posts/me/history',
      { params: apiParams }
    );
    return data;
  },
  async createPost(payload: CreatePostRequest): Promise<GreenActionPostDetailDto> {
    const apiPayload: CreatePostApiRequest = {
      actionTypeId: payload.action_type_id,
      caption: payload.caption,
      // Map thành object media theo ý BE
      media: {
        bucketName: payload.media_bucket ?? '',
        objectKey: payload.media_key ?? '',
        imageUrl: payload.media_url,
      },
      latitude: payload.latitude,
      longitude: payload.longitude,
      actionDate: payload.action_date,
    };

    // ==========================================
    // 2. XỬ LÝ MOCK DATA
    // ==========================================
    // if (IS_MOCK_MODE) {
    //   await mockDelay(900);

    //   // Tìm xem user vừa đăng action gì để lấy tên hiển thị
    //   const actionType = MOCK_ACTION_TYPES.find((a) => a.id === payload.action_type_id);

    //   // Tạo cục data y hệt GreenActionPostDetailDto
    //   const newPost: GreenActionPostDetailDto = {
    //     id: `post-${Date.now()}`,
    //     authorDisplayName: 'Nhã Uyên',
    //     authorAvatarUrl: 'https://i.redd.it/ya8qikz9kn0f1.png',
    //     actionTypeName: actionType?.actionName || 'Hành động xanh',
    //     groupName: actionType?.groupName || 'Chung',
    //     caption: payload.caption,
    //     mediaUrl: payload.media_url,
    //     approveCount: 0,
    //     rejectCount: 0,
    //     location: payload.latitude
    //       ? `${payload.latitude}, ${payload.longitude}`
    //       : 'Chưa cập nhật vị trí',
    //     reviews: [],
    //     actionDate: payload.action_date,
    //     status: 'PENDING_REVIEW', // Swagger báo DRAFT, nhưng mock PENDING cho thực tế
    //     createdAt: new Date().toISOString(),
    //   };

    //   MOCK_POSTS.unshift(newPost);

    //   return mockSuccess(newPost);
    // }

    const { data } = await apiClient.post<GreenActionPostDetailDto>(
      '/green-action/posts',
      apiPayload
    );
    return data;
  },

  async getPendingReviewPosts(
    params?: PaginationParams
  ): Promise<PageResponse<GreenActionPostDetailDto>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const pending = MOCK_POSTS.filter((p) => p.status === 'PENDING_REVIEW');
    //   return mockSuccess({
    //     content: pending,
    //     totalElements: pending.length,
    //     page: params?.page ?? 1,
    //     size: params?.size ?? 10,
    //     has_next: false,
    //     totalPages: Math.ceil(pending.length / (params?.size ?? 10)),
    //   });
    // }
    const { data } = await apiClient.get<PageResponse<GreenActionPostDetailDto>>(
      '/posts/pending-review',
      { params }
    );
    return data;
  },

  async getPostById(postId: string): Promise<GreenActionPostDetailDto> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const post = MOCK_POSTS.find((p) => p.id === postId);
    //   if (!post) throw new Error('Post not found');
    //   return mockSuccess(post);
    // }
    const { data } = await apiClient.get<GreenActionPostDetailDto>(`/green-action/posts/${postId}`);
    return data;
  },

  async getPostForReview(postId: string): Promise<GreenActionPostDetailDto> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const post = MOCK_POSTS.find((p) => p.id === postId);
    //   if (!post) throw new Error('Post not found');

    //   return mockSuccess({
    //     ...post,
    //     actionTypeId: 'mock-action-id',
    //     latitude: 10.87,
    //     longitude: 106.8031,
    //     alreadyReviewed: false,
    //   });
    // }
    const { data } = await apiClient.get<GreenActionPostDetailDto>(
      `/review/posts/${postId}` // Chuẩn Swagger mới
    );
    return data;
  },

  async reviewPost(postId: string, payload: ReviewPostRequest): Promise<ReviewPostResponse> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);

    //   // Giả lập trạng thái trả về (Duyệt -> VERIFIED, Từ chối -> REJECTED)
    //   const newStatus: PostStatus = payload.decision === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    //   return mockSuccess({
    //     reviewId: `rev-${Date.now()}`,
    //     postId: postId,
    //     decision: payload.decision,
    //     postStatus: newStatus,
    //     message: 'Đánh giá bài viết thành công (Mock)',
    //   });
    // }

    const { data } = await apiClient.post<ReviewPostResponse>(
      `/review/posts/${postId}/reviews`,
      payload
    );
    return data;
  },

  async getPostHistory(params?: PaginationParams): Promise<PageResponse<GreenActionPostDetailDto>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const historyPosts = MOCK_POSTS.filter((p) => p.authorDisplayName === 'Nhã Uyên');
    //   return mockSuccess({
    //     content: historyPosts,
    //     totalElements: historyPosts.length,
    //     page: params?.page ?? 1,
    //     size: params?.size ?? 10,
    //     has_next: false,
    //     totalPages: Math.ceil(historyPosts.length / (params?.size ?? 10)),
    //   });
    // }
    const { data } = await apiClient.get<PageResponse<GreenActionPostDetailDto>>(
      '/green-action/posts/me/history',
      {
        params,
      }
    );
    return data;
  },
};

// ============================================================
// POINT WALLET SERVICE
// ============================================================
export const walletService = {
  async getMyWallet(): Promise<PointWallet> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   return MOCK_POINT_WALLET;
    // }
    const { data } = await apiClient.get<PointWallet>('/green-action/points/me');
    return data;
  },

  async getMyPointHistory(params?: PaginationParams): Promise<PageResponse<PointHistoryEntry>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const pageSize = params?.size ?? 100;
    //   const pageIndex = params?.page ?? 1;
    //   const start = (pageIndex - 1) * pageSize;
    //   const historyItems = MOCK_LEDGER.slice(start, start + pageSize);
    //   return mockSuccess({
    //     content: historyItems,
    //     totalElements: MOCK_LEDGER.length,
    //     page: pageIndex,
    //     size: pageSize,
    //     totalPages: Math.ceil(MOCK_LEDGER.length / pageSize),
    //   });
    // }
    const { data } = await apiClient.get<PageResponse<PointHistoryEntry>>(
      '/green-action/points/me/history',
      { params }
    );
    return data;
  },
};

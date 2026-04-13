import { apiClient } from 'lib/apiClient';
import type {
  GreenActionType,
  GreenActionPost,
  CreatePostRequest,
  PointWallet,
  PointLedgerEntry,
} from 'types/action.types';
import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import { MOCK_ACTION_TYPES, MOCK_POSTS, MOCK_POINT_WALLET, MOCK_LEDGER } from './mock/action.mock';
import {
  ApiResponse,
  FeedQueryParams,
  PaginatedResponse,
  PaginationParams,
} from 'types/common.types';

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
  ): Promise<ApiResponse<PaginatedResponse<GreenActionPost>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);

      // 1. Lấy toàn bộ data gốc
      let filteredPosts = [...MOCK_POSTS];

      // 2. Xử lý Lọc theo Từ khóa (Search)
      if (params?.search) {
        const lowerSearch = params.search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.caption.toLowerCase().includes(lowerSearch) ||
            (post.user_display_name && post.user_display_name.toLowerCase().includes(lowerSearch))
        );
      }

      // 3. Xử lý Lọc theo Loại hành động
      if (params?.action_type_id && params.action_type_id !== 'all') {
        filteredPosts = filteredPosts.filter(
          (post) => post.action_type_id === params.action_type_id
        );
      }

      // 4. Xử lý Lọc theo Thời gian
      if (params?.time && params.time !== 'all') {
        const now = new Date();
        filteredPosts = filteredPosts.filter((post) => {
          const postDate = new Date(post.created_at);
          const diffTime = Math.abs(now.getTime() - postDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (params.time === 'week') return diffDays <= 7;
          if (params.time === 'month') return diffDays <= 30;
          return true;
        });
      }

      // 5. Xử lý Sắp xếp (Sort)
      if (params?.sort === 'popular') {
        // Nổi bật: Nhiều like nhất xếp trên
        filteredPosts.sort((a, b) => b.approve_count - a.approve_count);
      } else {
        // Mặc định (newest): Mới nhất xếp trên
        filteredPosts.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      // 6. Xử lý Phân trang (Pagination)
      const page = params?.page ?? 1;
      const pageSize = params?.page_size ?? 10;
      const start = (page - 1) * pageSize;
      const paginatedPosts = filteredPosts.slice(start, start + pageSize);

      return mockSuccess({
        items: paginatedPosts,
        total: filteredPosts.length,
        page: page,
        page_size: pageSize,
        has_next: start + pageSize < filteredPosts.length,
      });
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<GreenActionPost>>>(
      '/posts/feed',
      { params }
    );
    return data;
  },

  async getMyPosts(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<GreenActionPost>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const myPosts = MOCK_POSTS.filter((p) => p.user_id === 'usr-001');
      return mockSuccess({
        items: myPosts,
        total: myPosts.length,
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        has_next: false,
      });
    }
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<GreenActionPost>>>(
      '/posts/me',
      { params }
    );
    return data;
  },

  async createPost(payload: CreatePostRequest): Promise<ApiResponse<GreenActionPost>> {
    if (IS_MOCK_MODE) {
      await mockDelay(900);
      const actionType = MOCK_ACTION_TYPES.find((a) => a.id === payload.action_type_id);
      const newPost: GreenActionPost = {
        id: `post-${Date.now()}`,
        user_id: 'usr-001',
        status: 'PENDING_REVIEW',
        approve_count: 0,
        reject_count: 0,
        created_at: new Date().toISOString(),
        action_type: actionType,
        user_display_name: 'Nhã Uyên',
        user_avatar_url: 'https://i.redd.it/ya8qikz9kn0f1.png',
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        ...payload,
      };
      return mockSuccess(newPost);
    }
    const { data } = await apiClient.post<ApiResponse<GreenActionPost>>('/posts', payload);
    return data;
  },
};

// ============================================================
// POINT WALLET SERVICE
// ============================================================
export const walletService = {
  async getMyWallet(): Promise<ApiResponse<PointWallet>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_POINT_WALLET);
    }
    const { data } = await apiClient.get<ApiResponse<PointWallet>>('/wallet/me');
    return data;
  },

  async getLedger(
    params?: PaginationParams & { time?: string[]; source_type?: string[] }
  ): Promise<ApiResponse<PaginatedResponse<PointLedgerEntry>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        items: MOCK_LEDGER,
        total: MOCK_LEDGER.length,
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 20,
        has_next: false,
      });
    }
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<PointLedgerEntry>>>(
      '/wallet/ledger',
      { params }
    );
    return data;
  },
};

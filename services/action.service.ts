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
import { ApiResponse, PaginatedResponse, PaginationParams } from 'types/common.types';

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
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<GreenActionPost>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      return mockSuccess({
        items: MOCK_POSTS,
        total: MOCK_POSTS.length,
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        has_next: false,
      });
    }
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<GreenActionPost>>>(
      '/posts/feed',
      { params },
    );
    return data;
  },

  async getMyPosts(
    params?: PaginationParams,
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
      { params },
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
        user_avatar_url: 'https://i.pravatar.cc/150?img=47',
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
    params?: PaginationParams,
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
      { params },
    );
    return data;
  },
};
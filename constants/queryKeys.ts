import { LeaderboardScope } from 'types/gamification.types';

/**
 * Query Key Factory — dùng factory pattern thay vì string constants.
 *
 * Lợi ích:
 * - Tự động invalidate đúng scope (vd: invalidate toàn bộ 'posts' khi tạo post mới)
 * - Type-safe, không lo typo
 * - Dễ mở rộng khi thêm filter/pagination
 *
 * Cách dùng:
 *   queryKey: QUERY_KEYS.posts.feed()
 *   queryKey: QUERY_KEYS.posts.detail(postId)
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all })
 */
export const QUERY_KEYS = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => ['auth', 'me'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    list: (params?: object) => ['users', 'list', params] as const,
    detail: (userId: string) => ['users', userId] as const,
  },

  // Posts
  posts: {
    all: ['posts'] as const,
    feed: (params?: object) => ['posts', 'feed', params] as const,
    mine: (params?: object) => ['posts', 'me', params] as const,
    detail: (postId: string) => ['posts', postId] as const,
    reviews: (postId: string) => ['posts', postId, 'reviews'] as const,
    pendingReview: (params?: object) => ['posts', 'pending-review', params] as const,
  },

  // Action types (master data — stale lâu hơn)
  actionTypes: {
    all: ['action-types'] as const,
  },

  // Wallet & points
  wallet: {
    all: ['wallet'] as const,
    mine: () => ['wallet', 'me'] as const,
    ledger: (params?: object) => ['wallet', 'ledger', params] as const,
  },

  // Gamification
  streak: {
    mine: () => ['streak', 'me'] as const,
  },
  garden: {
    all: ['garden'] as const,
    active: () => ['garden', 'active'] as const,
    archives: () => ['garden', 'archives'] as const,
    seeds: () => ['garden', 'seeds'] as const,
    dailyLogs: (params?: object) => ['garden', 'daily-logs', params] as const,
  },

  // Vouchers
  vouchers: {
    all: ['vouchers'] as const,
    available: () => ['vouchers', 'available'] as const,
    mine: () => ['vouchers', 'me'] as const,
  },

  // Leaderboard
  leaderboard: {
    all: ['leaderboard'] as const,
    scope: (scope: LeaderboardScope, province?: string) =>
      ['leaderboard', scope, province] as const,
    claim: (periodId: string) => ['leaderboard', 'claim', periodId] as const,
  },

  // Events
  events: {
    all: ['events'] as const,
    list: (params?: object) => ['events', 'list', params] as const,
    ngoList: (params?: object) => ['events', 'ngo-list', params] as const,
    detail: (eventId: string) => ['events', eventId] as const,
    myRegistrations: () => ['events', 'registrations', 'me'] as const,
  },

  // Map
  stations: {
    all: ['stations'] as const,
  },

  // Community
  trashReports: {
    all: ['trash-reports'] as const,
    list: (params?: object) => ['trash-reports', 'list', params] as const,
  },

  // Location
  location: {
    provinces: () => ['location', 'provinces'] as const,
    wards: (provinceCode: string) => ['location', 'wards', provinceCode] as const,
  },
} as const;

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
    history: (params?: object) => ['posts', 'history', params] as const,
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
    mine: (params?: object) => ['vouchers', 'me', params] as const,
    bySeed: (seedId: string) => ['vouchers', 'by-seed', seedId] as const,
  },

  // Leaderboard
  leaderboard: {
    all: ['leaderboard'] as const,
    scope: (scope: LeaderboardScope, weekStartDate: string, province?: string) =>
      ['leaderboard', scope, weekStartDate, province] as const,
    weeklyPrizes: (weekStartDate: string) =>
      ['leaderboard', 'weekly-prizes', weekStartDate] as const,
    claim: (periodId: string) => ['leaderboard', 'claim', periodId] as const,
  },

  // Events
  events: {
    all: ['events'] as const,
    list: (params?: object) => ['events', 'list', params] as const,
    publicList: (params?: object) => ['events', 'public-list', params] as const,
    ngoList: (ngoId: string, params?: object) => ['events', 'ngo-list', ngoId, params] as const,
    myNgoList: (params?: object) => ['events', 'my-ngo-list', params] as const,
    detail: (eventId: string) => ['events', eventId] as const,
    myRegistrations: (userId: string, params?: object) =>
      ['events', 'registrations', userId, params] as const,
    participationSummary: () => ['events', 'participation-summary'] as const,
  },

  // Map
  stations: {
    all: ['stations'] as const,
    list: (wasteTypeID?: string) => ['stations', 'list', { wasteTypeID }] as const,
    wasteTypes: () => ['stations', 'waste-types'] as const,
  },

  // Community
  trashSpots: {
    all: ['trash-spots'] as const,
    list: (params?: object) => ['trash-spots', 'list', params] as const,
    detail: (trashSpotId: string) => ['trash-spots', 'detail', trashSpotId] as const,
  },

  // Location
  location: {
    provinces: () => ['location', 'provinces'] as const,
    wards: (provinceCode: string) => ['location', 'wards', provinceCode] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    me: (params?: object) => ['notifications', 'me', params] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },
} as const;

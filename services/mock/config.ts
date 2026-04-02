/**
 * Flip biến này để chuyển giữa mock và real API.
 * Khi BE ready: đổi thành false (hoặc dùng env var).
 */
export const IS_MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE !== 'false';

/**
 * Giả lập network delay để mock trông thực tế hơn.
 * Giúp detect loading state bugs sớm.
 */
export const mockDelay = (ms = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wrap mock data trong ApiResponse shape chuẩn.
 */
export function mockSuccess<T>(data: T) {
  return { success: true as const, data };
}

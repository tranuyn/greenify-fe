// ============================================================
// SHARED / COMMON TYPES
// ============================================================

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Standard paginated list response.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

/**
 * Generic API error shape.
 */
export interface ApiError {
  success: false;
  message: string;
  error_code?: string; // e.g. "OTP_EXPIRED", "INSUFFICIENT_POINTS"
}

/**
 * Pagination query params — dùng chung cho mọi list API.
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}
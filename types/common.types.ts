import { SortOption } from "@/constants/enums/sortOptions.enum";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Standard paginated list response
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  error_code?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}
export interface DateRangeParams {
  fromDate?: string; // ISO 8601: YYYY-MM-DD
  toDate?: string;
}
export interface SortParams<T = string> {
  sort?: T; 
}
export interface BaseQueryParams extends PaginationParams, DateRangeParams {}

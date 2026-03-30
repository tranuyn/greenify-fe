export type UserRole = 'USER' | 'CTV' | 'NGO' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'FLAGGED';
export type CtvStatus =
  | 'NOT_ELIGIBLE'
  | 'ELIGIBLE'
  | 'PENDING_UPGRADE'
  | 'ACTIVE_CTV'
  | 'DOWNGRADED';

export interface User {
  id: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  ctv_status: CtvStatus;
  created_at: string;
}

export interface CreateUserInput {
  phone: string;
  email: string;
  password: string;
  role?: UserRole;
}

export type UpdateUserInput = Partial<Pick<User, 'phone' | 'status' | 'ctv_status'>>;

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

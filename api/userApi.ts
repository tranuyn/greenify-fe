import { API_ROUTES } from 'constants/apiRoutes';
import { axiosClient } from './axiosClient';
import { User } from 'types/user.type';
import { ApiResponse, PaginatedResponse } from '@/types/common.types';

export const userApi = {
  getUsers: async (): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await axiosClient.get(API_ROUTES.USERS.LIST);
    return response.data;
  },

  // Lấy chi tiết (Route động, truyền ID vào hàm)
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get(API_ROUTES.USERS.DETAIL(userId));
    return response.data;
  },
  createUser: async (userData: { name: string; email: string }): Promise<ApiResponse<User>> => {
    const response = await axiosClient.post(API_ROUTES.USERS.LIST, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete(API_ROUTES.USERS.DELETE(userId));
    return response.data;
  },
};

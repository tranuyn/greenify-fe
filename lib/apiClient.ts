import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Constants ----
const BASE_URL = 'https://greenify.io.vn/api/v1';
const ACCESS_TOKEN_KEY = 'auth.access_token';
const REFRESH_TOKEN_KEY = 'auth.refresh_token';

// ---- Token helpers ----
export const tokenStorage = {
  getAccess: () => AsyncStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => AsyncStorage.getItem(REFRESH_TOKEN_KEY),
  setAccess: (token: string) => AsyncStorage.setItem(ACCESS_TOKEN_KEY, token),
  setRefresh: (token: string) => AsyncStorage.setItem(REFRESH_TOKEN_KEY, token),
  clear: () => AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]),
};

// ---- Axios instance ----
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const logApiError = (clientName: 'apiClient' | 'publicApiClient', error: AxiosError) => {
  const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
  const url = error.config?.url ?? 'UNKNOWN_URL';
  const status = error.response?.status ?? 'NO_STATUS';
  const responseData = error.response?.data;

  console.error(
    `[${clientName}] ${method} ${url} failed with status ${status}`,
    responseData ?? error.message
  );
};

// ---- Request interceptor: attach Bearer token ----
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: handle 401 → refresh ----
let isRefreshing = false;
// Queue of callbacks waiting for the new token
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 and don't retry the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      logApiError('apiClient', error);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefresh();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refresh_token: refreshToken,
      });

      const newAccessToken: string = data.data.access_token;
      await tokenStorage.setAccess(newAccessToken);

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError)) {
        logApiError('apiClient', refreshError);
      } else {
        console.error('[apiClient] Refresh token failed', refreshError);
      }
      processQueue(refreshError, null);
      // Clear tokens → user sẽ bị redirect về login (handle ở auth store)
      await tokenStorage.clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

publicApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    logApiError('publicApiClient', error);
    return Promise.reject(error);
  }
);

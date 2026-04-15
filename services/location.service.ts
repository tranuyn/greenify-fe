import { apiClient } from 'lib/apiClient';
import type { ApiResponse } from 'types/common.types';
import type { Province, Ward } from 'types/location.types';
import { IS_MOCK_MODE, mockDelay, mockSuccess } from './mock/config';
import { MOCK_PROVINCES, MOCK_WARDS } from './mock/location.mock';

export const locationService = {
  async getProvinces(): Promise<ApiResponse<Province[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      return mockSuccess(MOCK_PROVINCES);
    }
    const { data } = await apiClient.get<ApiResponse<Province[]>>('/locations/provinces');
    return data;
  },

  async getWards(provinceCode: string): Promise<ApiResponse<Ward[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(250);
      const filtered = MOCK_WARDS.filter((w) => w.province_code === provinceCode);
      return mockSuccess(filtered);
    }
    const { data } = await apiClient.get<ApiResponse<Ward[]>>(`/locations/wards/${provinceCode}`);
    return data;
  },
};

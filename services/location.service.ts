import { apiClient } from 'lib/apiClient';
import type { Province, Ward } from 'types/location.types';

export const locationService = {
  async getProvinces(): Promise<Province[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(300);
    //   return mockSuccess(MOCK_PROVINCES);
    // }
    const { data } = await apiClient.get<Province[]>('/api/v1/divisions/provinces');
    return data;
  },

  async getWards(provinceCode: string): Promise<Ward[]> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(250);
    //   const filtered = MOCK_WARDS.filter((w) => w.province_code === provinceCode);
    //   return mockSuccess(filtered);
    // }
    const { data } = await apiClient.get<Ward[]>(
      `/api/v1/divisions/provinces/${provinceCode}/wards`
    );
    return data;
  },
};

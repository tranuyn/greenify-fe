import type { Province, Ward } from '../../types/location.types';

export const MOCK_PROVINCES: Province[] = [
  { code: '01', name: 'Hà Nội' },
  { code: '79', name: 'TP. Hồ Chí Minh' },
  { code: '48', name: 'Đà Nẵng' },
  { code: '31', name: 'Hải Phòng' },
  { code: '92', name: 'Cần Thơ' },
  { code: '46', name: 'Thừa Thiên Huế' },
  { code: '56', name: 'Khánh Hòa' },
  { code: '74', name: 'Bình Dương' },
  { code: '75', name: 'Đồng Nai' },
  { code: '77', name: 'Bà Rịa - Vũng Tàu' },
];

export const MOCK_WARDS: Ward[] = [
  // TP. Hồ Chí Minh
  { code: '26734', name: 'Phường Bến Nghé', province_code: '79' },
  { code: '26737', name: 'Phường Bến Thành', province_code: '79' },
  { code: '26740', name: 'Phường Cầu Ông Lãnh', province_code: '79' },
  { code: '26869', name: 'Phường 1 (Bình Thạnh)', province_code: '79' },
  { code: '26872', name: 'Phường 2 (Bình Thạnh)', province_code: '79' },
  // Hà Nội
  { code: '00001', name: 'Phường Hàng Bạc', province_code: '01' },
  { code: '00004', name: 'Phường Hàng Bồ', province_code: '01' },
  { code: '00007', name: 'Phường Hàng Đào', province_code: '01' },
];

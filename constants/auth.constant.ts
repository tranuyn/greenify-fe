export type AccountRole = 'organization' | 'citizen';

export const ACCOUNT_ROLE_OPTIONS: {
  role: AccountRole;
  title: string;
  description: string;
}[] = [
  {
    role: 'organization',
    title: 'Tổ chức',
    description: 'Dành cho doanh nghiệp, CLB và đơn vị vận hành sự kiện xanh.',
  },
  {
    role: 'citizen',
    title: 'Công dân xanh',
    description: 'Dành cho cá nhân tham gia thử thách và hoạt động cộng đồng.',
  },
];

export const CITY_OPTIONS = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Nha Trang',
] as const;

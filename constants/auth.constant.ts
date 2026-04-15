export const ACCOUNT_ROLE_OPTIONS = [
  {
    role: 'organization',
    title: 'Tổ chức / NGO',
    description: 'Dành cho các tổ chức môi trường, câu lạc bộ muốn tạo và quản lý sự kiện xanh.',
    // description: 'Dành cho doanh nghiệp, CLB và đơn vị vận hành sự kiện xanh.',
  },
  {
    role: 'citizen',
    title: 'Công dân xanh',
    description: 'Dành cho cá nhân muốn ghi nhận hành động xanh và tham gia cộng đồng.',
    // description: 'Dành cho cá nhân tham gia thử thách và hoạt động cộng đồng.',
  },
] as const;

export type AccountRole = (typeof ACCOUNT_ROLE_OPTIONS)[number]['role'];

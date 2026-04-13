import {
  Streak,
  Seed,
  PlantProgress,
  GardenArchive,
  VoucherTemplate,
  UserVoucher,
  LeaderboardEntry,
  LeaderboardScope,
} from 'types/gamification.types';
import { MOCK_USER_PROFILE } from './user.mock';

// ---- Streak ----

export const MOCK_STREAK: Streak = {
  id: 'streak-001',
  user_id: 'usr-001',
  current_streak: 7,
  longest_streak: 14,
  last_valid_date: '2026-03-30',
  status: 'ACTIVE',
  restore_used_this_month: 1,
  restore_month: '2026-03-01',
  last_break_date: '2026-03-10',
  broken_streak: 5,
  updated_at: '2026-03-30T09:20:00Z',
};

// ---- Seeds & Garden ----

export const MOCK_SEEDS: Seed[] = [
  {
    id: 'seed-001',
    name: 'Cây Xương Rồng',
    image_url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200',
    days_to_mature: 7,
    reward_voucher_template_id: 'vt-002',
    is_active: true,
  },
  {
    id: 'seed-002',
    name: 'Cây Bạc Hà',
    image_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=200',
    days_to_mature: 14,
    reward_voucher_template_id: 'vt-003',
    is_active: true,
  },
  {
    id: 'seed-003',
    name: 'Cây Tre',
    image_url: 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=200',
    days_to_mature: 30,
    reward_voucher_template_id: 'vt-001',
    is_active: true,
  },
];

export const MOCK_PLANT_PROGRESS: PlantProgress = {
  id: 'plant-001',
  user_id: 'usr-001',
  seed_id: 'seed-001',
  progress_days: 7,
  status: 'GROWING',
  started_at: '2026-03-24T00:00:00Z',
  matured_at: null,
  seed: MOCK_SEEDS[0],
};

export const MOCK_GARDEN_ARCHIVES: GardenArchive[] = [
  {
    id: 'garden-001',
    user_id: 'usr-001',
    seed_id: 'seed-003',
    plant_progress_id: 'plant-000',
    days_taken: 30,
    reward_status: 'REWARDED',
    user_voucher_id: 'uvoucher-001',
    archived_at: '2026-02-28T00:00:00Z',
    seed: MOCK_SEEDS[2],
  },
];

// ---- Vouchers ----

export const MOCK_VOUCHER_TEMPLATES: VoucherTemplate[] = [
  {
    id: 'vt-001',
    name: 'Giảm 20% Xanh SM',
    partner_name: 'Xanh SM',
    partner_logo_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Xanh_SM_logo.svg/1280px-Xanh_SM_logo.svg.png',
    thumbnail_url:
      'https://cafefcdn.com/zoom/700_438/203337114487263232/2023/12/6/xanh-sm-emag-cover-mobi-08-1701855466110670966778.jpg',
    description: 'Giảm 20% cho chuyến đi xe điện Xanh SM. Áp dụng toàn quốc.',
    required_points: 100,
    total_stock: 500,
    remaining_stock: 247,
    usage_conditions: 'Áp dụng cho chuyến đi từ 20.000đ trở lên. Không áp dụng cùng CTKM khác.',
    valid_until: '2026-06-30T23:59:59Z',
    status: 'ACTIVE',
  },
  {
    id: 'vt-002',
    name: 'Voucher Cocoon 50.000đ',
    partner_name: 'Cocoon Vietnam',
    partner_logo_url: 'https://moonchicorder.com.vn/wp-content/uploads/2024/09/Cocoon.png',
    thumbnail_url: 'https://channel.mediacdn.vn/2020/1/7/photo-1-15783942747491282238021.jpg',
    description: 'Voucher mua sản phẩm Cocoon trị giá 50.000đ.',
    required_points: 50,
    total_stock: 200,
    remaining_stock: 89,
    usage_conditions: 'Đơn hàng tối thiểu 200.000đ. Chỉ áp dụng trên website cocoonvietnam.com.',
    valid_until: '2026-05-31T23:59:59Z',
    status: 'ACTIVE',
  },
  {
    id: 'vt-003',
    name: 'Đồ uống miễn phí – The Coffee House',
    partner_name: 'The Coffee House',
    partner_logo_url:
      'https://play-lh.googleusercontent.com/qWEv8qR8KmXHh9JHwOeWl0aqV50co9Wqw1gVZXJ2Fqrd0oIRM199Enbcc7McoZo_7w4qYPcRzaFi_IQ8rDVC',
    thumbnail_url: 'https://upload.urbox.vn/strapi/Gallery_The_Coffee_House_2_46dac27aac.jpg',
    description: 'Đổi voucher lấy 1 ly đồ uống size M khi mang ly cá nhân.',
    required_points: 75,
    total_stock: 1000,
    remaining_stock: 412,
    usage_conditions: 'Áp dụng tại tất cả cơ sở The Coffee House. Mang ly cá nhân để nhận.',
    valid_until: '2026-12-31T23:59:59Z',
    status: 'ACTIVE',
  },
  {
    id: 'vt-004',
    name: 'Giảm 70% giá trị hóa đơn',
    partner_name: 'Highland',
    partner_logo_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Highlands_Coffee_5G.svg/3840px-Highlands_Coffee_5G.svg.png', // Link mock logo
    thumbnail_url:
      'https://www.shutterstock.com/image-vector/elegant-gift-voucher-design-beauty-260nw-2628756281.jpg', // Link mock ảnh bìa
    description:
      'Giải thưởng dành cho Top 5: Giảm 70% giá trị hóa đơn khi mua hàng trực tiếp tại cửa hàng.',
    required_points: 200,
    total_stock: 5,
    remaining_stock: 5,
    usage_conditions:
      '- Áp dụng cho hóa đơn từ 100.000đ trở lên\n- Mỗi voucher chỉ sử dụng 1 lần / 1 hóa đơn\n- Không áp dụng đồng thời với các chương trình khuyến mãi khác\n- Không quy đổi thành tiền mặt\n- Chỉ áp dụng khi mua hàng trực tiếp tại cửa hàng\n- Voucher không được chuyển nhượng\n- Trong trường hợp có tranh chấp, quyết định từ hệ thống là cuối cùng',
    valid_until: '2026-01-01T23:59:59Z', // Lấy theo ngày ghi chú dưới dòng "Hết hạn sau"
    status: 'ACTIVE',
  },
];

export const MOCK_USER_VOUCHERS: UserVoucher[] = [
  {
    id: 'uvoucher-001',
    user_id: 'usr-001',
    voucher_template_id: 'vt-001',
    voucher_code: 'GREEN-XSM-A7K2',
    source: 'REDEEM',
    status: 'AVAILABLE',
    expires_at: '2026-06-30T23:59:59Z',
    used_at: null,
    created_at: '2026-03-25T14:00:00Z',
    template: MOCK_VOUCHER_TEMPLATES[0],
  },
  {
    id: 'uvoucher-002',
    user_id: 'usr-001',
    voucher_template_id: 'vt-003',
    voucher_code: 'GREEN-TCH-B3M9',
    source: 'GARDEN_REWARD',
    status: 'USED',
    expires_at: '2026-12-31T23:59:59Z',
    used_at: '2026-03-20T10:00:00Z',
    created_at: '2026-02-28T00:05:00Z',
    template: MOCK_VOUCHER_TEMPLATES[2],
  },
];

// ---- Leaderboard ----

export const MOCK_LEADERBOARD_NATIONAL: LeaderboardEntry[] = [
  {
    id: 'lb-001',
    period_id: 'per-001',
    user_id: 'usr-010',
    user_profiles: MOCK_USER_PROFILE,
    scope: LeaderboardScope.NATIONAL,
    province: null,
    rank: 1,
    weekly_points: 420,
    is_winner: true,
    reward_status: 'REWARDED',
    status: 'PUBLISHED',
    display_name: 'Hoàng Minh',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'lb-002',
    period_id: 'per-001',
    user_id: 'usr-011',
    user_profiles: MOCK_USER_PROFILE,
    scope: LeaderboardScope.NATIONAL,
    province: null,
    rank: 2,
    weekly_points: 380,
    is_winner: true,
    reward_status: 'REWARDED',
    status: 'PUBLISHED',
    display_name: 'Thu Hà',
    avatar_url: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: 'lb-003',
    period_id: 'per-001',
    user_id: 'usr-012',
    user_profiles: MOCK_USER_PROFILE,
    scope: LeaderboardScope.NATIONAL,
    province: null,
    rank: 3,
    weekly_points: 310,
    is_winner: true,
    reward_status: 'REWARDED',
    status: 'PUBLISHED',
    display_name: 'Bảo Châu',
    avatar_url: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 'lb-004',
    period_id: 'per-001',
    user_id: 'usr-001',
    user_profiles: MOCK_USER_PROFILE,
    scope: LeaderboardScope.NATIONAL,
    province: null,
    rank: 4,
    weekly_points: 290,
    is_winner: false,
    reward_status: 'PENDING_REWARD',
    status: 'PUBLISHED',
    display_name: 'Nhã Uyên',
    avatar_url: 'https://i.redd.it/ya8qikz9kn0f1.png',
  },
  {
    id: 'lb-005',
    period_id: 'per-001',
    user_id: 'usr-013',
    user_profiles: MOCK_USER_PROFILE,
    scope: LeaderboardScope.NATIONAL,
    province: null,
    rank: 5,
    weekly_points: 275,
    is_winner: false,
    reward_status: 'PENDING_REWARD',
    status: 'PUBLISHED',
    display_name: 'Thanh Long',
    avatar_url: 'https://i.pravatar.cc/150?img=8',
  },
];

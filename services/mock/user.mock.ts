import { User, UserProfile, NgoProfile, AuthenticatedUser, LoginResponse } from 'types/user.type';

export const MOCK_USER: User = {
  id: 'usr-001',
  phone: '0901234567',
  email: 'uyen@greenify.vn',
  role: 'USER',
  status: 'ACTIVE',
  ctv_status: 'NOT_ELIGIBLE',
  created_at: '2026-01-10T08:00:00Z',
};

export const MOCK_CTV_USER: User = {
  id: 'usr-002',
  phone: '0912345678',
  email: 'ctv@greenify.vn',
  role: 'CTV',
  status: 'ACTIVE',
  ctv_status: 'ACTIVE_CTV',
  created_at: '2025-11-01T08:00:00Z',
};

export const MOCK_NGO_USER: User = {
  id: 'usr-003',
  phone: '0923456789',
  email: 'ngo@greenfuture.vn',
  role: 'NGO',
  status: 'ACTIVE',
  ctv_status: 'NOT_ELIGIBLE',
  created_at: '2025-09-15T08:00:00Z',
};

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'prof-001',
  user_id: 'usr-001',
  display_name: 'Nhã Uyên',
  avatar_url: 'https://i.redd.it/ya8qikz9kn0f1.png',
  province: 'TP. Hồ Chí Minh',
  // district: 'Quận 1',
  ward: 'Phường Bến Nghé',
  free_time_slots: [
    { day: 'SAT', from: '08:00', to: '12:00' },
    { day: 'SUN', from: '08:00', to: '17:00' },
  ],
};

export const MOCK_NGO_PROFILE: NgoProfile = {
  id: 'ngo-prof-001',
  user_id: 'usr-003',
  org_name: 'Green Future Vietnam',
  representative_name: 'Nguyễn Văn An',  
  avatar_url: 'https://mms.img.susercontent.com/e1bec8e5aeda4b7c25c84297aa780d3c',
  hotline: '1800 1234',
  contact_email: 'contact@greenfuture.vn',
  // address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  province: 'TP. Hồ Chí Minh',
  ward: 'Phường Bến Nghé',
  description: 'Tổ chức phi lợi nhuận hoạt động vì môi trường xanh tại Việt Nam.',
  verification_docs: ['https://s3.example.com/docs/greenfuture-license.pdf'],
  verify_status: 'VERIFIED',
  reject_reason: null,
};

export const MOCK_AUTH_RESPONSE: LoginResponse = {
  access_token: 'mock.access.token.eyJhbGciOiJIUzI1NiJ9',
  refresh_token: 'mock.refresh.token.eyJhbGciOiJIUzI1NiJ9',
  user: MOCK_USER,
  profile: MOCK_USER_PROFILE,
};

// export const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
//   user: MOCK_USER,
//   profile: MOCK_USER_PROFILE,
// };
export const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
  user: MOCK_NGO_USER,
  profile: MOCK_NGO_PROFILE,
};

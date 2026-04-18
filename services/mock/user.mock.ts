import { User, UserProfile, NgoProfile, AuthenticatedUser, LoginResponse } from 'types/user.type';

export const MOCK_USER: User = {
  id: 'usr-001',
  phone: '0901234567',
  email: 'uyen@greenify.vn',
  role: 'CTV',
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
  firstName: 'Nha',
  lastName: 'Uyen',
  displayName: 'Nhã Uyên',
  avatarUrl: 'https://i.redd.it/ya8qikz9kn0f1.png',
  avatarUrl: 'https://i.redd.it/ya8qikz9kn0f1.png',
  province: 'TP. Hồ Chí Minh',
  district: 'Quận 1',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé',
  addressDetail: '168 Nguyen Dinh Chieu',
  status: 'ACTIVE',
};

export const MOCK_NGO_PROFILE: NgoProfile = {
  id: 'ngo-prof-001',
  orgName: 'Green Future Vietnam',
  representativeName: 'Nguyễn Văn An',
  hotline: '1800 1234',
  contactEmail: 'contact@greenfuture.vn',
  description: 'Tổ chức phi lợi nhuận hoạt động vì môi trường xanh tại Việt Nam.',
  status: 'VERIFIED',
  rejectedReason: null,
  rejectedCount: 0,
  address: {
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '123 Nguyễn Huệ',
    latitude: 10.7769,
    longitude: 106.7009,
  },
  avatar: {
    bucketName: 'mock-bucket',
    objectKey: 'avatar/ngo-prof-001.jpg',
    imageUrl: 'https://mms.img.susercontent.com/e1bec8e5aeda4b7c25c84297aa780d3c',
  },
  verificationDocs: [
    {
      bucketName: 'mock-bucket',
      objectKey: 'docs/greenfuture-license.pdf',
      imageUrl: 'https://s3.example.com/docs/greenfuture-license.pdf',
    },
  ],
  createdAt: '2026-01-10T08:00:00Z',
  updatedAt: '2026-04-19T10:00:00Z',
};

export const MOCK_AUTH_RESPONSE: LoginResponse = {
  access_token: 'mock.access.token.eyJhbGciOiJIUzI1NiJ9',
  refresh_token: 'mock.refresh.token.eyJhbGciOiJIUzI1NiJ9',
};

export const MOCK_AUTHENTICATED_USER: AuthenticatedUser = {
  id: MOCK_NGO_USER.id,
  email: MOCK_NGO_USER.email,
  role: [MOCK_NGO_USER.role],
  phoneNumber: MOCK_NGO_USER.phone,
  username: MOCK_NGO_USER.email,
  userProfile: MOCK_USER_PROFILE,
  ngoProfile: MOCK_NGO_PROFILE,
};

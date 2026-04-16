// types/post.type.ts

import { GreenActionPost, GreenActionType } from './action.types';
import { UserProfile } from './user.type';

// Thông tin người đăng (thường join từ bảng user_profiles hoặc users)
// Dùng Pick lấy đúng 3 trường cần thiết từ UserProfile
export type PostAuthor = Pick<UserProfile, 'displayName' | 'avatar_url'> & {
  id: string; // Chuyển user_id thành id cho Frontend dễ gọi
};

// Thông tin loại hành động (từ bảng green_action_types)
export type ActionType = Pick<GreenActionType, 'id' | 'action_name'>;

// Data trả về cho 1 bài viết hoàn chỉnh (PostDTO)
export interface PostDTO extends Omit<
  GreenActionPost,
  'user_id' | 'action_type_id' | 'user_displayName' | 'user_avatar_url' | 'action_type'
> {
  user: PostAuthor;
  action_type: ActionType;
  location_name?: string;
}

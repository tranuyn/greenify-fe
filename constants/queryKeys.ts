export const QUERY_KEYS = {
  USERS: 'users',
  USER_DETAIL: (id: string) => ['user', id],
  POSTS: 'posts',
} as const;

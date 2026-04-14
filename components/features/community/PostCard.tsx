import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { getTimeAgo } from '@/utils/date.util';
import { GreenActionPost } from '@/types/action.types';
import { useAuthRole } from '@/hooks/queries/useAuth';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router/build/exports';

const Tag = ({ label }: { label: string }) => (
  <View className="mb-2 mr-3 self-start rounded-full border border-primary-900 px-4 py-1.5">
    <Text numberOfLines={1} className="font-inter-medium text-sm text-foreground">
      {label}
    </Text>
  </View>
);

// Status badge
const STATUS_CONFIG = {
  PENDING_REVIEW:     { label: 'Chờ duyệt',   bg: 'bg-amber-50',  text: 'text-amber-600' },
  PARTIALLY_APPROVED: { label: 'Đang xét',     bg: 'bg-blue-50',   text: 'text-blue-600' },
  VERIFIED:           { label: 'Đã duyệt',     bg: 'bg-primary-50',text: 'text-primary-700' },
  REJECTED:           { label: 'Từ chối',      bg: 'bg-rose-50',   text: 'text-rose-500' },
  FLAGGED:            { label: 'Gắn cờ',       bg: 'bg-orange-50', text: 'text-orange-600' },
  REVOKED:            { label: 'Thu hồi',      bg: 'bg-gray-100',  text: 'text-gray-500' },
  DRAFT:              { label: 'Nháp',         bg: 'bg-gray-100',  text: 'text-gray-500' },
} as const;

export function PostCard({ post }: { post: GreenActionPost }) {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const { isCtv } = useAuthRole();

  const statusCfg = STATUS_CONFIG[post.status as keyof typeof STATUS_CONFIG];


  return (
    <View className="mb-8 mt-6 rounded-xl bg-background p-2 shadow-sm shadow-black/50">
      <View className="mb-4 flex-row items-center">
        {post.user_avatar_url ? (
          <Image
            source={{ uri: post.user_avatar_url }}
            className="mr-3 h-14 w-14 rounded-full border border-primary"
          />
        ) : (
          <View className="mr-3 h-14 w-14 items-center justify-center rounded-full border border-primary bg-primary-50">
            <FontAwesome6 name="tree" size={24} color={colors.primary} />
          </View>
        )}

        <View>
          <Text className="font-inter-medium text-lg text-foreground">
            {post.user_display_name || 'Người dùng ẩn danh'}
          </Text>
          <Text className="text-foreground/60 mt-0.5 font-inter text-sm">
            {getTimeAgo(post.created_at)}
          </Text>
        </View>

        {isCtv && statusCfg && (
          <View className={`rounded-full px-3 py-1 ${statusCfg.bg}`}>
            <Text className={`font-inter-semibold text-xs ${statusCfg.text}`}>
              {statusCfg.label}
            </Text>
          </View>
        )}
      </View>

      <View className="relative h-[320px] w-full overflow-hidden rounded-[32px] border-2 border-primary">
        <Image source={{ uri: post.media_url }} className="h-full w-full" resizeMode="cover" />
        <View className="absolute bottom-4 left-4 flex-row items-center">
          <TouchableOpacity className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-primary-100 shadow-sm">
            <FontAwesome6 name="leaf" size={20} color={colors.primary800} />
          </TouchableOpacity>
          <View className="rounded-full bg-primary-100 px-4 py-2 shadow-sm">
            <Text className="font-inter-medium text-primary-800">
              {post.approve_count} Lượt duyệt
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap">
        <Tag label={t('community.tags.greenDaily', 'Sống xanh mỗi ngày')} />
        {post.action_type && <Tag label={post.action_type.action_name} />}
      </View>

      <View className="mt-2 rounded-2xl bg-primary-50 p-4">
        <Text className="font-inter text-base leading-relaxed text-primary-800">
          {post.caption}
        </Text>
      </View>

      {isCtv && (
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: '/(community)/post-detail', params: { id: post.id } })
          }
          className="mt-3 flex-row items-center justify-center rounded-2xl border border-primary-200 py-3 active:opacity-80"
        >
          <Feather name="eye" size={16} color={colors.primary700} />
          <Text className="ml-2 font-inter-semibold text-sm text-primary-700">
            Xem chi tiết & Duyệt bài
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

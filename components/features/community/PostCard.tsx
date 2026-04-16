import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { getTimeAgo } from '@/utils/date.util';
import { GreenActionPost, PostStatus } from '@/types/action.types';
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

type PostStatusConfig = {
  labelKey: string;
  bgClass: string;
  textClass: string;
};

// Status badge
const STATUS_CONFIG: Record<PostStatus, PostStatusConfig> = {
  PENDING_REVIEW: {
    labelKey: 'community.post_status.pending_review',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
  },
  PARTIALLY_APPROVED: {
    labelKey: 'community.post_status.partially_approved',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
  },
  VERIFIED: {
    labelKey: 'community.post_status.verified',
    bgClass: 'bg-primary-50',
    textClass: 'text-primary-700',
  },
  REJECTED: {
    labelKey: 'community.post_status.rejected',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
  },
  FLAGGED: {
    labelKey: 'community.post_status.flagged',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
  },
  REVOKED: {
    labelKey: 'community.post_status.revoked',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
  },
  DRAFT: {
    labelKey: 'community.post_status.draft',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
  },
};

export function PostCard({ post }: { post: GreenActionPost }) {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const { isCtv } = useAuthRole();

  const statusCfg = STATUS_CONFIG[post.status as PostStatus];

  return (
    <View className="mb-8 mt-6 rounded-xl bg-card p-2 shadow-sm shadow-black/50">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
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
              {post.user_displayName ||
                t('community.post_detail.anonymous_user', 'Người dùng ẩn danh')}
            </Text>
            <Text className="text-foreground/60 mt-0.5 font-inter text-sm">
              {getTimeAgo(post.created_at)}
            </Text>
          </View>
        </View>

        {isCtv && statusCfg && (
          <View className={`rounded-xl px-3 py-1 ${statusCfg.bgClass}`}>
            <Text
              useDefaultColor={false}
              className={`font-inter-semibold text-xs ${statusCfg.textClass}`}>
              {t(statusCfg.labelKey)}
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
              {t('community.post_card.approve_count', {
                count: post.approve_count,
                defaultValue: `${post.approve_count} Lượt duyệt`,
              })}
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
          className="mt-3 flex-row items-center justify-center rounded-2xl py-3 active:opacity-80">
          <Feather name="eye" size={16} color={colors.primary700} />
          <Text className="ml-2 font-inter-semibold text-sm text-primary-700">
            {t('community.post_card.view_detail', 'Xem chi tiết & Duyệt bài')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

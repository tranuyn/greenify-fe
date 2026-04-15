import { View, Image } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { GreenActionPost } from '@/types/action.types';

type Props = {
  item: GreenActionPost;
};

/**
 * FeedPostMiniCard — Card nhỏ gọn cho preview feed trên Home.
 * Hiển thị: avatar, tên người đăng, loại hành động, caption ngắn, ảnh nhỏ.
 */
export function FeedPostMiniCard({ item }: Props) {
  const colors = useThemeColor();

  return (
    <View className="mb-3 flex-row rounded-2xl bg-background p-3.5 shadow-sm shadow-black/70 dark:bg-card">
      {/* Avatar */}
      <View className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-primary-100">
        {item.user_avatar_url ? (
          <Image
            source={{ uri: item.user_avatar_url }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary-200">
            <Text className="font-inter-bold text-sm text-primary-800">
              {(item.user_display_name ?? '?')[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Name + Action Type */}
        <View className="mb-1 flex-row items-center">
          <Text className="mr-2 font-inter-semibold text-[13px] text-foreground">
            {item.user_display_name ?? 'Ẩn danh'}
          </Text>
          {item.action_type && (
            <View className="rounded-md bg-primary-100 px-2 py-0.5 dark:bg-primary-900/40">
              <Text className="font-inter-medium text-[10px] text-primary-700 dark:text-primary-400">
                {item.action_type.action_name}
              </Text>
            </View>
          )}
        </View>

        {/* Caption */}
        <Text className="line-clamp-2 font-inter text-xs leading-[18px] text-foreground/70">
          {item.caption}
        </Text>
      </View>

      {/* Thumbnail */}
      {item.media_url && (
        <Image
          source={{ uri: item.media_url }}
          className="ml-3 h-14 w-14 rounded-xl bg-primary-50"
          resizeMode="cover"
        />
      )}
    </View>
  );
}

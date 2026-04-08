import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useFeedPosts } from '@/hooks/queries/usePosts';
import { FeedPostMiniCard } from './FeedPostMiniCard';

/**
 * CommunityFeedPreview — Hiển thị 3 bài post mới nhất trên Home.
 * Nhấn "Xem thêm" sẽ navigate sang tab Cộng đồng.
 */
export function CommunityFeedPreview() {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const router = useRouter();

  const { data: feedData, isLoading } = useFeedPosts({
    page: 1,
    page_size: 3,
  });

  const posts = feedData?.items ?? [];

  if (isLoading) {
    return (
      <View className="mx-5 h-[100px] items-center justify-center">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="mx-5 items-center justify-center py-8">
        <Text className="font-inter text-sm text-foreground/50">
          {t('home.feed_empty')}
        </Text>
      </View>
    );
  }

  return (
    <View className="px-5">
      {posts.map((post) => (
        <FeedPostMiniCard key={post.id} item={post} />
      ))}

      {/* View more button */}
      <TouchableOpacity
        className="mt-1 flex-row items-center justify-center rounded-2xl bg-primary-50 py-3 active:opacity-80 dark:bg-card"
        onPress={() => router.push('/(tabs)/community')}
      >
        <Text className="mr-1.5 font-inter-semibold text-sm text-primary-700 dark:text-primary-400">
          {t('home.btn_view_more')}
        </Text>
        <Feather name="arrow-right" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

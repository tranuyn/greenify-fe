import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from 'components/ui/Text';
import { useThemeColor } from 'hooks/useThemeColor.hook';

// Icons
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Hooks & Types
import { useFeedPosts } from 'hooks/queries/usePosts';
import { GreenActionPost } from 'types/action.types'; // Lấy đúng Type từ DB của BE trả về

// -----------------------------------------------------------------
// UTILS: HÀM TÍNH THỜI GIAN "X NGÀY TRƯỚC" CỰC XỊN
// -----------------------------------------------------------------
const getTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN'); // Quá 30 ngày thì hiện ngày tháng
};

// -----------------------------------------------------------------
// COMPONENTS PHỤ
// -----------------------------------------------------------------
const Tag = ({ label }: { label: string }) => (
  <View className="border border-primary-900 px-4 py-1.5 rounded-full mr-3 mb-2 self-start">
    <Text numberOfLines={1} className="text-foreground font-inter-medium text-sm">{label}</Text>
  </View>
);

// Sửa lại PostCard để nhận dữ liệu chuẩn từ API: GreenActionPost
const PostCard = ({ post }: { post: GreenActionPost }) => {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  return (
    <View className="mt-6 mb-8">
      <View className="flex-row items-center mb-4">
        {post.user_avatar_url ? (
          <Image 
            source={{ uri: post.user_avatar_url }} 
            className="w-14 h-14 rounded-full border border-primary mr-3"
          />
        ) : (
          <View className="w-14 h-14 rounded-full border border-primary bg-primary-50 items-center justify-center mr-3">
            <FontAwesome6 name="tree" size={24} color={colors.primary} />
          </View>
        )}
        
        <View>
          <Text className="text-foreground font-inter-medium text-lg">
            {post.user_display_name || 'Người dùng ẩn danh'}
          </Text>
          <Text className="text-foreground/60 font-inter text-sm mt-0.5">
            {getTimeAgo(post.created_at)}
          </Text>
        </View>
      </View>

      <View className="relative w-full h-[320px] rounded-[32px] overflow-hidden border-2 border-primary">
        <Image 
          source={{ uri: post.media_url }}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute bottom-4 left-4 flex-row items-center">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-2 shadow-sm">
            <FontAwesome6 name="leaf" size={20} color={colors.primary800} />
          </TouchableOpacity>
          <View className="bg-primary-100 px-4 py-2 rounded-full shadow-sm">
            <Text className="text-primary-800 font-inter-medium">
              {post.approve_count} Lượt thích
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap">
        {/* {post.longitude && <Tag label={toString(post.longitude)} />} */}
        <Tag label={t('community.tags.greenDaily', 'Sống xanh mỗi ngày')} />
        {post.action_type && <Tag label={post.action_type.action_name} />}
      </View>

      <View className="bg-primary-50 p-4 rounded-2xl mt-2">
        <Text className="text-primary-800 font-inter text-base leading-relaxed">
          {post.caption}
        </Text>
      </View>
    </View>
  );
};

// -----------------------------------------------------------------
// MÀN HÌNH CHÍNH (Đã tích hợp API & Tối ưu hiệu năng)
// -----------------------------------------------------------------
export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  // Gọi API lấy bài viết
  const { data, isLoading, isError, refetch, isRefetching } = useFeedPosts({ page: 1, page_size: 10 });
  const posts = data?.items || [];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      <Text className="text-foreground font-inter-bold text-2xl px-6 mb-2">
        {t('community.title', 'Cộng đồng')}
      </Text>

      <View className="flex-1 px-6 pt-4">
        {/* Bộ lọc tìm kiếm (Giữ nguyên UI của bạn) */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-primary-50 rounded-full px-5 mr-3">
            <TextInput 
              placeholder={t('community.search', 'Tìm kiếm bài viết...')}
              placeholderTextColor={colors.primary800}
              className="flex-1 font-inter text-base text-primary-800 mr-2 h-12"
            />
            <Feather name="search" size={24} color={colors.primary800} />
          </View>
          <TouchableOpacity className="w-[48px] h-[48px] bg-primary-50 rounded-full items-center justify-center">
            <Feather name="filter" size={22} color={colors.primary800} />
          </TouchableOpacity>
        </View>

        {/* Quản lý các trạng thái: Loading, Error, và FlatList (Siêu mượt) */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-4 text-foreground/60 font-inter text-sm">Đang tải bảng tin...</Text>
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Feather name="alert-circle" size={40} color="#f87171" />
            <Text className="mt-4 text-foreground/80 font-inter text-center">Đã có lỗi xảy ra khi tải dữ liệu.</Text>
            <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-primary px-6 py-2 rounded-full">
              <Text className="text-white font-inter-medium">Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            // Tính năng Kéo xuống để làm mới cực xịn
            refreshControl={
              <RefreshControl 
                refreshing={isRefetching} 
                onRefresh={refetch} 
                tintColor={colors.primary} 
                colors={[colors.primary]} 
              />
            }
            // Màn hình trống nếu không có bài nào
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <FontAwesome6 name="seedling" size={48} color={colors.primary} />
                <Text className="mt-4 text-foreground/60 font-inter text-center">Chưa có hoạt động nào.{"\n"}Hãy là người đầu tiên gieo hạt!</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
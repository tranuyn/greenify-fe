import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

// UI Components
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/features/community/PostCard'; // Import từ file mới
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

// Hooks & Types
import { useFeedPosts, useActionTypes } from '@/hooks/queries/usePosts';

// Component phụ cho bộ lọc (Viết gọn tại đây vì nó phụ thuộc state của màn hình này)
const FilterChip = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mb-3 mr-3 rounded-full border px-4 py-2 ${
      isSelected ? 'border-primary-700 bg-primary-700' : 'border-primary-200 bg-transparent'
    }`}>
    <Text className={`font-inter-medium ${isSelected ? 'text-white' : 'text-foreground/70'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  // --- 1. STATE BỘ LỌC ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    actionTypeId: 'all',
    timeRange: 'all',
    sortBy: 'newest',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // --- 2. API CALLS ---
  const { data, isLoading, isError, refetch, isRefetching } = useFeedPosts({
    page: 1,
    page_size: 10,
    search: searchQuery,
    action_type_id: filters.actionTypeId !== 'all' ? filters.actionTypeId : undefined,
    sort: filters.sortBy,
    time: filters.timeRange,
  });
  const posts = data?.items || [];

  const { data: actionTypesData } = useActionTypes();
  const actionTypes = actionTypesData || []; // Đã FIX lỗi mảng items

  // --- 3. BOTTOM SHEET LOGIC ---
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  const openFilter = () => {
    Keyboard.dismiss();
    setTempFilters(filters);
    bottomSheetModalRef.current?.present();
  };

  const applyFilter = () => {
    setFilters(tempFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  const clearFilter = () => {
    const defaultFilters = { actionTypeId: 'all', timeRange: 'all', sortBy: 'newest' };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  // --- 4. RENDER UI ---
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      <Text className="mb-2 px-6 font-inter-bold text-2xl text-foreground">
        {t('community.title', 'Cộng đồng')}
      </Text>

      <View className="flex-1 px-6 pt-4">
        {/* HEADER: THANH TÌM KIẾM */}
        <View className="mb-4 flex-row items-center">
          <View className="mr-3 flex-1 flex-row items-center rounded-full bg-primary-50 px-5">
            <TextInput
              placeholder={t('community.search', 'Tìm kiếm bài viết...')}
              placeholderTextColor={colors.primary800}
              className="mr-2 h-12 flex-1 font-inter text-base text-primary-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => refetch()}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setTimeout(refetch, 100);
                }}>
                <Feather name="x-circle" size={20} color={colors.primary800} />
              </TouchableOpacity>
            ) : (
              <Feather name="search" size={24} color={colors.primary800} />
            )}
          </View>

          <TouchableOpacity
            onPress={openFilter}
            className="relative h-[48px] w-[48px] items-center justify-center rounded-full bg-primary-50">
            <Feather name="filter" size={22} color={colors.primary800} />
            {(filters.actionTypeId !== 'all' ||
              filters.timeRange !== 'all' ||
              filters.sortBy !== 'newest') && (
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-white bg-rose-500" />
            )}
          </TouchableOpacity>
        </View>

        {/* DANH SÁCH BÀI VIẾT */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Feather name="alert-circle" size={40} color="#f87171" />
            <Text className="text-foreground/80 mt-4 text-center font-inter">
              Đã có lỗi xảy ra.
            </Text>
            <Button title="Thử lại" onPress={() => refetch()} className="mt-4 px-8" />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <FontAwesome6 name="seedling" size={48} color={colors.primary} />
                <Text className="text-foreground/60 mt-4 text-center font-inter">
                  Không tìm thấy bài viết nào.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* BOTTOM SHEET FILTER */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background, borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: colors.primary300, width: 40 }}>
        <BottomSheetView className="flex-1 px-6 pb-8 pt-2">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="font-inter-bold text-xl text-foreground">Bộ lọc tìm kiếm</Text>
            <TouchableOpacity onPress={clearFilter}>
              <Text className="font-inter-medium text-sm text-rose-500">Xóa bộ lọc</Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">Sắp xếp theo</Text>
          <View className="mb-6 flex-row flex-wrap">
            <FilterChip
              label="Mới nhất"
              isSelected={tempFilters.sortBy === 'newest'}
              onPress={() => setTempFilters({ ...tempFilters, sortBy: 'newest' })}
            />
            <FilterChip
              label="Nổi bật (Nhiều lượt thích)"
              isSelected={tempFilters.sortBy === 'popular'}
              onPress={() => setTempFilters({ ...tempFilters, sortBy: 'popular' })}
            />
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">Thời gian</Text>
          <View className="mb-6 flex-row flex-wrap">
            <FilterChip
              label="Tất cả"
              isSelected={tempFilters.timeRange === 'all'}
              onPress={() => setTempFilters({ ...tempFilters, timeRange: 'all' })}
            />
            <FilterChip
              label="Tuần này"
              isSelected={tempFilters.timeRange === 'week'}
              onPress={() => setTempFilters({ ...tempFilters, timeRange: 'week' })}
            />
            <FilterChip
              label="Tháng này"
              isSelected={tempFilters.timeRange === 'month'}
              onPress={() => setTempFilters({ ...tempFilters, timeRange: 'month' })}
            />
          </View>

          <Text className="mb-3 font-inter-semibold text-base text-foreground">Hoạt động xanh</Text>
          <View className="mb-6 flex-row flex-wrap">
            <FilterChip
              label="Tất cả"
              isSelected={tempFilters.actionTypeId === 'all'}
              onPress={() => setTempFilters({ ...tempFilters, actionTypeId: 'all' })}
            />
            {actionTypes.slice(0, 5).map((type) => (
              <FilterChip
                key={type.id}
                label={type.action_name}
                isSelected={tempFilters.actionTypeId === type.id}
                onPress={() => setTempFilters({ ...tempFilters, actionTypeId: type.id })}
              />
            ))}
          </View>

          <View className="flex-1" />
          <Button title="Áp dụng" onPress={applyFilter} />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

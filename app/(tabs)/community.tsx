import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/features/community/PostCard';
import { SearchBar } from '@/components/shared/SearchBar';
import {
  CommunityFilterSheet,
  FilterState,
} from '@/components/features/community/CommunityFilterSheet';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useFeedPosts, useActionTypes } from '@/hooks/queries/usePosts';
import { SortOption } from '@/constants/enums/sortOptions.enum';

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const defaultFilters: FilterState = {
    actionTypeId: 'all',
    sortBy: SortOption.NEWEST,
    fromDate: undefined,
    toDate: undefined,
  };

  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // --- API ---
  const { data, isLoading, isError, refetch, isRefetching } = useFeedPosts({
    page: 1,
    size: 10,
    search: searchQuery,
    action_type_id: filters.actionTypeId !== 'all' ? filters.actionTypeId : undefined,
    sort: filters.sortBy,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  });
  const posts = data?.content || [];

  const { data: actionTypesData } = useActionTypes();
  const actionTypes = actionTypesData || [];

  // --- HANDLERS ---
  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters(defaultFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  const hasActiveFilters =
    filters.actionTypeId !== 'all' ||
    filters.sortBy !== SortOption.NEWEST ||
    filters.fromDate ||
    filters.toDate;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      <Text className="mb-2 px-6 font-inter-bold text-2xl text-foreground">
        {t('community.title')}
      </Text>

      <View className="flex-1 px-4 pt-4">
        <View className="mb-3 flex-row items-center">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('community.search')}
            onSubmitEditing={() => refetch()}
            onClear={() => {
              setSearchQuery('');
              setTimeout(refetch, 100);
            }}
            containerClassName="flex-1 mr-3 rounded-full bg-primary-50 px-5 dark:bg-card"
            inputClassName="mr-2 h-12 font-inter text-base text-primary-800 dark:text-foreground"
            iconColor={colors.neutral400}
          />
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              bottomSheetModalRef.current?.present();
            }}
            className="relative h-[48px] w-[48px] items-center justify-center rounded-full bg-primary-50 dark:bg-card">
            <Feather name="filter" size={22} color={colors.primary800} />
            {hasActiveFilters && (
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-white bg-rose-500 dark:border-background" />
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center">
            <Feather name="alert-circle" size={40} color={colors.error} />
            <Text className="text-foreground/80 mt-4 text-center font-inter">
              {t('community.error')}
            </Text>
            <Button title={t('community.retry')} onPress={() => refetch()} className="mt-4 px-8" />
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
                  {t('community.empty')}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <CommunityFilterSheet
        ref={bottomSheetModalRef}
        initialFilters={filters}
        actionTypes={actionTypes}
        onApply={handleApplyFilter}
        onClear={handleClearAll}
      />
    </View>
  );
}

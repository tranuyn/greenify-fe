import React, { useRef, useState } from 'react';
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
  FeedFilterState,
  MyPostsFilterState,
} from '@/components/features/community/CommunityFilterSheet';
import { FeedFilterSheet } from '../../components/features/community/FeedFilterSheet';
import { MyPostsFilterSheet } from '../../components/features/community/MyPostsFilterSheet';

import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useFeedPosts, useActionTypes, useMyPosts } from '@/hooks/queries/usePosts';
import { SortOption } from '@/constants/enums/sortOptions.enum';

type TabKey = 'community' | 'mine';

const TAB_CONFIG: Record<TabKey, { label: string }> = {
  community: { label: 'Cộng đồng' },
  mine: { label: 'Của tôi' },
};

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const defaultFeedFilters: FeedFilterState = {
    actionTypeId: 'all',
    sortBy: SortOption.NEWEST,
    fromDate: undefined,
    toDate: undefined,
  };

  const defaultMyFilters: MyPostsFilterState = {
    status: 'all',
    sortBy: SortOption.NEWEST,
    fromDate: undefined,
    toDate: undefined,
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabKey>('community');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilters, setFeedFilters] = useState<FeedFilterState>(defaultFeedFilters);
  const [myFilters, setMyFilters] = useState<MyPostsFilterState>(defaultMyFilters);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // --- API ---
  const {
    data: feedData,
    isLoading: isFeedLoading,
    isError: isFeedError,
    refetch: refetchFeed,
    isRefetching: isFeedRefetching,
  } = useFeedPosts(
    {
      page: 1,
      size: 10,
      search: searchQuery,
      action_type_id: feedFilters.actionTypeId !== 'all' ? feedFilters.actionTypeId : undefined,
      sort: feedFilters.sortBy,
      fromDate: feedFilters.fromDate,
      toDate: feedFilters.toDate,
    },
    activeTab === 'community'
  );

  const {
    data: myData,
    isLoading: isMyLoading,
    isError: isMyError,
    refetch: refetchMy,
    isRefetching: isMyRefetching,
  } = useMyPosts(
    {
      page: 1,
      size: 10,
      status: myFilters.status !== 'all' ? myFilters.status : undefined,
      fromDate: myFilters.fromDate,
      toDate: myFilters.toDate,
    },
    activeTab === 'mine'
  );

  const isCommunityTab = activeTab === 'community';
  const activeData = isCommunityTab ? feedData : myData;
  const isLoading = isCommunityTab ? isFeedLoading : isMyLoading;
  const isError = isCommunityTab ? isFeedError : isMyError;
  const refetch = isCommunityTab ? refetchFeed : refetchMy;
  const isRefetching = isCommunityTab ? isFeedRefetching : isMyRefetching;

  const posts = activeData?.content || [];

  const { data: actionTypesData } = useActionTypes();
  const actionTypes = actionTypesData || [];

  const hasActiveFeedFilters =
    feedFilters.actionTypeId !== 'all' ||
    feedFilters.sortBy !== SortOption.NEWEST ||
    feedFilters.fromDate ||
    feedFilters.toDate;

  const hasActiveMyFilters =
    myFilters.status !== 'all' ||
    myFilters.sortBy !== SortOption.NEWEST ||
    myFilters.fromDate ||
    myFilters.toDate;

  const hasActiveFilters = isCommunityTab ? hasActiveFeedFilters : hasActiveMyFilters;

  // --- HANDLERS ---
  const handleApplyFilter = (newFilters: FeedFilterState | MyPostsFilterState) => {
    if (activeTab === 'community') {
      setFeedFilters(newFilters as FeedFilterState);
    } else {
      setMyFilters(newFilters as MyPostsFilterState);
    }
    bottomSheetModalRef.current?.dismiss();
  };

  const handleClearAll = () => {
    if (activeTab === 'community') {
      setSearchQuery('');
      setFeedFilters(defaultFeedFilters);
    } else {
      setMyFilters(defaultMyFilters);
    }
    bottomSheetModalRef.current?.dismiss();
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderEmpty = () => (
    <View className="items-center justify-center py-20">
      <FontAwesome6 name="seedling" size={48} color={colors.primary} />
      <Text className="text-foreground/60 mt-4 text-center font-inter">{t('community.empty')}</Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center">
          <Feather name="alert-circle" size={40} color={colors.error} />
          <Text className="text-foreground/80 mt-4 text-center font-inter">
            {t('community.error')}
          </Text>
          <Button title={t('community.retry')} onPress={handleRefresh} className="mt-4 px-8" />
        </View>
      );
    }

    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      <Text className="mb-2 px-6 font-inter-bold text-2xl text-foreground">
        {t('community.title')}
      </Text>

      <View className="flex-1 px-4 pt-4">
        <View className="mb-5 flex-row rounded-full border border-primary-200 p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('community')}
            className={`flex-1 rounded-full py-3 ${isCommunityTab ? 'bg-primary-700' : ''}`}>
            <Text
              className={`text-center font-inter-semibold ${isCommunityTab ? 'text-white' : 'text-foreground/70'}`}>
              {TAB_CONFIG.community.label}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('mine')}
            className={`flex-1 rounded-full py-3 ${!isCommunityTab ? 'bg-primary-700' : ''}`}>
            <Text
              className={`text-center font-inter-semibold ${!isCommunityTab ? 'text-white' : 'text-foreground/70'}`}>
              {TAB_CONFIG.mine.label}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-3 flex-row items-center">
          {isCommunityTab ? (
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('community.search')}
              onSubmitEditing={handleRefresh}
              onClear={() => {
                setSearchQuery('');
                setTimeout(handleRefresh, 100);
              }}
              containerClassName="flex-1 mr-3 rounded-full bg-primary-50 px-5 dark:bg-card"
              inputClassName="mr-2 h-12 font-inter text-base text-primary-800 dark:text-foreground"
              iconColor={colors.neutral400}
            />
          ) : (
            <View className="mr-3 flex-1 rounded-full bg-primary-50 px-5 py-3 dark:bg-card">
              <Text className="text-foreground/60 font-inter text-base">Bài viết của tôi</Text>
            </View>
          )}
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

        {renderContent()}
      </View>

      {isCommunityTab ? (
        <FeedFilterSheet
          ref={bottomSheetModalRef}
          initialFilters={feedFilters}
          actionTypes={actionTypes}
          onApply={handleApplyFilter}
          onClear={handleClearAll}
        />
      ) : (
        <MyPostsFilterSheet
          ref={bottomSheetModalRef}
          initialFilters={myFilters}
          onApply={handleApplyFilter}
          onClear={handleClearAll}
        />
      )}
    </View>
  );
}

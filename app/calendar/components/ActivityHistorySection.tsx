import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import HistoryItem from './HistoryItem';
import { useTranslation } from 'react-i18next';
import { GreenActionPostDetailDto } from '@/types/action.types';

type Props = {
  historyData: GreenActionPostDetailDto[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
};

const ActivityHistorySection = ({ historyData, isLoading, isFetchingNextPage }: Props) => {
  const { t } = useTranslation();

  return (
    <View className="px-4 pb-24">
      <Text className="mb-3 font-inter-bold text-[var(--foreground)]">
        {t('calendar.history.title')}
      </Text>
      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#359B63" />
        </View>
      ) : historyData.length === 0 ? (
        <Text className="font-inter text-xs text-[var(--muted-foreground)]">
          {t('calendar.history.empty', 'Chưa có lịch sử hoạt động')}
        </Text>
      ) : (
        <>
          {historyData.map((item) => (
            <HistoryItem
              key={item.id}
              title={item.caption || t('calendar.history.green_post_title')}
              description={t('calendar.history.green_post_description')}
              status={item.status}
              imageUrl={item.mediaUrl}
            />
          ))}
          {isFetchingNextPage ? (
            <View className="items-center py-3">
              <ActivityIndicator size="small" color="#359B63" />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

export default ActivityHistorySection;

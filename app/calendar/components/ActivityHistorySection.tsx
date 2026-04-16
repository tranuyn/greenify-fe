import React from 'react';
import { View, Text } from 'react-native';
import HistoryItem from './HistoryItem';
import { useTranslation } from 'react-i18next';

const ActivityHistorySection = () => {
  const { t } = useTranslation();

  return (
    <View className="px-4 pb-24">
      <Text className="mb-3 font-inter-bold text-[var(--foreground)]">
        {t('calendar.history.title')}
      </Text>
      <HistoryItem
        title={t('calendar.history.green_post_title')}
        description={t('calendar.history.green_post_description')}
        status="pending"
        imageUrl="https://via.placeholder.com/50"
      />
      <HistoryItem
        title={t('calendar.history.green_post_title')}
        description={t('calendar.history.green_post_description')}
        status="approved"
        imageUrl="https://via.placeholder.com/50"
      />
    </View>
  );
};

export default ActivityHistorySection;

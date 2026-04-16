import { Badge } from '@/components/ui/Badge';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

interface HistoryItemProps {
  title: string;
  description: string;
  status: 'pending' | 'approved';
  imageUrl: string;
}

const HistoryItem = ({ title, description, status, imageUrl }: HistoryItemProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center border-b border-[var(--border)] py-3">
      <Image source={{ uri: imageUrl }} className="h-12 w-12 rounded-lg bg-[var(--card)]" />
      <View className="ml-3 flex-1">
        <Text className="font-inter-bold text-[var(--foreground)]">{title}</Text>
        <Text className="mt-1 font-inter text-xs text-[var(--muted-foreground)]">
          {description}
        </Text>
      </View>
      <Badge
        label={
          status === 'pending'
            ? t('calendar.history.status_pending')
            : t('calendar.history.status_approved')
        }
        variant={status}
      />
    </View>
  );
};

export default HistoryItem;

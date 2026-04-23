import { useMemo } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useReadAllNotifications, useReadNotification } from '@/hooks/mutations/useNotifications';
import { useMyNotifications, useUnreadNotificationCount } from '@/hooks/queries/useNotifications';
import type { UserNotification } from '@/types/notification.types';

type NotificationListLabel = {
  rowType: 'label';
  id: string;
  label: string;
};

type NotificationListItem = {
  rowType: 'item';
} & UserNotification;

type NotificationRenderItem = NotificationListLabel | NotificationListItem;

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

export default function EventNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { data, isLoading, isRefetching } = useMyNotifications({ page: 1, size: 50 });
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: readNotification, isPending: isReadingNotification } = useReadNotification();
  const { mutate: readAllNotifications, isPending: isReadingAll } = useReadAllNotifications();

  const notifications = data?.content ?? [];
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const sections: NotificationRenderItem[] = useMemo(
    () => [
      ...(unread.length > 0
        ? [{ rowType: 'label' as const, label: 'Chưa đọc', id: 'label-unread' }]
        : []),
      ...unread.map((n) => ({ rowType: 'item' as const, ...n })),
      ...(read.length > 0
        ? [{ rowType: 'label' as const, label: 'Đã đọc', id: 'label-read' }]
        : []),
      ...read.map((n) => ({ rowType: 'item' as const, ...n })),
    ],
    [unread, read]
  );

  const handleReadNotification = async (item: UserNotification) => {
    console.log('Read notification', item);
    await readNotification(item.id);
  };

  const handleReadAll = async () => {
    if (unreadCount === 0 || isReadingAll) return;
    await readAllNotifications();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary-50 dark:bg-card"
          hitSlop={8}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="flex-1 font-inter-bold text-xl text-foreground">Thông báo</Text>
        <TouchableOpacity
          onPress={handleReadAll}
          disabled={unreadCount === 0 || isReadingAll}
          className="rounded-full bg-primary-50 px-3 py-1.5 disabled:opacity-40">
          {isReadingAll ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text className="font-inter-semibold text-xs text-primary-700">Đọc tất cả</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          flexGrow: sections.length === 0 ? 1 : undefined,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-5">
            <Feather name="bell-off" size={28} color={colors.neutral400} />
            <Text className="text-foreground/60 mt-2 text-center font-inter text-sm">
              Bạn chưa có thông báo nào.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.rowType === 'label') {
            return (
              <Text className="text-foreground/50 px-5 pb-2 pt-4 font-inter-semibold text-sm">
                {item.label}
              </Text>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => handleReadNotification(item)}
              disabled={isReadingNotification}
              activeOpacity={0.85}
              className={`flex-row items-center px-5 py-3.5 ${
                !item.read ? 'bg-primary-50/60 dark:bg-primary-950/20' : ''
              }`}>
              {/* Thumbnail */}
              <View className="mr-3.5 h-12 w-12 overflow-hidden rounded-xl bg-primary-100">
                <View className="h-full w-full items-center justify-center">
                  <Feather name="bell" size={18} color={colors.primary700} />
                </View>
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="font-inter-semibold text-sm text-foreground">{item.title}</Text>
                <Text className="text-foreground/60 mt-0.5 font-inter text-sm">{item.content}</Text>
                <Text className="text-foreground/40 mt-1 font-inter text-xs">
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </View>

              {/* Unread dot */}
              {!item.read && <View className="ml-3 h-2.5 w-2.5 rounded-full bg-primary" />}
            </TouchableOpacity>
          );
        }}
        refreshing={isRefetching}
        ItemSeparatorComponent={() => <View className="mx-5 h-px bg-primary-50 dark:bg-white/5" />}
      />
    </View>
  );
}

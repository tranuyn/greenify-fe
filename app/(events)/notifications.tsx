import { View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

// Mock notifications — thay bằng hook thật khi BE có endpoint
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    title: 'Thông báo sự kiện',
    body: 'Đơn đăng ký của bạn đã được duyệt',
    image_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=100',
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 phút trước
  },
  {
    id: 'notif-002',
    title: 'Thông báo sự kiện',
    body: 'Sự kiện sắp diễn ra vào ngày mai',
    image_url: 'https://images.unsplash.com/photo-1542601906897-ecd3d1c4b0a0?w=100',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
  },
  {
    id: 'notif-003',
    title: 'Thông báo sự kiện',
    body: 'Đơn đăng ký của bạn đã được duyệt',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
  },
];

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

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.is_read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.is_read);

  const sections = [
    ...(unread.length > 0
      ? [{ type: 'label' as const, label: 'Chưa đọc', id: 'label-unread' }]
      : []),
    ...unread.map((n) => ({ type: 'item' as const, ...n })),
    ...(read.length > 0 ? [{ type: 'label' as const, label: 'Đã đọc', id: 'label-read' }] : []),
    ...read.map((n) => ({ type: 'item' as const, ...n })),
  ];

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
        <Text className="font-inter-bold text-xl text-foreground">Thông báo</Text>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
        renderItem={({ item }) => {
          if (item.type === 'label') {
            return (
              <Text className="text-foreground/50 px-5 pb-2 pt-4 font-inter-semibold text-sm">
                {item.label}
              </Text>
            );
          }

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              className={`flex-row items-center px-5 py-3.5 ${
                !item.is_read ? 'bg-primary-50/60 dark:bg-primary-950/20' : ''
              }`}>
              {/* Thumbnail */}
              <View className="mr-3.5 h-12 w-12 overflow-hidden rounded-xl bg-primary-100">
                <Image
                  source={{ uri: item.image_url }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="font-inter-semibold text-sm text-foreground">{item.title}</Text>
                <Text className="text-foreground/60 mt-0.5 font-inter text-sm">{item.body}</Text>
                <Text className="text-foreground/40 mt-1 font-inter text-xs">
                  {formatRelativeTime(item.created_at)}
                </Text>
              </View>

              {/* Unread dot */}
              {!item.is_read && <View className="ml-3 h-2.5 w-2.5 rounded-full bg-primary" />}
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View className="mx-5 h-px bg-primary-50 dark:bg-white/5" />}
      />
    </View>
  );
}

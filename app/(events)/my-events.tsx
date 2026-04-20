import { View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { MyEventCard } from '@/components/features/events/MyEventCard';
import { useMyRegistrations } from '@/hooks/queries/useEvents';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

export default function MyEventsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const { data: user } = useCurrentUser();
  const { data: response, isLoading } = useMyRegistrations(user?.id ?? '');
  const events = response?.content ?? [];

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ── */}
      <View
        className="border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center">
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary-50 dark:bg-card"
            hitSlop={8}>
            <Feather name="chevron-left" size={20} color={colors.foreground} />
          </TouchableOpacity>

          {/* Title */}
          <View className="flex-1">
            <Text className="font-inter-bold text-xl text-foreground">
              {t('events.my_events.title')}
            </Text>
            <Text className="text-foreground/50 mt-0.5 font-inter text-sm">
              {t('events.my_events.subtitle')}
            </Text>
          </View>

          {/* Notification bell */}
          <TouchableOpacity
            onPress={() => router.push('/(events)/notifications')}
            className="relative h-10 w-10 items-center justify-center rounded-full bg-primary-50 dark:bg-card"
            hitSlop={8}>
            <Feather name="bell" size={20} color={colors.foreground} />
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 100,
            flexGrow: 1,
          }}
          renderItem={({ item }) => (
            <MyEventCard
              event={item}
              onPress={() =>
                router.push({
                  pathname: '/(events)/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <Feather name="bookmark" size={28} color={colors.primary300} />
              </View>
              <Text className="font-inter-semibold text-base text-foreground">
                {t('events.my_events.empty.title')}
              </Text>
              <Text className="text-foreground/50 mt-1 text-center font-inter text-sm">
                Bạn chưa tham gia sự kiện nào.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

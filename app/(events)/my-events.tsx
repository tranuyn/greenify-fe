import { useState, useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { MyEventCard } from '@/components/features/events/MyEventCard';
import {
  EMPTY_LABEL_KEY,
  getFilteredRegistrations,
  getTabCounts,
  MY_EVENT_TABS,
  type MyEventTab,
} from '@/components/features/events/myEventFilters';
import { useMyRegistrations } from '@/hooks/queries/useEvents';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

export default function MyEventsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const [activeTab, setActiveTab] = useState<MyEventTab>('pending');

  const { data: registrations = [], isLoading } = useMyRegistrations();

  const filtered = useMemo(
    () => getFilteredRegistrations(registrations, activeTab),
    [registrations, activeTab]
  );

  const countByTab = useMemo(() => getTabCounts(registrations), [registrations]);

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
            {/* Unread dot — hiện khi có thông báo chưa đọc */}
            {/* TODO: thay bằng data thật từ notification service */}
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View className="flex-row gap-2 px-5 py-3">
        {MY_EVENT_TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const count = countByTab[tab.key];

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.85}
              className={`flex-1 flex-row items-center justify-center rounded-full px-3 py-2.5 ${
                isActive ? 'bg-primary' : 'bg-primary-50 dark:bg-card'
              }`}>
              <Text
                numberOfLines={1}
                className={`font-inter-semibold text-xs ${
                  isActive ? 'text-white' : 'text-foreground/60'
                }`}>
                {t(tab.labelKey)}
              </Text>

              {/* Badge count */}
              {count > 0 && (
                <View
                  className={`ml-1.5 h-4 min-w-4 items-center justify-center rounded-full px-1 ${
                    isActive ? 'bg-white/25' : 'bg-primary/15'
                  }`}>
                  <Text
                    className={`font-inter-bold text-[10px] ${
                      isActive ? 'text-white' : 'text-primary-700'
                    }`}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: insets.bottom + 100,
            flexGrow: 1,
          }}
          renderItem={({ item }) => (
            <MyEventCard
              registration={item}
              onPress={() =>
                router.push({
                  pathname: '/(events)/[id]',
                  params: { id: item.event_id },
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
                {t(EMPTY_LABEL_KEY[activeTab])}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

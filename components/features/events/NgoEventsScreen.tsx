import { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { SearchBar } from '@/components/shared/SearchBar';
import { useMyNgoEvents } from '@/hooks/queries/useEvents';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { Event, EventStatus } from '@/types/community.types';

// ── Tab config ──────────────────────────────────────────────
type NgoEventTab = 'pending' | 'registered' | 'ongoing' | 'ended' | 'cancelled';

const NGO_TABS: { key: NgoEventTab; statuses: EventStatus[] }[] = [
  { key: 'pending', statuses: ['APPROVAL_WAITING', 'NEEDS_REVISION'] },
  { key: 'registered', statuses: ['APPROVED', 'PUBLISHED'] },
  { key: 'ongoing', statuses: [] },
  { key: 'ended', statuses: ['CLOSED'] },
  { key: 'cancelled', statuses: ['CANCELLED', 'REJECTED'] },
];

function getFilteredEvents(events: Event[], tabKey: NgoEventTab, search: string = '') {
  const tab = NGO_TABS.find((t) => t.key === tabKey)!;
  const now = new Date();

  let filtered: Event[];
  if (tabKey === 'ongoing') {
    filtered = events.filter(
      (e) => e.status === 'PUBLISHED' && new Date(e.startTime) <= now && new Date(e.endTime) >= now
    );
  } else {
    filtered = events.filter((e) => tab.statuses.includes(e.status));
  }

  if (search.trim().length > 0) {
    const term = search.toLowerCase();
    filtered = filtered.filter((e) => e.title.toLowerCase().includes(term));
  }
  return filtered;
}

// ── Status badge config ──────────────────────────────────────
const STATUS_BADGE: Partial<Record<EventStatus, { bg: string; text: string; i18nKey: string }>> = {
  APPROVAL_WAITING: { bg: 'bg-amber-50', text: 'text-amber-600', i18nKey: 'approval_waiting' },
  NEEDS_REVISION: { bg: 'bg-orange-50', text: 'text-orange-600', i18nKey: 'needs_revision' },
  APPROVED: { bg: 'bg-blue-50', text: 'text-blue-600', i18nKey: 'approved' },
  PUBLISHED: { bg: 'bg-primary-50', text: 'text-primary-700', i18nKey: 'published' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-500', i18nKey: 'closed' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-500', i18nKey: 'cancelled' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-500', i18nKey: 'rejected' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
}

// ── NgoEventCard ─────────────────────────────────────────────
function NgoEventCard({
  item,
  onPress,
  onCheckIn,
  onCheckOut,
}: {
  item: Event;
  onPress: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
}) {
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });
  const colors = useThemeColor();
  const badge = STATUS_BADGE[item.status];
  const isOngoing =
    item.status === 'PUBLISHED' &&
    new Date(item.startTime) <= new Date() &&
    new Date(item.endTime) >= new Date();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/50 dark:bg-card">
      <View className="flex-row">
        {/* Thumbnail */}
        <Image
          source={{ uri: item.thumbnail.imageUrl }}
          className="h-full w-24 bg-primary-100"
          resizeMode="cover"
        />

        <View className="flex-1 px-3.5 py-3">
          {/* Status badge */}
          {badge && (
            <View className={`mb-1.5 self-start rounded-full px-2.5 py-0.5 ${badge.bg}`}>
              <Text className={`font-inter-semibold text-[10px] ${badge.text}`}>
                {t(`events.ngo_events.status.${badge.i18nKey}`, 'Trạng thái')}
              </Text>
            </View>
          )}

          <Text className="font-inter-bold text-sm text-foreground" numberOfLines={1}>
            {item.title}
          </Text>

          <View className="mt-1.5 gap-1">
            <View className="flex-row items-center">
              <Feather name="calendar" size={10} color={colors.neutral400} />
              <Text className="text-foreground/50 ml-1.5 font-inter text-[11px]">
                {formatDate(item.startTime)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="users" size={10} color={colors.neutral400} />
              <Text className="text-foreground/50 ml-1.5 font-inter text-[11px]">
                {t('events.ngo_events.registered_count', {
                  defaultValue: 'Đăng ký: {registered}/{max}',
                  registered: item.participantCount ?? 0,
                  max: item.maxParticipants,
                })}
              </Text>
            </View>
          </View>

          {/* Scan QR button — luôn hiển thị, mờ và disable nếu chưa diễn ra */}

          {(onCheckIn || onCheckOut) && (
            <View className="mt-2.5 flex-row items-center gap-2">
              {onCheckIn && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onCheckIn();
                  }}
                  className={`flex-row items-center rounded-xl border px-3 py-1.5 ${
                    isOngoing ? 'border-rose-500 bg-rose-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                  <Feather name="log-in" size={12} color={isOngoing ? '#f43f5e' : '#9ca3af'} />
                  <Text
                    className={`ml-1.5 font-inter-semibold text-xs ${
                      isOngoing ? 'text-rose-500' : 'text-gray-400'
                    }`}>
                    {t('events.ngo_events.check_in', 'Check-in')}
                  </Text>
                </TouchableOpacity>
              )}

              {onCheckOut && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onCheckOut();
                  }}
                  className={`flex-row items-center rounded-xl border px-3 py-1.5 ${
                    isOngoing ? 'border-rose-500 bg-rose-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                  <Feather name="log-out" size={12} color={isOngoing ? '#f43f5e' : '#9ca3af'} />
                  <Text
                    className={`ml-1.5 font-inter-semibold text-xs ${
                      isOngoing ? 'text-rose-500' : 'text-gray-400'
                    }`}>
                    {t('events.ngo_events.check_out', 'Check-out')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────
export function NgoEventsScreen() {
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const [activeTab, setActiveTab] = useState<NgoEventTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTabStatusQuery = useMemo<EventStatus | 'all'>(() => {
    const activeTabConfig = NGO_TABS.find((tab) => tab.key === activeTab);
    if (!activeTabConfig) return 'all';

    if (activeTab === 'ongoing') {
      return 'PUBLISHED';
    }

    if (activeTabConfig.statuses.length === 1) {
      return activeTabConfig.statuses[0];
    }

    return 'all';
  }, [activeTab]);

  const { data: allEventsData, isLoading: isLoadingAllEvents } = useMyNgoEvents({
    page: 1,
    size: 50,
  });

  const { data: eventsData, isLoading: isLoadingFilteredEvents } = useMyNgoEvents({
    page: 1,
    size: 50,
    title: searchQuery.trim() || undefined,
    status: activeTabStatusQuery,
  });

  const allEvents = allEventsData?.content ?? [];
  const listSourceEvents = eventsData?.content ?? [];

  const filtered = useMemo(
    () => getFilteredEvents(listSourceEvents, activeTab, searchQuery),
    [listSourceEvents, activeTab, searchQuery]
  );

  const countByTab = useMemo(() => {
    return Object.fromEntries(
      NGO_TABS.map((tab) => [tab.key, getFilteredEvents(allEvents, tab.key, '').length])
    ) as Record<NgoEventTab, number>;
  }, [allEvents]);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-inter-bold text-2xl text-foreground">
              {t('events.ngo_events.title', 'Sự kiện của tôi')}
            </Text>
            <Text className="text-foreground/50 mt-0.5 font-inter text-sm">
              {t('events.ngo_events.subtitle', 'Quản lý các sự kiện bạn đã tạo')}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Notification bell */}
            <TouchableOpacity
              onPress={() => router.push('/(events)/notifications')}
              className="relative h-10 w-10 items-center justify-center rounded-full bg-primary-50 dark:bg-card">
              <Feather name="bell" size={20} color={colors.foreground} />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </TouchableOpacity>

            {/* Tạo sự kiện */}
            <TouchableOpacity
              onPress={() => router.push('/(ngo)/create-event')}
              className="flex-row items-center rounded-2xl bg-primary px-4 py-2.5">
              <Feather name="plus" size={16} color="white" />
              <Text className="ml-1.5 font-inter-semibold text-sm text-white">
                {c('create_new')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('events.search', 'Tìm kiếm sự kiện')}
          containerClassName="mt-4"
        />
      </View>

      {/* Tab bar — horizontal scroll */}
      <View>
        <FlatList
          data={NGO_TABS}
          horizontal
          keyExtractor={(t) => t.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
          renderItem={({ item: tab }) => {
            const isActive = tab.key === activeTab;
            const count = countByTab[tab.key];
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.85}
                className={`flex-row items-center rounded-full px-4 py-2 ${
                  isActive ? 'bg-primary' : 'bg-primary-50 dark:bg-card'
                }`}>
                <Text
                  numberOfLines={1}
                  className={`font-inter-semibold text-sm ${
                    isActive ? 'text-white' : 'text-foreground/60'
                  }`}>
                  {t(`events.ngo_events.tabs.${tab.key}`, 'Tab')}
                </Text>
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
          }}
        />
      </View>

      {/* List */}
      {isLoadingAllEvents || isLoadingFilteredEvents ? (
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
            <NgoEventCard
              item={item}
              onPress={() => router.push({ pathname: '/(events)/[id]', params: { id: item.id } })}
              onCheckIn={() =>
                router.push({
                  pathname: '/(ngo)/scan-qr',
                  params: { eventId: item.id, type: 'checkin' }, // Gửi type checkin
                })
              }
              onCheckOut={() =>
                router.push({
                  pathname: '/(ngo)/scan-qr',
                  params: { eventId: item.id, type: 'checkout' }, // Gửi type checkout
                })
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <Feather name="calendar" size={28} color={colors.primary300} />
              </View>
              <Text className="font-inter-semibold text-base text-foreground">
                {t('events.ngo_events.empty.title', 'Không có sự kiện nào')}
              </Text>
              <Text className="text-foreground/50 mt-1 text-center font-inter text-sm">
                {t('events.ngo_events.empty.subtitle', 'Bạn chưa tạo sự kiện nào')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

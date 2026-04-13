import { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { SearchBar } from '@/components/shared/SearchBar';
import { EventDateFilterBar } from '@/components/features/events/EventDateFilterBar';
import { EventListCard } from '@/components/features/events/EventListCard';
import { EventTypeChips } from '@/components/features/events/EventTypeChips';
import {
  ALL_EVENT_TYPE_LABEL,
  filterEvents,
  getEventTypeOptions,
  type EventTypeOption,
} from '@/components/features/events/eventFilters';
import { usePublishedEvents, useMyRegistrations } from '@/hooks/queries/useEvents';
import { useRegisterEvent } from '@/hooks/mutations/useEvents';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { REGISTRATION_STATUS, type Event } from '@/types/community.types';

export default function EventsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<EventTypeOption>(ALL_EVENT_TYPE_LABEL);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const { data: eventsData, isLoading } = usePublishedEvents({ page: 1, page_size: 20 });
  const { data: registrations = [] } = useMyRegistrations();
  const { mutate: registerEvent } = useRegisterEvent();

  const registeredIds = useMemo(
    () =>
      new Set(
        registrations
          .filter((registration) => registration.status !== REGISTRATION_STATUS.CANCELLED)
          .map((registration) => registration.event_id)
      ),
    [registrations]
  );

  const allEvents = useMemo(() => eventsData?.items ?? [], [eventsData?.items]);

  const eventTypeOptions = useMemo(() => getEventTypeOptions(allEvents), [allEvents]);

  const filteredEvents = useMemo(() => {
    return filterEvents(allEvents, {
      searchQuery,
      activeType,
      filterDate,
    });
  }, [allEvents, searchQuery, activeType, filterDate]);

  const hasActiveFilter = filterDate !== null || activeType !== ALL_EVENT_TYPE_LABEL;

  const handleReset = useCallback(() => {
    setFilterDate(null);
    setActiveType(ALL_EVENT_TYPE_LABEL);
    setSearchQuery('');
  }, []);

  const handleDateChange = useCallback((_: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS giữ picker mở
    if (selected) setFilterDate(selected);
  }, []);

  const handlePressEvent = useCallback((event: Event) => {
    router.push({ pathname: '/(events)/[id]', params: { id: event.id } });
  }, []);

  const handleRegister = useCallback(
    (eventId: string) => {
      setRegisteringId(eventId);
      registerEvent(eventId, {
        onSuccess: () => setRegisteringId(null),
        onError: () => setRegisteringId(null),
      });
    },
    [registerEvent]
  );

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ── */}
      <View className="bg-background px-5 pb-3" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="!font-inter-bold text-2xl text-foreground">
              {t('events.list.titlePrefix', 'Sự kiện')}{' '}
              <Text className="!font-inter-bold text-2xl text-primary">
                {t('events.list.titleHighlight', 'Xanh')}
              </Text>
            </Text>
            <Text className="text-foreground/50 mt-0.5 font-inter text-sm">
              {t('events.list.subtitle', 'Tham gia và tích điểm GP')}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center rounded-2xl bg-primary-50 px-4 py-2.5 dark:bg-card"
            onPress={() => router.push('/(events)/my-events')}>
            <Feather name="bookmark" size={15} color={colors.primary700} />
            <Text className="ml-1.5 font-inter-semibold text-sm text-primary-700">
              {t('events.list.myEvents', 'Của tôi')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('events.search', 'Tìm kiếm sự kiện...')}
          containerClassName="mt-4"
        />

        <EventDateFilterBar
          filterDate={filterDate}
          hasActiveFilter={hasActiveFilter}
          onOpenDatePicker={() => setShowDatePicker(true)}
          onClearDate={() => setFilterDate(null)}
          onReset={handleReset}
        />
      </View>

      {/* Android date picker — hiện modal native */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={filterDate ?? new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* iOS date picker — bọc trong Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4 dark:bg-card">
              <View className="mb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="text-foreground/50 font-inter-medium text-sm">
                    {t('events.list.cancel', 'Hủy')}
                  </Text>
                </TouchableOpacity>
                <Text className="font-inter-semibold text-base text-foreground">
                  {t('events.list.pickDate', 'Chọn ngày')}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="font-inter-semibold text-sm text-primary-700">
                    {t('events.list.done', 'Xong')}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={filterDate ?? new Date()}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={handleDateChange}
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingTop: 4,
          }}
          ListHeaderComponent={
            <EventTypeChips
              types={eventTypeOptions}
              activeType={activeType}
              onChangeType={setActiveType}
            />
          }
          renderItem={({ item }) => (
            <EventListCard
              item={item}
              isRegistered={registeredIds.has(item.id)}
              isRegistering={registeringId === item.id}
              onPress={() => handlePressEvent(item)}
              onRegister={() => handleRegister(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-24">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <Feather name="calendar" size={28} color={colors.primary300} />
              </View>
              <Text className="text-foreground/50 font-inter-medium text-sm">
                {t('events.list.empty', 'Không tìm thấy sự kiện nào.')}
              </Text>
              {hasActiveFilter && (
                <TouchableOpacity onPress={handleReset} className="mt-3">
                  <Text className="font-inter-semibold text-sm text-primary-700">
                    {t('events.list.clearFilter', 'Xóa bộ lọc')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

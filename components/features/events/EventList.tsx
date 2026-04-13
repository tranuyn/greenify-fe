import { FlatList, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { EventListCard } from './EventListCard';
import { REGISTRATION_STATUS, type Event, type EventRegistration } from '@/types/community.types';

type Props = {
  events: Event[];
  registrations: EventRegistration[];
  isLoading: boolean;
  onPressEvent: (event: Event) => void;
  onRegisterEvent: (eventId: string) => void;
  registeringId: string | null; // ID event đang được register
  emptyMessage?: string;
};

export function EventList({
  events,
  registrations,
  isLoading,
  onPressEvent,
  onRegisterEvent,
  registeringId,
  emptyMessage = 'Không có sự kiện nào.',
}: Props) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();

  // Set để check O(1) thay vì .find() mỗi render
  const registeredEventIds = new Set(
    registrations
      .filter((registration) => registration.status !== REGISTRATION_STATUS.CANCELLED)
      .map((registration) => registration.event_id)
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventListCard
          item={item}
          isRegistered={registeredEventIds.has(item.id)}
          isRegistering={registeringId === item.id}
          onPress={() => onPressEvent(item)}
          onRegister={() => onRegisterEvent(item.id)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 4,
        paddingBottom: insets.bottom + 100,
      }}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <Feather name="calendar" size={28} color={colors.primary300} />
          </View>
          <Text className="text-foreground/50 font-inter-medium text-sm">{emptyMessage}</Text>
        </View>
      }
    />
  );
}

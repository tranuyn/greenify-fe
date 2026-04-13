import type { Event } from '@/types/community.types';

export const ALL_EVENT_TYPE_LABEL = 'Tất cả' as const;

export type EventTypeOption = typeof ALL_EVENT_TYPE_LABEL | string;

export type EventFilterInput = {
  searchQuery: string;
  activeType: EventTypeOption;
  filterDate: Date | null;
};

const PRIORITY_EVENT_TYPES = ['Dọn rác', 'Trồng cây', 'Workshop', 'Chiến dịch'] as const;

export function formatDateLabel(date: Date) {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
}

export function filterEvents(events: Event[], input: EventFilterInput) {
  const normalizedSearch = input.searchQuery.trim().toLowerCase();

  return events.filter((event) => {
    const matchSearch =
      normalizedSearch.length === 0 ||
      event.title.toLowerCase().includes(normalizedSearch) ||
      event.location_address.toLowerCase().includes(normalizedSearch);

    const matchType =
      input.activeType === ALL_EVENT_TYPE_LABEL || event.event_type === input.activeType;

    const matchDate =
      !input.filterDate ||
      isSameCalendarDate(new Date(event.start_time), input.filterDate);

    return matchSearch && matchType && matchDate;
  });
}

export function getEventTypeOptions(events: Event[]): EventTypeOption[] {
  const availableTypes = Array.from(
    new Set(events.map((event) => event.event_type).filter((type) => type.trim().length > 0))
  );

  const orderedPriority = PRIORITY_EVENT_TYPES.filter((type) => availableTypes.includes(type));
  const remaining = availableTypes
    .filter((type) => !PRIORITY_EVENT_TYPES.includes(type as (typeof PRIORITY_EVENT_TYPES)[number]))
    .sort((a, b) => a.localeCompare(b, 'vi'));

  return [ALL_EVENT_TYPE_LABEL, ...orderedPriority, ...remaining];
}

function isSameCalendarDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

import {
  REGISTRATION_STATUS,
  type EventRegistration,
  type RegistrationStatus,
} from '@/types/community.types';

export type MyEventTab = 'pending' | 'ongoing' | 'attended';

export const TAB_STATUSES: Record<MyEventTab, RegistrationStatus[]> = {
  pending: [REGISTRATION_STATUS.REGISTERED, REGISTRATION_STATUS.WAITLISTED],
  ongoing: [REGISTRATION_STATUS.CHECKED_IN],
  attended: [
    REGISTRATION_STATUS.ATTENDED,
    REGISTRATION_STATUS.CHECKED_OUT,
    REGISTRATION_STATUS.NO_SHOW,
  ],
};

export const MY_EVENT_TABS: Array<{ key: MyEventTab; labelKey: string }> = [
  { key: 'pending', labelKey: 'events.my_events.tabs.pending' },
  { key: 'ongoing', labelKey: 'events.my_events.tabs.ongoing' },
  { key: 'attended', labelKey: 'events.my_events.tabs.attended' },
];

export const EMPTY_LABEL_KEY: Record<MyEventTab, string> = {
  pending: 'events.my_events.empty.pending',
  ongoing: 'events.my_events.empty.ongoing',
  attended: 'events.my_events.empty.attended',
};

export function getFilteredRegistrations(registrations: EventRegistration[], activeTab: MyEventTab) {
  const allowedStatuses = TAB_STATUSES[activeTab];

  return registrations
    .filter((registration) => allowedStatuses.includes(registration.status) && !!registration.event)
    .sort((a, b) => {
      const aTime = new Date(a.event?.start_time ?? 0).getTime();
      const bTime = new Date(b.event?.start_time ?? 0).getTime();
      return activeTab === 'attended' ? bTime - aTime : aTime - bTime;
    });
}

export function getTabCounts(registrations: EventRegistration[]): Record<MyEventTab, number> {
  return Object.fromEntries(
    (Object.keys(TAB_STATUSES) as MyEventTab[]).map((key) => [
      key,
      registrations.filter((registration) => TAB_STATUSES[key].includes(registration.status)).length,
    ])
  ) as Record<MyEventTab, number>;
}

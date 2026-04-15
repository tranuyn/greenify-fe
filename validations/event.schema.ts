import { z } from 'zod';
import type { TFunction } from 'i18next';
import type { CreateEventRequest } from 'types/community.types';

const getCreateEventMessages = (t: TFunction) => ({
  title: t('events.create_event.validation.title'),
  description: t('events.create_event.validation.description'),
  eventType: t('events.create_event.validation.event_type'),
  city: t('events.create_event.validation.city'),
  locationAddress: t('events.create_event.validation.location_address'),
  startDate: t('events.create_event.validation.start_date'),
  startTime: t('events.create_event.validation.start_time'),
  endDate: t('events.create_event.validation.end_date'),
  endTime: t('events.create_event.validation.end_time'),
  rewardPointsRequired: t('events.create_event.validation.reward_points_required'),
  rewardPointsPositive: t('events.create_event.validation.reward_points_positive'),
  acceptedTerms: t('events.create_event.validation.accepted_terms'),
  coverImageUrl: t('events.create_event.validation.cover_image_url'),
  latitude: t('events.create_event.validation.latitude'),
  longitude: t('events.create_event.validation.longitude'),
  maxParticipants: t('events.create_event.validation.max_participants'),
  participationConditions: t('events.create_event.validation.participation_conditions'),
  cancelDeadlineDays: t('events.create_event.validation.cancel_deadline_days'),
});

export const createEventSchema = (t: TFunction) => {
  const messages = getCreateEventMessages(t);

  return z.object({
    title: z.string().min(1, messages.title),
    description: z.string().min(1, messages.description),
    event_type: z.string().min(1, messages.eventType),
    cover_image_url: z.string().nullable().optional(),
    city: z.string().min(1, messages.city),
    location_address: z.string().min(1, messages.locationAddress),
    start_date: z.date({ message: messages.startDate }),
    start_time: z.string().min(1, messages.startTime),
    end_date: z.date({ message: messages.endDate }),
    end_time: z.string().min(1, messages.endTime),
    reward_points: z
      .string()
      .min(1, messages.rewardPointsRequired)
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, messages.rewardPointsPositive),
    accepted_terms: z.boolean().refine((v) => v === true, {
      message: messages.acceptedTerms,
    }),
  });
};

export type CreateEventFormData = z.infer<ReturnType<typeof createEventSchema>>;

export const createEventRequestSchema = (t: TFunction): z.ZodType<CreateEventRequest> => {
  const messages = getCreateEventMessages(t);

  return z.object({
    title: z.string().min(1, messages.title),
    description: z.string().min(1, messages.description),
    event_type: z.string().min(1, messages.eventType),
    cover_image_url: z.string().min(1, messages.coverImageUrl),
    location_address: z.string().min(1, messages.locationAddress),
    latitude: z.number().finite(messages.latitude),
    longitude: z.number().finite(messages.longitude),
    start_time: z.string().min(1, messages.startTime),
    end_time: z.string().min(1, messages.endTime),
    max_participants: z.number().int().positive(messages.maxParticipants),
    reward_points: z.number().int().positive(messages.rewardPointsPositive),
    participation_conditions: z.string().min(1, messages.participationConditions),
    cancel_deadline_days: z.number().int().nonnegative(messages.cancelDeadlineDays),
  });
};

type RequestSchemaOutput = z.infer<ReturnType<typeof createEventRequestSchema>>;
type IsCreateEventRequestMatched = RequestSchemaOutput extends CreateEventRequest
  ? CreateEventRequest extends RequestSchemaOutput
    ? true
    : false
  : false;
export type CreateEventRequestSchemaMatches = IsCreateEventRequestMatched;

export const EVENT_TYPE_OPTIONS = [
  { value: 'Dọn rác', labelKey: 'events.create_event.event_types.cleanup' },
  { value: 'Trồng cây', labelKey: 'events.create_event.event_types.tree_planting' },
  { value: 'Workshop', labelKey: 'events.create_event.event_types.workshop' },
  { value: 'Chiến dịch', labelKey: 'events.create_event.event_types.campaign' },
  { value: 'Khác', labelKey: 'events.create_event.event_types.other' },
] as const;

export const GENDER_OPTIONS: { label: string; value: 'Nam' | 'Nữ' | 'Không' }[] = [
  { label: 'Không yêu cầu', value: 'Không' },
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
];

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
  maxParticipantsRequired: t('events.create_event.validation.max_participants_required'),
  minParticipantsRequired: t('events.create_event.validation.min_participants_required'),
  cancelDeadlineRequired: t('events.create_event.validation.cancel_deadline_required'),
  signUpDeadlineRequired: t('events.create_event.validation.sign_up_deadline_required'),
  reminderHoursRequired: t('events.create_event.validation.reminder_hours_required'),
  thankYouHoursRequired: t('events.create_event.validation.thank_you_hours_required'),
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

  const parseDateTime = (date: Date, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      return null;
    }

    const value = new Date(date);
    value.setHours(hour, minute, 0, 0);
    return value;
  };

  return z
    .object({
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
      max_participants: z
        .string()
        .min(1, messages.maxParticipantsRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, messages.maxParticipants),
      min_participants: z
        .string()
        .min(1, messages.minParticipantsRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, messages.minParticipantsRequired),
      cancel_deadline_hours_before: z
        .string()
        .min(1, messages.cancelDeadlineRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, messages.cancelDeadlineDays),
      sign_up_deadline_hours_before: z
        .string()
        .min(1, messages.signUpDeadlineRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, messages.signUpDeadlineRequired),
      reminder_hours_before: z
        .string()
        .min(1, messages.reminderHoursRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, messages.reminderHoursRequired),
      thank_you_hours_after: z
        .string()
        .min(1, messages.thankYouHoursRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, messages.thankYouHoursRequired),
      reward_points: z
        .string()
        .min(1, messages.rewardPointsRequired)
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, messages.rewardPointsPositive),
      participation_conditions: z.string().min(1, messages.participationConditions),
      accepted_terms: z.boolean().refine((v) => v === true, {
        message: messages.acceptedTerms,
      }),
    })
    .superRefine((data, ctx) => {
      const startAt = parseDateTime(data.start_date, data.start_time);
      const endAt = parseDateTime(data.end_date, data.end_time);

      if (!startAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['start_time'],
          message: messages.startTime,
        });
      }

      if (!endAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_time'],
          message: messages.endTime,
        });
      }

      if (startAt && startAt <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['start_time'],
          message: 'Thời gian bắt đầu phải ở tương lai',
        });
      }

      if (startAt && endAt && endAt <= startAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_time'],
          message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
        });
      }
    });
};

export type CreateEventFormData = z.infer<ReturnType<typeof createEventSchema>>;

export const createEventRequestSchema = (t: TFunction): z.ZodType<CreateEventRequest> => {
  const messages = getCreateEventMessages(t);

  return z.object({
    title: z.string().min(1, messages.title),
    description: z.string().min(1, messages.description),
    eventType: z.enum(['CLEANUP', 'PLANTING', 'RECYCLING', 'EDUCATION', 'OTHER']),
    startTime: z.string().min(1, messages.startTime),
    endTime: z.string().min(1, messages.endTime),
    maxParticipants: z.number().int().positive(messages.maxParticipants),
    minParticipants: z.number().int().nonnegative(),
    cancelDeadlineHoursBefore: z.number().int().nonnegative(),
    signUpDeadlineHoursBefore: z.number().int().nonnegative(),
    reminderHoursBefore: z.number().int().nonnegative(),
    thankYouHoursAfter: z.number().int().nonnegative(),
    rewardPoints: z.number().int().positive(messages.rewardPointsPositive),
    status: z.enum([
      'DRAFT',
      'APPROVAL_WAITING',
      'APPROVED',
      'REJECTED',
      'NEEDS_REVISION',
      'PUBLISHED',
      'CLOSED',
      'CANCELLED',
    ]),
    thumbnail: z.any(),
    images: z.array(z.any()),
    address: z.any(),
  }) as unknown as z.ZodType<CreateEventRequest>;
};

type RequestSchemaOutput = z.infer<ReturnType<typeof createEventRequestSchema>>;
type IsCreateEventRequestMatched = RequestSchemaOutput extends CreateEventRequest
  ? CreateEventRequest extends RequestSchemaOutput
    ? true
    : false
  : false;
export type CreateEventRequestSchemaMatches = IsCreateEventRequestMatched;

export const EVENT_TYPE_OPTIONS = [
  { value: 'CLEANUP', labelKey: 'events.create_event.event_types.cleanup' },
  { value: 'PLANTING', labelKey: 'events.create_event.event_types.tree_planting' },
  { value: 'EDUCATION', labelKey: 'events.create_event.event_types.workshop' },
  { value: 'RECYCLING', labelKey: 'events.create_event.event_types.campaign' },
  { value: 'OTHER', labelKey: 'events.create_event.event_types.other' },
] as const;

export const GENDER_OPTIONS: { label: string; value: 'Nam' | 'Nữ' | 'Không' }[] = [
  { label: 'Không yêu cầu', value: 'Không' },
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
];

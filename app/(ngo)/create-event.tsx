import { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { AuthInput } from '@/components/shared/auth/AuthInput';
import { DropdownPicker } from '@/components/ui/DropdownPicker';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useCreateEvent } from '@/hooks/mutations/useEvents';
import {
  createEventSchema,
  type CreateEventFormData,
  EVENT_TYPE_OPTIONS,
} from '@/validations/event.schema';

// ── Helpers ──────────────────────────────────────────────────
function formatDate(d: Date) {
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// ── Section wrapper ───────────────────────────────────────────
function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-card">
      <TouchableOpacity
        onPress={() => setCollapsed((p) => !p)}
        className="flex-row items-center justify-between px-4 py-3.5"
        activeOpacity={0.85}
      >
        <Text className="font-inter-bold text-base text-foreground">{title}</Text>
        <Feather
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={18}
          color="#9ca3af"
        />
      </TouchableOpacity>
      {!collapsed && <View className="gap-4 px-4 pb-4">{children}</View>}
    </View>
  );
}

// ── DateTime field ────────────────────────────────────────────
type DateTimeFieldProps = {
  label: string;
  date: Date;
  timeString: string;
  onDateChange: (d: Date) => void;
  onTimeChange: (t: string) => void;
};

function DateTimeField({
  label,
  date,
  timeString,
  onDateChange,
  onTimeChange,
}: DateTimeFieldProps) {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const colors = useThemeColor();
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });

  const timeDate = (() => {
    const [h, m] = timeString.split(':').map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  })();

  return (
    <View>
      <Text className="mb-2 font-inter-medium text-sm text-foreground/70">{label}</Text>
      <View className="flex-row gap-3">
        {/* Time */}
        <TouchableOpacity
          onPress={() => setShowTime(true)}
          className="flex-1 flex-row items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-3"
        >
          <Text className="font-inter text-sm text-foreground">{timeString || '09:00'}</Text>
          <Feather name="clock" size={15} color={colors.primary700} />
        </TouchableOpacity>

        {/* Date */}
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          className="flex-1 flex-row items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-3"
        >
          <Text className="font-inter text-sm text-foreground">{formatDate(date)}</Text>
          <Feather name="calendar" size={15} color={colors.primary700} />
        </TouchableOpacity>
      </View>

      {/* Date picker */}
      {showDate && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(_: DateTimePickerEvent, d?: Date) => {
            setShowDate(false);
            if (d) onDateChange(d);
          }}
        />
      )}

      {/* Time picker */}
      {showTime && Platform.OS === 'android' && (
        <DateTimePicker
          value={timeDate}
          mode="time"
          display="default"
          onChange={(_: DateTimePickerEvent, d?: Date) => {
            setShowTime(false);
            if (d) {
              onTimeChange(
                `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
              );
            }
          }}
        />
      )}

      {/* iOS modals */}
      {Platform.OS === 'ios' && (
        <>
          <Modal visible={showDate} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
              <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4 dark:bg-card">
                <View className="mb-2 flex-row justify-between">
                  <TouchableOpacity onPress={() => setShowDate(false)}>
                    <Text className="font-inter-medium text-sm text-foreground/50">
                      {c('cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDate(false)}>
                    <Text className="font-inter-semibold text-sm text-primary-700">
                      {c('done')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onChange={(_: DateTimePickerEvent, d?: Date) => { if (d) onDateChange(d); }}
                  style={{ height: 180 }}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={showTime} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/40">
              <View className="rounded-t-3xl bg-white px-5 pb-8 pt-4 dark:bg-card">
                <View className="mb-2 flex-row justify-between">
                  <TouchableOpacity onPress={() => setShowTime(false)}>
                    <Text className="font-inter-medium text-sm text-foreground/50">
                      {c('cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowTime(false)}>
                    <Text className="font-inter-semibold text-sm text-primary-700">
                      {c('done')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={timeDate}
                  mode="time"
                  display="spinner"
                  onChange={(_: DateTimePickerEvent, d?: Date) => {
                    if (d)
                      onTimeChange(
                        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
                      );
                  }}
                  style={{ height: 180 }}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);

  const { mutate: createEvent, isPending } = useCreateEvent();
  const eventFormSchema = useMemo(() => createEventSchema(t), [t]);
  const eventTypeOptions = useMemo(
    () =>
      EVENT_TYPE_OPTIONS.map((option) => ({
        code: option.value,
        name: t(option.labelKey),
      })),
    [t],
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      event_type: '',
      city: '',
      location_address: '',
      start_date: new Date(),
      start_time: '09:00',
      end_date: new Date(),
      end_time: '11:00',
    //   gender_condition: 'Không',
      reward_points: '',
      accepted_terms: false,
    },
  });

  const watchedEventType = watch('event_type');
  const watchedTerms = watch('accepted_terms');
  const selectedEventTypeLabel = useMemo(() => {
    const selectedEventType = EVENT_TYPE_OPTIONS.find((option) => option.value === watchedEventType);
    return selectedEventType ? t(selectedEventType.labelKey) : '';
  }, [t, watchedEventType]);

  const onSubmit = useCallback(
    (data: CreateEventFormData) => {
      // Merge date + time thành ISO string
      const buildISO = (date: Date, time: string) => {
        const [h, m] = time.split(':').map(Number);
        const d = new Date(date);
        d.setHours(h, m, 0, 0);
        return d.toISOString();
      };

      createEvent(
        {
          title: data.title,
          description: data.description,
          event_type: data.event_type,
          cover_image_url: coverImage || '',
        //   city: data.city,
          location_address: data.location_address,
          latitude: 10.7769,   // TODO: tích hợp geocoding
          longitude: 106.7009,
          start_time: buildISO(data.start_date, data.start_time),
          end_time: buildISO(data.end_date, data.end_time),
          max_participants: 100,
          reward_points: Number(data.reward_points),
          participation_conditions: '',
          cancel_deadline_days: 3,
        //   gender_condition: data.gender_condition,
        //   accepted_terms: data.accepted_terms,
        },
        {
          onSuccess: () => {
            Alert.alert(
              t('events.create_event.alerts.success_title'),
              t('events.create_event.alerts.success_message'),
              [{ text: c('ok'), onPress: () => router.back() }],
            );
          },
          onError: (err: any) => {
            Alert.alert(
              t('events.create_event.alerts.error_title'),
              err?.response?.data?.message ?? t('events.create_event.alerts.error_fallback'),
            );
          },
        },
      );
    },
    [createEvent, coverImage, c, t],
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary-50 dark:bg-card"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="font-inter-bold text-xl text-foreground">
          {t('events.create_event.title')}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 140,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cover image */}
        <TouchableOpacity
          className="mb-4 h-44 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 dark:bg-card"
          onPress={() => {
            // TODO: tích hợp expo-image-picker
          }}
        >
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Feather name="image" size={22} color={colors.primary700} />
              </View>
              <Text className="font-inter-medium text-sm text-foreground/50">
                {t('events.create_event.cover_placeholder')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Thông tin sự kiện */}
        <FormSection title={t('events.create_event.sections.info')}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label={`${t('events.create_event.fields.title.label')} *`}
                placeholder={t('events.create_event.fields.title.placeholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <View>
                <Text className="mb-1 font-inter-medium text-sm text-foreground/80">
                  {t('events.create_event.fields.description.label')} *
                </Text>
                <TextInput
                  ref={ref}
                  className="min-h-[100px] rounded-xl border border-primary-100 bg-primary-50 px-3 py-3 font-inter text-sm text-foreground"
                  placeholder={t('events.create_event.fields.description.placeholder')}
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  textAlignVertical="top"
                />
                {errors.description && (
                  <Text className="mt-1 text-xs text-rose-600">
                    {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Event type dropdown */}
          <View>
            <Text className="mb-1 font-inter-medium text-sm text-foreground/80">
              {t('events.create_event.fields.event_type.label')} *
            </Text>
            <DropdownPicker
              label={t('events.create_event.fields.event_type.label')}
              placeholder={t('events.create_event.fields.event_type.placeholder')}
              value={selectedEventTypeLabel}
              options={eventTypeOptions}
              isOpen={showEventTypeDropdown}
              onToggle={() => setShowEventTypeDropdown((p) => !p)}
              onSelect={(opt) => {
                setValue('event_type', opt.code, { shouldValidate: true });
                setShowEventTypeDropdown(false);
              }}
              errorText={errors.event_type?.message}
            />
          </View>
        </FormSection>

        {/* Địa điểm */}
        <FormSection title={t('events.create_event.sections.location')}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label={`${t('events.create_event.fields.city.label')} *`}
                placeholder={t('events.create_event.fields.city.placeholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.city?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="location_address"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label={`${t('events.create_event.fields.address.label')} *`}
                placeholder={t('events.create_event.fields.address.placeholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.location_address?.message}
              />
            )}
          />
        </FormSection>

        {/* Thời gian */}
        <FormSection title={t('events.create_event.sections.time')}>
          <Controller
            control={control}
            name="start_date"
            render={({ field: { value, onChange } }) => (
              <Controller
                control={control}
                name="start_time"
                render={({ field: { value: timeVal, onChange: timeChange } }) => (
                  <DateTimeField
                    label={t('events.create_event.fields.start')}
                    date={value}
                    timeString={timeVal}
                    onDateChange={onChange}
                    onTimeChange={timeChange}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="end_date"
            render={({ field: { value, onChange } }) => (
              <Controller
                control={control}
                name="end_time"
                render={({ field: { value: timeVal, onChange: timeChange } }) => (
                  <DateTimeField
                    label={t('events.create_event.fields.end')}
                    date={value}
                    timeString={timeVal}
                    onDateChange={onChange}
                    onTimeChange={timeChange}
                  />
                )}
              />
            )}
          />
        </FormSection>

        {/* Điểm nhận được */}
        <View className="mb-4 overflow-hidden rounded-2xl bg-white px-4 py-4 shadow-sm shadow-black/5 dark:bg-card">
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            {t('events.create_event.sections.reward')}
          </Text>
          <Controller
            control={control}
            name="reward_points"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <AuthInput
                    ref={ref}
                    label=""
                    placeholder={t('events.create_event.fields.reward_points.placeholder')}
                    keyboardType="number-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorText={errors.reward_points?.message}
                  />
                </View>
                <Text className="font-inter-bold text-2xl text-primary">{c('gp_unit')}</Text>
              </View>
            )}
          />
        </View>

        {/* Terms */}
        <TouchableOpacity
          className="mb-6 flex-row items-start"
          onPress={() => setValue('accepted_terms', !watchedTerms, { shouldValidate: true })}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: watchedTerms }}
        >
          <View
            className={`mr-2.5 mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              watchedTerms
                ? 'border-primary-700 bg-primary-700'
                : errors.accepted_terms
                  ? 'border-rose-400 bg-white'
                  : 'border-primary-300 bg-white'
            }`}
          >
            {watchedTerms && <Ionicons name="checkmark" size={13} color="white" />}
          </View>
          <Text className="flex-1 text-xs leading-5 text-foreground/70">
            {t('events.create_event.terms.prefix')}{' '}
            <Text className="font-inter-medium text-primary-700">
              {t('events.create_event.terms.use')}
            </Text>
            {' '}{t('events.create_event.terms.and')}{' '}
            <Text className="font-inter-medium text-primary-700">
              {t('events.create_event.terms.privacy')}
            </Text>
            {' '}{t('events.create_event.terms.suffix')}
          </Text>
        </TouchableOpacity>
        {errors.accepted_terms && (
          <Text className="-mt-4 mb-4 text-xs text-rose-600">
            {errors.accepted_terms.message}
          </Text>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 items-center rounded-2xl border border-primary-200 py-3.5"
        >
          <Text className="font-inter-semibold text-base text-foreground/70">
            {c('cancel')}
          </Text>
        </TouchableOpacity>

        <Button
          title={t('events.create_event.buttons.submit')}
          isLoading={isPending}
          onPress={handleSubmit(onSubmit)}
          className="flex-1 bg-primary"
        />
      </View>
    </View>
  );
}
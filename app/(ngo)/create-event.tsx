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
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { AuthInput } from '@/components/shared/auth/AuthInput';
import { DropdownPicker } from '@/components/ui/DropdownPicker';
import ProvincePicker from '@/components/ui/ProvincePicker';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useCreateEvent } from '@/hooks/mutations/useEvents';
import { uploadService } from '@/services/upload.service';
import {
  createEventSchema,
  type CreateEventFormData,
  EVENT_TYPE_OPTIONS,
} from '@/validations/event.schema';
import type { EventType } from '@/types/community.types';
import type { MediaDto } from '@/types/media.types';

import { FormSection } from '@/components/ui/FormSection';
import { DateTimeField } from '@/components/ui/DateTimeField';
import PredictEvent from '../../components/features/events/PredictEvent';

type SelectedImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

// ── Main Screen ───────────────────────────────────────────────
export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<SelectedImage | null>(null);
  const [eventImages, setEventImages] = useState<SelectedImage[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);
  const [isPredictModalVisible, setIsPredictModalVisible] = useState(false);

  const { mutateAsync: createEvent, isPending } = useCreateEvent();
  const eventFormSchema = useMemo(() => createEventSchema(t), [t]);
  const eventTypeOptions = useMemo(
    () =>
      EVENT_TYPE_OPTIONS.map((option) => ({
        code: option.value,
        name: t(option.labelKey),
      })),
    [t]
  );
  const handlePickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t('common.error', 'Lỗi'),
          'Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể tải ảnh bìa lên.'
        );
        return;
      }

      // Mở trình chọn ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chọn ảnh
        allowsEditing: true, // Bật chế độ Crop ảnh
        aspect: [16, 9], // Ép tỷ lệ 16:9 chuẩn cho cover sự kiện
        quality: 0.7, // Nén ảnh xuống 70% để tối ưu performance upload
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Lưu local URI để preview hiển thị lên UI ngay lập tức
        const selected = result.assets[0];
        setCoverImage(selected.uri);
        setCoverImageFile({
          uri: selected.uri,
          fileName: selected.fileName ?? `event-cover-${Date.now()}.jpg`,
          mimeType: selected.mimeType ?? 'image/jpeg',
        });
      }
    } catch (error) {
      Alert.alert(t('common.error', 'Lỗi'), 'Đã có sự cố khi chọn ảnh. Vui lòng thử lại.');
    }
  }, [t]);

  const handlePickEventImages = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t('common.error', 'Lỗi'),
          'Chúng tôi cần quyền truy cập thư viện ảnh để bạn có thể tải ảnh sự kiện lên.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages: SelectedImage[] = result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.fileName ?? `event-image-${Date.now()}.jpg`,
          mimeType: asset.mimeType ?? 'image/jpeg',
        }));

        setEventImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert(t('common.error', 'Lỗi'), 'Đã có sự cố khi chọn ảnh sự kiện. Vui lòng thử lại.');
    }
  }, [t]);

  const toRequiredMediaDto = useCallback((media: MediaDto, fallbackMessage: string): MediaDto => {
    if (!media.imageUrl || !media.bucketName || !media.objectKey) {
      throw new Error(fallbackMessage);
    }

    return {
      imageUrl: media.imageUrl,
      bucketName: media.bucketName,
      objectKey: media.objectKey,
    };
  }, []);

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
      max_participants: '50',
      min_participants: '10',
      cancel_deadline_hours_before: '24',
      sign_up_deadline_hours_before: '24',
      reminder_hours_before: '2',
      thank_you_hours_after: '2',
      reward_points: '',
      participation_conditions: 'Cần tuân thủ quy định của ban tổ chức.',
      accepted_terms: false,
    },
  });

  const watchedEventType = watch('event_type');
  const watchedTerms = watch('accepted_terms');
  const watchedStartDate = watch('start_date');
  const watchedStartTime = watch('start_time');
  const watchedMaxParticipants = watch('max_participants');
  const watchedMinParticipants = watch('min_participants');
  const watchedParticipationConditions = watch('participation_conditions');
  const selectedEventTypeLabel = useMemo(() => {
    const selectedEventType = EVENT_TYPE_OPTIONS.find(
      (option) => option.value === watchedEventType
    );
    return selectedEventType ? t(selectedEventType.labelKey) : '';
  }, [t, watchedEventType]);

  const buildISO = useCallback((date: Date, time: string) => {
    const [h, m, s] = time.split(':').map(Number);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(Number.isFinite(h) ? h : 0).padStart(2, '0');
    const minute = String(Number.isFinite(m) ? m : 0).padStart(2, '0');
    const second = String(Number.isFinite(s) ? s : 0).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }, []);

  const predictEventType = (watchedEventType || 'OTHER') as EventType;
  const predictEndDate = watch('end_date');
  const predictEndTime = watch('end_time');
  const predictEndLabel = useMemo(() => {
    const dateLabel = predictEndDate ? predictEndDate.toLocaleDateString() : '';
    return `${dateLabel} ${predictEndTime || ''}`.trim();
  }, [predictEndDate, predictEndTime]);

  const onSubmit = useCallback(
    async (data: CreateEventFormData) => {
      if (!coverImageFile) {
        Alert.alert(t('common.error', 'Lỗi'), 'Vui lòng tải ảnh bìa sự kiện trước khi tạo.');
        return;
      }

      try {
        setIsUploadingMedia(true);

        const uploadedThumbnailRaw = await uploadService.uploadFile({
          uri: coverImageFile.uri,
          name: coverImageFile.fileName,
          type: coverImageFile.mimeType,
        });

        const uploadedImagesRaw = await Promise.all(
          eventImages.map((image) =>
            uploadService.uploadFile({
              uri: image.uri,
              name: image.fileName,
              type: image.mimeType,
            })
          )
        );

        const thumbnail = toRequiredMediaDto(
          uploadedThumbnailRaw,
          'Upload ảnh bìa chưa trả về đủ bucketName/objectKey.'
        );
        const images = uploadedImagesRaw.map((image) =>
          toRequiredMediaDto(image, 'Upload ảnh sự kiện chưa trả về đủ bucketName/objectKey.')
        );

        await createEvent({
          title: data.title,
          description: data.description,
          eventType: data.event_type as any, // Cast because we will update EVENT_TYPE_OPTIONS
          startTime: buildISO(data.start_date, data.start_time),
          endTime: buildISO(data.end_date, data.end_time),
          maxParticipants: Number(data.max_participants),
          minParticipants: Number(data.min_participants),
          cancelDeadlineHoursBefore: Number(data.cancel_deadline_hours_before),
          signUpDeadlineHoursBefore: Number(data.sign_up_deadline_hours_before),
          reminderHoursBefore: Number(data.reminder_hours_before),
          thankYouHoursAfter: Number(data.thank_you_hours_after),
          rewardPoints: Number(data.reward_points),
          status: 'APPROVAL_WAITING',
          thumbnail,
          images,
          participationConditions: data.participation_conditions,
          address: {
            province: data.city,
            ward: '',
            addressDetail: data.location_address,
            latitude: 10.7769,
            longitude: 106.7009,
          },
        });

        Alert.alert(
          t('events.create_event.alerts.success_title'),
          t('events.create_event.alerts.success_message'),
          [{ text: c('ok'), onPress: () => router.back() }]
        );
      } catch (err: any) {
        Alert.alert(
          t('events.create_event.alerts.error_title'),
          err?.response?.data?.message ??
            err?.message ??
            t('events.create_event.alerts.error_fallback')
        );
        console.error('Create event error:', err.response?.data.message || err);
      } finally {
        setIsUploadingMedia(false);
      }
    },
    [buildISO, c, coverImageFile, createEvent, eventImages, t, toRequiredMediaDto]
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full  dark:bg-card"
          hitSlop={8}>
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
        keyboardShouldPersistTaps="handled">
        {/* Cover image */}
        <TouchableOpacity
          className="mb-4 h-44 items-center justify-center overflow-hidden rounded-2xl bg-primary-50  dark:bg-card"
          onPress={handlePickImage}>
          {coverImage ? (
            <>
              <Image source={{ uri: coverImage }} className="h-full w-full" resizeMode="cover" />
              <View className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-md">
                <Feather name="edit-2" size={16} color="white" />
              </View>
            </>
          ) : (
            <View className="items-center ">
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <Feather name="image" size={22} color={colors.primary700} />
              </View>
              <Text className="text-foreground/50 font-inter-medium text-sm">
                {t('events.create_event.cover_placeholder', 'Nhấn để tải ảnh bìa lên')}
              </Text>
              <Text className="text-foreground/40 mt-1 font-inter text-xs">
                Khuyên dùng ảnh tỷ lệ 16:9
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="mb-4 rounded-2xl border border-primary-100 p-4">
          <Text className="mb-2 font-inter-semibold text-sm text-foreground">Ảnh sự kiện</Text>
          <Text className="text-foreground/60 mb-3 font-inter text-xs">
            Tải thêm ảnh minh hoạ cho sự kiện.
          </Text>

          {eventImages.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-x-3">
                {eventImages.map((image, index) => (
                  <View
                    key={`${image.uri}-${index}`}
                    className="relative h-24 w-24 overflow-hidden rounded-xl">
                    <Image
                      source={{ uri: image.uri }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setEventImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                      }
                      className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/60">
                      <Feather name="x" size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={handlePickEventImages}
                  className="h-24 w-24 items-center justify-center rounded-xl border border-dashed border-primary-300 bg-primary-50">
                  <Feather name="plus" size={18} color={colors.primary700} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <TouchableOpacity
              onPress={handlePickEventImages}
              className="h-24 items-center justify-center rounded-xl border border-dashed border-primary-300 bg-primary-50">
              <Feather name="image" size={18} color={colors.primary700} />
              <Text className="text-foreground/70 mt-2 font-inter-medium text-xs">
                Thêm ảnh sự kiện
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thiết lập sự kiện */}
        <FormSection title="Thiết lập sự kiện" zIndex={6}>
          <Controller
            control={control}
            name="min_participants"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Số người tối thiểu *"
                placeholder="10"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.min_participants?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="max_participants"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Số người tối đa *"
                placeholder="100"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.max_participants?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="sign_up_deadline_hours_before"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Hạn đăng ký trước bao nhiêu giờ *"
                placeholder="24"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.sign_up_deadline_hours_before?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cancel_deadline_hours_before"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Hạn hủy trước bao nhiêu giờ *"
                placeholder="24"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.cancel_deadline_hours_before?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="reminder_hours_before"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Nhắc trước bao nhiêu giờ *"
                placeholder="2"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.reminder_hours_before?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="thank_you_hours_after"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <AuthInput
                ref={ref}
                label="Gửi cảm ơn sau bao nhiêu giờ *"
                placeholder="2"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorText={errors.thank_you_hours_after?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="participation_conditions"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
                  Điều kiện tham gia *
                </Text>
                <TextInput
                  className="min-h-[96px] rounded-xl border border-primary-100  px-3 py-3 font-inter text-sm text-foreground"
                  placeholder="Ví dụ: Mặc trang phục phù hợp, đến đúng giờ..."
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  textAlignVertical="top"
                />
                {errors.participation_conditions && (
                  <Text className="mt-1 text-xs text-rose-600">
                    {errors.participation_conditions.message}
                  </Text>
                )}
              </View>
            )}
          />
        </FormSection>

        {/* Thông tin sự kiện */}
        <FormSection title={t('events.create_event.sections.info')} zIndex={10}>
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
                <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
                  {t('events.create_event.fields.description.label')} *
                </Text>
                <TextInput
                  ref={ref}
                  className="min-h-[100px] rounded-xl border border-primary-100  px-3 py-3 font-inter text-sm text-foreground"
                  placeholder={t('events.create_event.fields.description.placeholder')}
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  textAlignVertical="top"
                />
                {errors.description && (
                  <Text className="mt-1 text-xs text-rose-600">{errors.description.message}</Text>
                )}
              </View>
            )}
          />

          {/* Event type dropdown */}
          <View className="z-20">
            <DropdownPicker
              label={`${t('events.create_event.fields.event_type.label')} *`}
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
        <FormSection title={t('events.create_event.sections.location')} zIndex={9}>
          <ProvincePicker
            label={`${t('events.create_event.fields.city.label')} *`}
            value={watch('city')}
            onChange={(provinceName) => setValue('city', provinceName, { shouldValidate: true })}
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
        <FormSection title={t('events.create_event.sections.time')} zIndex={8}>
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
        <View className="z-[7] mb-4 overflow-hidden rounded-2xl bg-white px-4 py-4 shadow-sm shadow-black/5 dark:bg-card">
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
          accessibilityState={{ checked: watchedTerms }}>
          <View
            className={`mr-2.5 mt-0.5 h-5 w-5 items-center justify-center rounded border ${
              watchedTerms
                ? 'border-primary-700 bg-primary-700'
                : errors.accepted_terms
                  ? 'border-rose-400 bg-white'
                  : 'border-primary-300 bg-white'
            }`}>
            {watchedTerms && <Ionicons name="checkmark" size={13} color="white" />}
          </View>
          <Text className="text-foreground/70 flex-1 text-xs leading-5">
            {t('events.create_event.terms.prefix')}{' '}
            <Text className="font-inter-medium text-primary-700">
              {t('events.create_event.terms.use')}
            </Text>{' '}
            {t('events.create_event.terms.and')}{' '}
            <Text className="font-inter-medium text-primary-700">
              {t('events.create_event.terms.privacy')}
            </Text>{' '}
            {t('events.create_event.terms.suffix')}
          </Text>
        </TouchableOpacity>
        {errors.accepted_terms && (
          <Text className="-mt-4 mb-4 text-xs text-rose-600">{errors.accepted_terms.message}</Text>
        )}

        <TouchableOpacity
          onPress={() => setIsPredictModalVisible(true)}
          className="mb-6 flex-row items-center justify-center rounded-2xl border border-primary-700  px-4 py-3 dark:bg-card"
          activeOpacity={0.85}>
          <Feather name="star" size={16} color={colors.primary700} />
          <Text className="ml-2 font-inter-semibold text-sm text-primary-700">Dự đoán sự kiện</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 items-center rounded-2xl border border-primary-200 py-3.5">
          <Text className="text-foreground/70 font-inter-semibold text-base">{c('cancel')}</Text>
        </TouchableOpacity>

        <Button
          title={t('events.create_event.buttons.submit')}
          isLoading={isPending || isUploadingMedia}
          onPress={handleSubmit(onSubmit)}
          className="flex-1 bg-primary"
        />
      </View>

      <PredictEvent
        visible={isPredictModalVisible}
        onClose={() => setIsPredictModalVisible(false)}
        province={watch('city')}
        startTime={buildISO(watchedStartDate, watchedStartTime)}
        endTime={buildISO(predictEndDate, predictEndTime)}
        minParticipants={Number(watchedMinParticipants || 0)}
        expectedParticipants={Number(watchedMaxParticipants || 0)}
        eventType={predictEventType}
        eventTypeLabel={selectedEventTypeLabel}
        title={watch('title')}
        locationAddress={watch('location_address')}
        participationConditions={watchedParticipationConditions}
      />
    </View>
  );
}

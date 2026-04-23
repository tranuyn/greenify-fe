import { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import { eventService } from '@/services/community.service';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import {
  useEventDetail,
  useMyRegistrations,
  useEventRegistrations,
} from '@/hooks/queries/useEvents';

import {
  useRegisterEvent,
  useRegisterWaitlistEvent,
  useCancelRegistration,
} from '@/hooks/mutations/useEvents';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { Event, REGISTRATION_STATUS } from '@/types/community.types';
import { AttendeeCard } from '@/components/features/events/AttendeeCard';
import { getRegistrationButtonLabel } from '@/utils/eventUtils';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function EventDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const [showQR, setShowQR] = useState(false);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: event, isLoading, isError, error } = useEventDetail(id);
  const { data: registrationsResponse } = useMyRegistrations(user?.id ?? '');
  const { mutate: registerEvent } = useRegisterEvent();
  const { mutate: registerWaitlistEvent } = useRegisterWaitlistEvent();
  // Lấy danh sách người đăng ký sự kiện (chỉ fetch nếu không phải tổ chức)
  const shouldFetchEventRegistrations = user?.ngoProfile?.id !== event?.organizer?.id;
  const { data: eventRegistrations, isLoading: isLoadingRegistrations } = useEventRegistrations(
    shouldFetchEventRegistrations ? id : ''
  );
  const myRegistrationEvent = registrationsResponse?.content?.find((e: Event) => e.id === id);

  // Always fetch registration code when modal is opened
  useEffect(() => {
    const fetchQr = async () => {
      if (showQR && user?.id && id) {
        setQrLoading(true);
        try {
          const code = await eventService.getRegistrationCode(id, user.id);
          setQrCode(code);
        } catch (e) {
          setQrCode(null);
        }
        setQrLoading(false);
      } else if (!showQR) {
        setQrCode(null);
      }
    };
    fetchQr();
  }, [showQR, user?.id, id]);

  const isRegistered = event?.registrationStatus === REGISTRATION_STATUS.REGISTERED;
  const canShowQR = isRegistered;

  const isFull = (event?.participantCount ?? 0) >= (event?.maxParticipants ?? 0);
  const isProcessing = registeringId === event?.id;

  const buttonLabel = getRegistrationButtonLabel({
    t,
    registrationStatus: event?.registrationStatus,
    isFull,
    isProcessing,
  });

  const handleRegister = useCallback(() => {
    if (!event) return;
    setRegisteringId(event.id);
    const mutationFn = isFull ? registerWaitlistEvent : registerEvent;
    mutationFn(
      { eventId: event.id },
      {
        onSuccess: () => setRegisteringId(null),
        onError: (err: any) => {
          setRegisteringId(null);
          Alert.alert(
            t(
              'events.detail.alert.register_failed_title',
              isFull ? 'Vào danh sách chờ thất bại' : 'Đăng ký thất bại'
            ),
            err?.response?.data?.message ??
              t(
                'events.detail.alert.register_failed_message',
                isFull ? 'Không thể vào danh sách chờ' : 'Không thể đăng ký sự kiện'
              )
          );
        },
      }
    );
  }, [event, registerEvent, registerWaitlistEvent, t, isFull]);

  const handleCancelConfirm = useCallback(() => {
    Alert.alert(
      t('events.detail.alert.cancel_title', 'Hủy đăng ký'),
      t('events.detail.alert.cancel_message', 'Bạn có chắc muốn hủy đăng ký sự kiện này?'),
      [
        { text: t('events.detail.alert.keep_registration', 'Giữ đăng ký'), style: 'cancel' },
        {
          text: t('events.detail.alert.confirm_cancel_registration', 'Xác nhận hủy đăng ký'),
          style: 'destructive',
          onPress: () => {
            // TODO: gọi cancelRegistration mutation khi BE có endpoint
            Alert.alert(t('events.detail.alert.cancel_success', 'Hủy đăng ký thành công'));
          },
        },
      ]
    );
  }, [t]);

  const handlegetQrCode = useCallback(() => {
    if (!event) return;
    const res = setShowQR(true);
  }, [event]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !event) {
    const detailErrorMessage =
      (error as any)?.response?.data?.message ??
      (error as any)?.message ??
      t('events.detail.load_failed', {
        defaultValue: 'Không thể tải chi tiết sự kiện. Vui lòng thử lại.',
      });

    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Feather name="alert-circle" size={28} color={colors.error} />
        <Text className="mt-3 text-center font-inter-semibold text-base text-foreground">
          {t('common.error', { defaultValue: 'Đã có lỗi xảy ra' })}
        </Text>
        <Text className="text-foreground/60 mt-1 text-center font-inter text-sm">
          {detailErrorMessage}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-primary px-4 py-2.5">
          <Text className="font-inter-semibold text-sm text-white">
            {t('common.back', { defaultValue: 'Quay lại' })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOrganizer = user?.ngoProfile?.id === event?.organizer?.id;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}>
        {/* Cover image */}
        <View className="relative h-56">
          <Image
            source={{ uri: event.thumbnail.imageUrl }}
            className="h-full w-full bg-primary-100"
            resizeMode="cover"
          />
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="top-safe absolute left-4 items-center justify-center rounded-full bg-black/40 p-2"
            style={{ top: insets.top + 12 }}
            hitSlop={8}>
            <Feather name="chevron-left" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-5 pt-5">
          {/* Organizer info */}
          {event.organizer && (
            <View className="mb-2 flex-row items-center">
              <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                <Feather name="shield" size={12} color={colors.primary700} />
              </View>
              <Text className="font-inter-semibold text-xs uppercase tracking-wider text-primary-700">
                {event.organizer.name}
              </Text>
              {/* Nếu có avatar hoặc logo tổ chức */}
              {event.organizer?.avatar && (
                <Image
                  source={{
                    uri:
                      typeof event.organizer.avatar === 'string'
                        ? event.organizer.avatar
                        : event.organizer.avatar.imageUrl,
                  }}
                  className="ml-2 h-6 w-6 rounded-full"
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          {/* Title + GP */}
          <View className="flex-row items-start justify-between">
            <Text
              className="flex-1 font-inter-bold text-xl text-foreground"
              style={{ marginRight: 12 }}>
              {event.title}
            </Text>
            <View className="items-end">
              <Text className="text-foreground/50 font-inter text-xs">
                {t('events.detail.reward_label', 'Phần thưởng')}
              </Text>
              <Text className="font-inter-bold text-2xl text-primary">
                {event.rewardPoints}
                <Text className="font-inter-semibold text-sm text-primary-700"> GP</Text>
              </Text>
            </View>
          </View>

          {/* Gallery images */}
          {event.images && event.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-4">
              <View className="flex-row gap-x-3">
                {event.images.map((img, idx) => (
                  <Image
                    key={img.imageUrl || idx}
                    source={{ uri: img.imageUrl }}
                    className="h-24 w-36 rounded-xl"
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          )}

          {/* Meta info */}
          <View className="mt-4 gap-2.5">
            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="map-pin" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 flex-1 font-inter text-sm">
                {event.address?.addressDetail}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="users" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 font-inter text-sm">
                {t('events.detail.participants', {
                  defaultValue: 'Tham gia: {registered}/{total}',
                  registered: event.participantCount ?? 0,
                  total: event.maxParticipants,
                })}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="clock" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 font-inter text-sm">
                {formatTime(event.startTime)} – {formatTime(event.endTime)} ·{' '}
                {formatDate(event.startTime)}
              </Text>
            </View>

            {/* Event type */}
            {event.eventType && (
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                  <Feather name="tag" size={15} color={colors.primary700} />
                </View>
                <Text className="text-foreground/70 font-inter text-sm">{event.eventType}</Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View className="my-5 h-px bg-primary-50 dark:bg-white/5" />

          {/* Description */}
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            {t('events.detail.description_title', 'Mô tả')}
          </Text>
          <Text className="text-foreground/70 font-inter text-sm leading-6">
            {event.description}
          </Text>

          {/* Participation conditions */}
          <View className="my-5 h-px bg-primary-50 dark:bg-white/5" />
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            {t('events.detail.conditions_title', 'Điều kiện tham gia')}
          </Text>
          <Text className="text-foreground/70 font-inter text-sm leading-6">
            {event.participationConditions || 'Cần tuân thủ quy định của ban tổ chức.'}
          </Text>
        </View>

        {/* Danh sách người đăng ký sự kiện (chỉ cho tổ chức) */}
        {isOrganizer && (
          <View className="mb-6 mt-10 px-4">
            {/* Nút chỉnh sửa sự kiện */}
            {/* <Button
              title={t('events.detail.edit_event', 'Chỉnh sửa sự kiện')}
              className="mb-4 bg-primary"
              onPress={() =>
                router.push({ pathname: '/(ngo)/create-event', params: { id: event.id } })
              }
            /> */}
            <Text className="mb-2 font-inter-bold text-base text-foreground">
              {t('events.detail.registrations_title', 'Danh sách người đăng ký')}
            </Text>

            {isLoadingRegistrations ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : eventRegistrations && eventRegistrations.length > 0 ? (
              eventRegistrations.map((reg) => <AttendeeCard key={reg.id} item={reg} />)
            ) : (
              <View className="items-center rounded-2xl border border-dashed border-gray-200 p-6 dark:border-white/10">
                <Feather name="users" size={24} color={colors.neutral400} className="mb-2" />
                <Text className="text-foreground/60 text-center font-inter text-sm">
                  {t('events.detail.no_registrations', 'Chưa có ai đăng ký')}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Bottom CTA ── */}
      {user?.ngoProfile?.id !== event.organizer?.id && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
          style={{ paddingBottom: insets.bottom + 12 }}>
          {isRegistered && (
            <View className="flex-row items-center gap-3">
              {/* Quét mã QR */}
              {canShowQR && (
                <View className="flex-1">
                  <Button
                    title={t('events.detail.actions.scan_qr', 'Quét mã QR')}
                    onPress={() => setShowQR(true)}
                    className="w-full bg-primary"
                  />
                </View>
              )}

              {/* Hủy đăng ký */}
              <View className="flex-1">
                <Button
                  title={t('events.detail.actions.cancel_registration', 'Hủy đăng ký')}
                  onPress={handleCancelConfirm}
                  variant="danger"
                  className="w-full py-2"
                />
              </View>
            </View>
          )}
          <Button
            title={buttonLabel}
            disabled={registeringId === event.id || !!event?.registrationStatus}
            isLoading={registeringId === event.id}
            onPress={handleRegister}
            className="mt-3 bg-primary"
          />
        </View>
      )}

      {/* ── QR Modal ── */}
      <Modal
        visible={showQR}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQR(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6 dark:bg-card">
            <View className="mb-6 h-1 w-10 self-center rounded-full bg-gray-200" />

            <Text className="mb-6 text-center font-inter-bold text-lg text-foreground">
              {t('events.detail.qr.title', 'Mã QR sự kiện')}
            </Text>

            {/* QR Code */}
            <View className="mb-6 items-center justify-center rounded-3xl bg-white p-6 shadow-md shadow-black/50">
              <View className="h-[200px] w-[200px] items-center justify-center">
                {qrLoading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : qrCode ? (
                  <QRCode value={qrCode} size={200} />
                ) : (
                  <Text className="text-foreground/50 text-sm">Không lấy được mã QR</Text>
                )}
              </View>
            </View>

            {/* Registration code */}
            <Text className="mb-6 text-center font-inter-bold text-lg text-foreground">
              {myRegistrationEvent?.id
                ? `Mã: ${myRegistrationEvent.id.slice(0, 6).toUpperCase()}`
                : ''}
            </Text>

            <TouchableOpacity
              onPress={() => setShowQR(false)}
              className="items-center rounded-2xl bg-primary-50 py-3.5 dark:bg-card">
              <Text className="font-inter-semibold text-base text-primary-700">
                {t('events.detail.qr.back', 'Quay lại')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

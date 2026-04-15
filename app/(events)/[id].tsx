import { useState, useCallback } from 'react';
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
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useEventDetail, useMyRegistrations } from '@/hooks/queries/useEvents';
import { useRegisterEvent } from '@/hooks/mutations/useEvents';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { REGISTRATION_STATUS } from '@/types/community.types';

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

  const { data: event, isLoading } = useEventDetail(id);
  const { data: registrations = [] } = useMyRegistrations();
  const { mutate: registerEvent } = useRegisterEvent();

  const myRegistration = registrations.find(
    (registration) =>
      registration.event_id === id &&
      registration.status !== REGISTRATION_STATUS.CANCELLED
  );

  const isRegistered = !!myRegistration;
  const canShowQR =
    myRegistration?.status === REGISTRATION_STATUS.REGISTERED ||
    myRegistration?.status === REGISTRATION_STATUS.CHECKED_IN;

  const isFull = (event?.registered_count ?? 0) >= (event?.max_participants ?? 0);

  const handleRegister = useCallback(() => {
    if (!event) return;
    setRegisteringId(event.id);
    registerEvent(event.id, {
      onSuccess: () => setRegisteringId(null),
      onError: (err: any) => {
        setRegisteringId(null);
        Alert.alert(
          t('events.detail.alert.register_failed_title'),
          err?.response?.data?.message ?? t('events.detail.alert.register_failed_message')
        );
      },
    });
  }, [event, registerEvent, t]);

  const handleCancelConfirm = useCallback(() => {
    Alert.alert(
      t('events.detail.alert.cancel_title'),
      t('events.detail.alert.cancel_message'),
      [
        { text: t('events.detail.alert.keep_registration'), style: 'cancel' },
        {
          text: t('events.detail.alert.confirm_cancel_registration'),
          style: 'destructive',
          onPress: () => {
            // TODO: gọi cancelRegistration mutation khi BE có endpoint
            Alert.alert(t('events.detail.alert.cancel_success'));
          },
        },
      ]
    );
  }, [t]);

  if (isLoading || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Cover image */}
        <View className="relative h-56">
          <Image
            source={{ uri: event.cover_image_url }}
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
          {/* NGO */}
          {event.ngo_name && (
            <View className="mb-2 flex-row items-center">
              <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                <Feather name="shield" size={12} color={colors.primary700} />
              </View>
              <Text className="font-inter-semibold text-xs uppercase tracking-wider text-primary-700">
                {event.ngo_name}
              </Text>
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
                {t('events.detail.reward_label')}
              </Text>
              <Text className="font-inter-bold text-2xl text-primary">
                {event.reward_points}
                <Text className="font-inter-semibold text-sm text-primary-700"> GP</Text>
              </Text>
            </View>
          </View>

          {/* Meta info */}
          <View className="mt-4 gap-2.5">
            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="map-pin" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 flex-1 font-inter text-sm">
                {event.location_address}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="users" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 font-inter text-sm">
                {t('events.detail.participants', {
                  registered: event.registered_count ?? 0,
                  total: event.max_participants,
                })}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
                <Feather name="clock" size={15} color={colors.primary700} />
              </View>
              <Text className="text-foreground/70 font-inter text-sm">
                {formatTime(event.start_time)} – {formatTime(event.end_time)} ·{' '}
                {formatDate(event.start_time)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="my-5 h-px bg-primary-50 dark:bg-white/5" />

          {/* Description */}
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            {t('events.detail.description_title')}
          </Text>
          <Text className="text-foreground/70 font-inter text-sm leading-6">
            {event.description}
          </Text>

          {/* Participation conditions */}
          {event.participation_conditions && (
            <>
              <View className="my-5 h-px bg-primary-50 dark:bg-white/5" />
              <Text className="mb-3 font-inter-bold text-base text-foreground">
                {t('events.detail.conditions_title')}
              </Text>
              <Text className="text-foreground/70 font-inter text-sm leading-6">
                {event.participation_conditions}
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
        style={{ paddingBottom: insets.bottom + 12 }}>
        {isRegistered ? (
          <View className="gap-3">
            {/* Quét mã QR */}
            {canShowQR && (
              <Button
                title={t('events.detail.actions.scan_qr')}
                onPress={() => setShowQR(true)}
                className="bg-primary"
              />
            )}
            {/* Hủy đăng ký */}
            <TouchableOpacity onPress={handleCancelConfirm} className="items-center py-2">
              <Text className="font-inter-medium text-sm text-rose-500">
                {t('events.detail.actions.cancel_registration')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title={
              isFull
                ? t('events.detail.actions.full')
                : registeringId === event.id
                  ? t('events.detail.actions.processing')
                  : t('events.detail.actions.register')
            }
            disabled={isFull || registeringId === event.id}
            isLoading={registeringId === event.id}
            onPress={handleRegister}
            className="bg-primary"
          />
        )}
      </View>

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
              {t('events.detail.qr.title')}
            </Text>

            {/* QR Code */}
            <View className="mb-6 items-center justify-center rounded-3xl bg-white p-6 shadow-md shadow-black/50">
              {myRegistration?.qr_token ? (
                <QRCode
                  value={myRegistration.qr_token}
                  size={200}
                  color={colors.primary500}
                  backgroundColor="white"
                />
              ) : (
                <View className="h-[200px] w-[200px] items-center justify-center">
                  <Text className="text-foreground/50 text-sm">{t('events.detail.qr.empty')}</Text>
                </View>
              )}
            </View>

            {/* Registration code */}
            <Text className="mb-6 text-center font-inter-bold text-lg text-foreground">
              {myRegistration?.id ? `Cái mã gì đó#${myRegistration.id.slice(0, 6).toUpperCase()}` : ''}
            </Text>

            <TouchableOpacity
              onPress={() => setShowQR(false)}
              className="items-center rounded-2xl bg-primary-50 py-3.5 dark:bg-card">
              <Text className="font-inter-semibold text-base text-primary-700">
                {t('events.detail.qr.back')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { useState, useCallback } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useCheckInAttendee } from '@/hooks/mutations/useEvents';

// expo-camera đã có trong project rồi

type ScanState = 'idle' | 'processing' | 'success' | 'error';

export default function ScanQrScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });

  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [lastScannedToken, setLastScannedToken] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState('');

  const { mutate: checkIn } = useCheckInAttendee(eventId);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      // Tránh scan nhiều lần liên tiếp cùng 1 token
      if (scanState === 'processing' || data === lastScannedToken) return;

      setLastScannedToken(data);
      setScanState('processing');

      checkIn(data, {
        onSuccess: (res) => {
          setScanState('success');
          setResultMessage(
            t('events.scan_qr.result_success', {
              name: res.username || 'User',
            }),
          );
          // Reset sau 2.5s để scan tiếp
          setTimeout(() => {
            setScanState('idle');
            setLastScannedToken(null);
            setResultMessage('');
          }, 2500);
        },
        onError: (err: any) => {
          setScanState('error');
          const msg = err?.response?.data?.message ?? t('events.scan_qr.invalid_qr');
          setResultMessage(t('events.scan_qr.result_error', { message: msg }));
          setTimeout(() => {
            setScanState('idle');
            setLastScannedToken(null);
            setResultMessage('');
          }, 2500);
        },
      });
    },
    [checkIn, scanState, lastScannedToken, t]
  );

  // Permission chưa xác định
  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  // Chưa cấp quyền camera
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Feather name="camera-off" size={28} color={colors.primary700} />
        </View>
        <Text className="mb-2 text-center font-inter-bold text-lg text-foreground">
          {t('events.scan_qr.permission_title')}
        </Text>
        <Text className="text-foreground/60 mb-6 text-center font-inter text-sm">
          {t('events.scan_qr.permission_description')}
        </Text>
        <TouchableOpacity onPress={requestPermission} className="rounded-2xl bg-primary px-6 py-3">
          <Text className="font-inter-semibold text-base text-white">
            {t('events.scan_qr.permission_button')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Camera full screen */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanState === 'idle' ? handleBarCodeScanned : undefined}
      />

      {/* Overlay UI */}
      <View className="absolute inset-0">
        {/* Header */}
        <View className="flex-row items-center px-5" style={{ paddingTop: insets.top + 16 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-black/50"
            hitSlop={8}>
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
          <Text className="font-inter-bold text-lg text-white">{t('events.scan_qr.title')}</Text>
        </View>

        {/* Scan frame */}
        <View className="flex-1 items-center justify-center">
          {/* Dark overlay với hole ở giữa — dùng 4 view tạo thành frame */}
          <View className="h-64 w-64">
            {/* Corner decorations */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
              <View
                key={corner}
                className={`absolute h-10 w-10 border-primary ${
                  corner === 'tl'
                    ? 'left-0 top-0 rounded-tl-2xl border-l-4 border-t-4'
                    : corner === 'tr'
                      ? 'right-0 top-0 rounded-tr-2xl border-r-4 border-t-4'
                      : corner === 'bl'
                        ? 'bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4'
                        : 'bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4'
                }`}
              />
            ))}
          </View>

          <Text className="mt-6 font-inter text-sm text-white/70">
            {t('events.scan_qr.hint')}
          </Text>
        </View>

        {/* Result toast */}
        {resultMessage !== '' && (
          <View
            className={`mx-5 mb-8 rounded-2xl px-5 py-4 ${
              scanState === 'success' ? 'bg-primary' : 'bg-rose-500'
            }`}
            style={{ marginBottom: insets.bottom + 32 }}>
            <Text className="text-center font-inter-semibold text-base text-white">
              {resultMessage}
            </Text>
          </View>
        )}

        {/* Processing indicator */}
        {scanState === 'processing' && (
          <View className="absolute inset-0 items-center justify-center bg-black/30">
            <View className="rounded-2xl bg-white/90 px-8 py-6">
              <Text className="text-center font-inter-semibold text-base text-foreground">
                {c('processing')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

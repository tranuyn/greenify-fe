import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, TextInput, View } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useVerifyOtp, useVerifyOtpWhenForgot } from '@/hooks/mutations/useAuth';

const OTP_LENGTH = 6;

function maskEmail(email: string) {
  if (!email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0] ?? ''}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

export default function VerifyOtpScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { mutate: verifyOtp, isPending } = useVerifyOtpWhenForgot();

  const destination = useMemo(() => {
    return params.identifier ? maskEmail(params.identifier) : 'địa chỉ của bạn';
  }, [params.identifier]);

  const updateOtpValue = (index: number, value: string) => {
    setErrorMsg(''); // Xóa lỗi khi gõ lại
    const cleanValue = value.replace(/[^0-9]/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = cleanValue;
    setOtp(nextOtp);

    if (cleanValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const moveBackIfEmpty = (index: number) => {
    if (otp[index] || index === 0) return;
    inputRefs.current[index - 1]?.focus();
  };

  const onVerify = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setErrorMsg(t('auth.verify_email.incomplete_code', 'Vui lòng nhập đầy đủ mã xác thực'));
      return;
    }

    verifyOtp(
      { identifier: params.identifier ?? '', otp: code },
      {
        onSuccess: (response) => {
          const verificationToken =
            response?.verificationToken ?? (response as any)?.verificationToken;

          if (!verificationToken) {
            setErrorMsg(t('auth.verify_email.invalid_response', 'Mã xác thực không hợp lệ'));
            return;
          }

          router.push({
            pathname: '/(forgot)/set-password',
            params: { identifier: params.identifier, verificationToken: verificationToken },
          });
        },
        onError: (err: any) => {
          console.log('Lỗi khi verify OTP:', err, err?.response?.data);
          setErrorMsg(
            err?.response?.data?.message ||
              t('auth.verify_email.invalid_code', 'Mã xác thực không đúng')
          );
        },
      }
    );
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title={t('auth.verify_email.title', 'Xác thực email')}
        subtitle={`${t('auth.verify_email.subtitle', 'Nhập mã xác thực đã gửi tới')} ${destination}.`}
      />

      <View className="mb-2 mt-6 flex-row justify-center gap-3">
        {otp.map((value, index) => (
          <TextInput
            key={`otp-${index}`}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            className={`h-14 w-14 rounded-xl border bg-primary-50 text-center font-inter-bold text-xl text-foreground transition-colors ${errorMsg ? 'border-red-400' : 'border-primary-200 focus:border-primary-500'}`}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => updateOtpValue(index, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') moveBackIfEmpty(index);
            }}
          />
        ))}
      </View>

      {errorMsg ? <Text className="mt-2 text-center text-sm text-red-500">{errorMsg}</Text> : null}

      <Pressable className="mt-4 self-center" hitSlop={8} onPress={() => router.back()}>
        <Text className="font-inter-medium text-sm text-primary-700">
          {t('auth.verify_email.resend', 'Gửi lại mã')}
        </Text>
      </Pressable>

      <Button
        title={t('auth.verify_email.submit_btn', 'Xác nhận')}
        className="mt-6"
        disabled={isPending}
        onPress={onVerify}
      />
    </AuthScaffold>
  );
}

import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, TextInput, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { useMemo, useRef, useState } from 'react';

const OTP_LENGTH = 4;

function maskEmail(email: string) {
  if (!email.includes('@')) {
    return email;
  }

  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0] ?? ''}***@${domain}`;
  }

  return `${local.slice(0, 2)}***@${domain}`;
}

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ role?: string; email?: string }>();
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const destination = useMemo(() => {
    if (!params.email) {
      return 'địa chỉ bạn vừa nhập';
    }

    return maskEmail(params.email);
  }, [params.email]);

  const updateOtpValue = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = cleanValue;
    setOtp(nextOtp);

    if (cleanValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const moveBackIfEmpty = (index: number) => {
    if (otp[index] || index === 0) {
      return;
    }

    inputRefs.current[index - 1]?.focus();
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title="Xác nhận Email"
        subtitle={`Chúng tôi đã gửi mã xác thực đến ${destination}.`}
      />

      <View className="mb-2 flex-row justify-center gap-3">
        {otp.map((value, index) => (
          <TextInput
            key={`otp-${index}`}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            className="h-12 w-12 rounded-xl border border-primary-200 bg-primary-50 text-center text-lg font-inter-bold text-foreground"
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => updateOtpValue(index, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                moveBackIfEmpty(index);
              }
            }}
          />
        ))}
      </View>

      <Pressable className="self-center" hitSlop={8}>
        <Text className="text-sm font-inter-medium text-primary-700">Gửi lại mã</Text>
      </Pressable>

      <Button
        title="Xác nhận"
        className="mt-5"
        onPress={() =>
          router.push({
            pathname: '/(auth)/signup-password',
            params: { role: params.role ?? 'citizen', email: params.email ?? '' },
          })
        }
      />

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-sm text-foreground/70">Đã có tài khoản?</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="text-sm font-inter-semibold text-primary-700">Đăng nhập</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

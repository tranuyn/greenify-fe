import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthInput } from '@/components/shared/auth/AuthInput';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { SocialAuthButtons } from '@/components/shared/auth/SocialAuthButtons';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useRequestOtp, useRequestOtpWhenForgot } from '@/hooks/mutations/useAuth';
import { SignupEmailFormData, signupEmailSchema } from '@/validations/auth.schema';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ role?: string }>();
  const { mutate: requestOtp, isPending } = useRequestOtpWhenForgot();

  const { control, handleSubmit, setError } = useForm<SignupEmailFormData>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = (data: SignupEmailFormData) => {
    requestOtp(data, {
      onSuccess: (response) => {
        router.push({
          pathname: '/(forgot)/verify-otp',
          params: { identifier: data.identifier },
        });
      },
      onError: (error: any) => {
        setError('identifier', {
          type: 'manual',
          message: error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        });
      },
    });
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title={t('auth.forgot_password.title', 'Quên mật khẩu')}
        subtitle={t('auth.forgot_password.subtitle', 'Nhập email để nhận mã xác thực.')}
      />

      <View className="gap-4">
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.forgot_password.email_label', 'Email')}
              placeholder={t('auth.forgot_password.email_placeholder', 'Nhập email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
            />
          )}
        />
      </View>

      <Button
        title={t('auth.forgot_password.submit_btn', 'Gửi mã xác thực')}
        className="mt-5"
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      />

      <View className="mt-5">
        <SocialAuthButtons />
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">
          {t('auth.forgot_password.has_account', 'Already have an account?')}
        </Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">
            {t('auth.login.title', 'Đăng nhập')}
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

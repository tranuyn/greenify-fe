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

import { useRequestOtp } from '@/hooks/mutations/useAuth';
import { SignupEmailFormData, signupEmailSchema } from '@/validations/auth.schema';

export default function SignupEmailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ role?: string }>();
  const { mutate: requestOtp, isPending } = useRequestOtp();

  const { control, handleSubmit, setError } = useForm<SignupEmailFormData>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = (data: SignupEmailFormData) => {
    requestOtp(data, {
      onSuccess: (response) => {
        router.push({
          pathname: '/(auth)/verify-email',
          params: { role: params.role ?? 'citizen', identifier: data.identifier },
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
        title={t('auth.signup_email.title')}
        subtitle={t('auth.signup_email.subtitle')}
      />

      <View className="gap-4">
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.signup_email.email_label')}
              placeholder={t('auth.signup_email.email_placeholder')}
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
        title={t('auth.signup_email.submit_btn')}
        className="mt-5"
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      />

      <View className="mt-5">
        <SocialAuthButtons />
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">{t('auth.signup_email.has_account')}</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">
            {t('auth.login.title')}
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

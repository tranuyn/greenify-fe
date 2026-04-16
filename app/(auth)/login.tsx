import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { queryClient } from 'lib/queryClient';
import { QUERY_KEYS } from 'constants/queryKeys';
import { authService } from 'services/auth.service';

import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { SocialAuthButtons } from 'components/shared/auth/SocialAuthButtons';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';

import { useLogin } from 'hooks/mutations/useAuth';
import { LoginFormData, loginSchema } from 'validations/auth.schema';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutation, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  // Hàm xử lý khi user bấm nút Đăng nhập (Chỉ chạy khi đã qua ải Zod)
  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: async () => {
        try {
          await queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.auth.me(),
            queryFn: () => authService.getMe().then((res) => res),
          });
        } catch (error) {
          console.warn('Failed to fetch user data:', error);
        }
        // Navigate to home
        router.replace('/(tabs)');
      },
      onError: (error: any) => {
        // Xử lý lỗi trả về từ Backend (Ví dụ: Sai pass, email chưa đăng ký)
        const errorCode = error?.response?.data?.error_code;
        const message = error?.response?.data?.message || t('auth.login.error_fallback');

        if (errorCode === 'INVALID_CREDENTIALS' || error?.response?.status === 401) {
          // Highlight ô identifier bị lỗi nhưng không hiện text (cho đỡ rối)
          setError('identifier', { type: 'manual', message: '' });
          // Hiện text lỗi ở ô password
          setError('password', { type: 'manual', message: message });
        } else {
          // Các lỗi mạng/server khác
          setError('password', { type: 'manual', message: message });
        }
      },
    });
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader title={t('auth.login.title')} subtitle={t('auth.login.subtitle')} />

      <View className="mt-6 gap-4">
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.login.email_label')}
              placeholder={t('auth.login.email_placeholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message} // Đẩy lỗi text đỏ vào UI
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.login.password_label')}
              placeholder={t('auth.login.password_placeholder')}
              secureTextEntry={!showPassword}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
              secureToggle={{
                visible: showPassword,
                onToggle: () => setShowPassword((prev) => !prev),
              }}
            />
          )}
        />
      </View>

      <Pressable className="mt-3 self-end" hitSlop={6}>
        <Text className="font-inter-medium text-sm text-primary-700">
          {t('auth.login.forgot_password')}
        </Text>
      </Pressable>

      <Button
        title={t('auth.login.login_btn')}
        className="mt-6"
        // isLoading={isPending} // Bật nếu Component Button có hỗ trợ xoay xoay
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      />

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">{t('auth.login.no_account')}</Text>
        <Pressable onPress={() => router.push('/(auth)/account-type')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">
            {t('auth.login.register')}
          </Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <SocialAuthButtons />
      </View>
    </AuthScaffold>
  );
}

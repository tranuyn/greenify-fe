import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthInput } from '@/components/shared/auth/AuthInput';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { Button } from '@/components/ui/Button';

import { useSetPassword } from '@/hooks/mutations/useAuth';
import { SignupPasswordFormData, signupPasswordSchema } from '@/validations/auth.schema';

export default function SignupPasswordScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    role?: string;
    identifier?: string;
    verificationToken?: string;
  }>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: setPassword, isPending } = useSetPassword();

  const { control, handleSubmit, setError } = useForm<SignupPasswordFormData>({
    resolver: zodResolver(signupPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (data: SignupPasswordFormData) => {
    // Đảm bảo có đủ params từ các bước trước
    if (!params.verificationToken) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Dữ liệu không hợp lệ. Vui lòng quay lại.',
      });
      return;
    }

    setPassword(
      {
        verificationToken: params.verificationToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          router.push({
            pathname: '/(auth)/complete-profile',
            params: { role: params.role ?? 'citizen', identifier: params.identifier },
          });
        },
        onError: (err: any) => {
          setError('confirmPassword', {
            type: 'manual',
            message: err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
          });
        },
      }
    );
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title={t('auth.signup_password.title')}
        subtitle={t('auth.signup_password.subtitle')}
      />

      <View className="mt-6 gap-4">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.signup_password.password_label')}
              placeholder={t('auth.signup_password.password_placeholder')}
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.signup_password.confirm_label')}
              placeholder={t('auth.signup_password.confirm_placeholder')}
              secureTextEntry={!showConfirm}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
              secureToggle={{
                visible: showConfirm,
                onToggle: () => setShowConfirm((prev) => !prev),
              }}
            />
          )}
        />
      </View>

      <Button
        title={t('auth.signup_password.submit_btn')}
        className="mt-6"
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthScaffold>
  );
}

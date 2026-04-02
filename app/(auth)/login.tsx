import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { SocialAuthButtons } from 'components/shared/auth/SocialAuthButtons';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';

// Hooks
import { useLogin } from 'hooks/mutations/useAuth';
import { LoginFormData, loginSchema } from 'validations/auth.schema';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  // Gọi hàm mutation từ TanStack Query
  const { mutate: loginMutation, isPending } = useLogin();

  // Khởi tạo form với React Hook Form & Zod
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  console.log('🛑 Lỗi từ Zod/Form:', errors);

  // Hàm xử lý khi user bấm nút Đăng nhập (Chỉ chạy khi đã qua ải Zod)
  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: () => {
        // Tạm thời router.replace, lát setup Zustand xong sẽ để Zustand tự bế user đi
        router.replace('/(tabs)');
      },
      onError: (error: any) => {
        // Xử lý lỗi trả về từ Backend (Ví dụ: Sai pass, email chưa đăng ký)
        const errorCode = error?.response?.data?.error_code;
        const message = error?.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.';

        if (errorCode === 'INVALID_CREDENTIALS' || error?.response?.status === 401) {
          // Highlight ô email bị lỗi nhưng không hiện text (cho đỡ rối)
          setError('email', { type: 'manual', message: '' });
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
      <AuthBrandHeader title="Đăng nhập" subtitle="Chào mừng bạn quay lại Greenify." />

      <View className="mt-6 gap-4">
        {/* Bọc Input bằng Controller của React Hook Form */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <AuthInput
              ref={ref}
              label="Email"
              placeholder="Nhập email của bạn"
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
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
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
        <Text className="font-inter-medium text-sm text-primary-700">Quên mật khẩu?</Text>
      </Pressable>

      <Button
        title="Đăng nhập"
        className="mt-6"
        // isLoading={isPending} // Bật cái này nếu Component Button của bạn có hỗ trợ xoay xoay
        disabled={isPending}
        onPress={handleSubmit(onSubmit)}
      />

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">Chưa có tài khoản?</Text>
        <Pressable onPress={() => router.push('/(auth)/account-type')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">Đăng ký</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <SocialAuthButtons />
      </View>
    </AuthScaffold>
  );
}

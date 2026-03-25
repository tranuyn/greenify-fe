import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { useMemo, useState } from 'react';

export default function SignupPasswordScreen() {
  const params = useLocalSearchParams<{ role?: string; email?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordError = useMemo(() => {
    if (!confirmPassword) {
      return undefined;
    }

    return password === confirmPassword ? undefined : 'Mật khẩu chưa khớp.';
  }, [confirmPassword, password]);

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title="Mật khẩu"
        subtitle="Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn."
      />

      <View className="gap-4">
        <AuthInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          secureToggle={{
            visible: showPassword,
            onToggle: () => setShowPassword((prev) => !prev),
          }}
        />

        <AuthInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          errorText={passwordError}
          secureToggle={{
            visible: showConfirm,
            onToggle: () => setShowConfirm((prev) => !prev),
          }}
        />
      </View>

      <Button
        title="Xác nhận"
        className="mt-5"
        onPress={() =>
          router.push({
            pathname: '/(auth)/complete-profile',
            params: {
              role: params.role ?? 'citizen',
              email: params.email ?? '',
            },
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

import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { SocialAuthButtons } from 'components/shared/auth/SocialAuthButtons';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  return (
    <AuthScaffold>
      <AuthBrandHeader title="Đăng nhập" subtitle="Chào mừng bạn quay lại Greenify." />

      <View className="gap-4">
        <AuthInput
          label="Email"
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

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
      </View>

      <Pressable className="mt-3 self-end" hitSlop={6}>
        <Text className="text-sm font-inter-medium text-primary-700">Quên mật khẩu?</Text>
      </Pressable>

      <Button
        title="Đăng nhập"
        className="mt-5"
        disabled={!canLogin}
        onPress={() => {
          if (!canLogin) {
            return;
          }

          router.replace('/(tabs)');
        }}
      />

      <View className="mt-5">
        <SocialAuthButtons />
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-sm text-foreground/70">Chưa có tài khoản?</Text>
        <Pressable onPress={() => router.push('/(auth)/account-type')} hitSlop={6}>
          <Text className="text-sm font-inter-semibold text-primary-700">Đăng ký</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { SocialAuthButtons } from 'components/shared/auth/SocialAuthButtons';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { useState } from 'react';

export default function SignupEmailScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const [email, setEmail] = useState('');

  const onContinue = () => {
    router.push({
      pathname: '/(auth)/verify-email',
      params: {
        role: params.role ?? 'citizen',
        email,
      },
    });
  };

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title="Đăng ký tài khoản"
        subtitle="Nhập email hoặc số điện thoại để nhận mã xác thực."
      />

      <AuthInput
        label="Email hoặc số điện thoại"
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Xác thực" className="mt-5" onPress={onContinue} />

      <View className="mt-5">
        <SocialAuthButtons />
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-sm text-foreground/70">Đã có tài khoản?</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="text-sm font-inter-semibold text-primary-700">Đăng nhập</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

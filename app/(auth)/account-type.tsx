import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { ACCOUNT_ROLE_OPTIONS } from '../../constants/auth.constant';
import { Text } from 'components/ui/Text';

type RoleCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  onPress: () => void;
};

function RoleCard({ title, description, icon, onPress }: RoleCardProps) {
  return (
    <Pressable
      className="rounded-2xl border border-primary-200 bg-primary-50 px-4 py-5 active:opacity-90"
      onPress={onPress}
    >
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-xl bg-primary-100">{icon}</View>
      <Text className="text-lg font-inter-bold text-primary-900">{title}</Text>
      <Text className="mt-1 text-sm leading-5 text-foreground/70">{description}</Text>
    </Pressable>
  );
}

export default function AccountTypeScreen() {
  return (
    <AuthScaffold>
      <AuthBrandHeader title="Chọn loại tài khoản" subtitle="Bắt đầu với vai trò phù hợp với bạn." />

      <View className="gap-3">
        <RoleCard
          title={ACCOUNT_ROLE_OPTIONS[0].title}
          description={ACCOUNT_ROLE_OPTIONS[0].description}
          icon={<MaterialCommunityIcons name="office-building-outline" size={22} color="#166534" />}
          onPress={() => router.push({ pathname: '/(auth)/signup-email', params: { role: 'organization' } })}
        />

        <RoleCard
          title={ACCOUNT_ROLE_OPTIONS[1].title}
          description={ACCOUNT_ROLE_OPTIONS[1].description}
          icon={<Ionicons name="leaf-outline" size={22} color="#166534" />}
          onPress={() => router.push({ pathname: '/(auth)/signup-email', params: { role: 'citizen' } })}
        />
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

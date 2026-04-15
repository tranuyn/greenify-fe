import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { Text } from '@/components/ui/Text';
import { ACCOUNT_ROLE_OPTIONS, type AccountRole } from '@/constants/auth.constant';

const ROLE_ICONS: Record<AccountRole, ReactNode> = {
  organization: <MaterialCommunityIcons name="office-building-outline" size={22} color="#166534" />,
  citizen: <Ionicons name="leaf-outline" size={22} color="#166534" />,
};

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
      onPress={onPress}>
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
        {icon}
      </View>
      <Text className="font-inter-bold text-lg text-primary-900">{title}</Text>
      <Text className="text-foreground/70 mt-1 text-sm leading-5">{description}</Text>
    </Pressable>
  );
}

export default function AccountTypeScreen() {
  const { t } = useTranslation();

  return (
    <AuthScaffold>
      <AuthBrandHeader
        title={t('auth.account_type.title')}
        subtitle={t('auth.account_type.subtitle')}
      />

      <View className="mt-6 gap-3">
        {ACCOUNT_ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.role}
            title={
              option.role === 'organization'
                ? t('auth.account_type.role_org_title')
                : t('auth.account_type.role_citizen_title')
            }
            description={
              option.role === 'organization'
                ? t('auth.account_type.role_org_desc')
                : t('auth.account_type.role_citizen_desc')
            }
            icon={ROLE_ICONS[option.role]}
            onPress={() =>
              router.push({
                pathname: '/(auth)/signup-email',
                params: { role: option.role },
              })
            }
          />
        ))}
      </View>

      <View className="mt-8 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">{t('auth.login.no_account')}</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">
            {t('auth.login.title')}
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

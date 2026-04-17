import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { queryClient } from 'lib/queryClient';
import { QUERY_KEYS } from 'constants/queryKeys';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { Text } from '@/components/ui/Text';

import { useCompleteProfile } from '@/hooks/mutations/useAuth';
import type { CompleteProfileFormData } from '@/validations/auth.schema';
import { ProfileForm } from '@/components/shared/auth/ProfileForm';
import { authService } from 'services/auth.service';

export default function CompleteProfileScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ role?: string; identifier?: string }>();

  const { mutate: completeProfile, isPending } = useCompleteProfile();

  const handleCompleteProfile = (data: CompleteProfileFormData) => {
    completeProfile(data, {
      onSuccess: async () => {
        try {
          await queryClient.fetchQuery({
            queryKey: QUERY_KEYS.auth.me(),
            queryFn: async () => {
              return authService.getMe();
            },
          });
        } catch (error) {
          console.warn('Failed to fetch user data:', error);
        }

        router.replace('/(tabs)');
      },
      onError: (err: any) => {
        console.error('Complete profile error:', err?.response?.data || err);
      },
    });
  };

  const roleSubtitle =
    params.role === 'organization'
      ? t('auth.complete_profile.subtitle_org')
      : t('auth.complete_profile.subtitle_citizen');

  return (
    <AuthScaffold>
      <AuthBrandHeader title={t('auth.complete_profile.title')} subtitle={roleSubtitle} />

      {/* Tái sử dụng ProfileForm */}
      <ProfileForm
        email={params.identifier ?? ''}
        isEditMode={false}
        isLoading={isPending}
        onSubmitForm={handleCompleteProfile}
      />

      <View className="z-0 mt-6 flex-row items-center justify-center gap-1">
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

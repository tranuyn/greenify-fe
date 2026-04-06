import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pressable, View } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthBrandHeader } from '@/components/shared/auth/AuthBrandHeader';
import { AuthInput } from '@/components/shared/auth/AuthInput';
import { AuthScaffold } from '@/components/shared/auth/AuthScaffold';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { DropdownPicker } from '@/components/ui/DropdownPicker';

import { useCompleteProfile } from '@/hooks/mutations/useAuth';
import { useProvinces, useWards } from '@/hooks/queries/useLocation';
import { completeProfileSchema, type CompleteProfileFormData } from '@/validations/auth.schema';

export default function CompleteProfileScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ role?: string; email?: string }>();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const { mutate: completeProfile, isPending } = useCompleteProfile();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      display_name: '',
      province: '',
    },
  });

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [showProvince, setShowProvince] = useState(false);
  const [showWard, setShowWard] = useState(false);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: wards = [] } = useWards(selectedProvinceCode);

  const onSubmit = (data: CompleteProfileFormData) => {
    if (!acceptedTerms) {
      setTermsError(true);
      return;
    }

    completeProfile(data, {
      onSuccess: () => {
        router.replace('/(tabs)');
      },
      onError: (err: any) => {
        console.error('Complete profile error:', err);
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

      <View className="mb-5 mt-4 items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <FontAwesome5 name="user" size={32} color="#166534" />
        </View>
      </View>

      <View className="gap-4">
        <AuthInput
          label={t('auth.complete_profile.email_label')}
          value={params.email ?? ''}
          editable={false}
          placeholder="email@greenify.app"
        />

        <Controller
          control={control}
          name="display_name"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.complete_profile.name_label')}
              placeholder={t('auth.complete_profile.name_placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.display_name?.message}
            />
          )}
        />

        <View className="z-10">
          <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
            {t('auth.complete_profile.province_label')}
          </Text>
          <DropdownPicker
            label={t('auth.complete_profile.province_label')}
            value={watch('province')}
            options={provinces}
            isLoading={loadingProvinces}
            isOpen={showProvince}
            onToggle={() => {
              setShowProvince((p) => !p);
              setShowWard(false);
            }}
            onSelect={(opt) => {
              setValue('province', opt.name, { shouldValidate: true });
              setSelectedProvinceCode(opt.code);
              setValue('ward', '');
              setShowProvince(false);
            }}
            errorText={errors.province?.message}
          />

          <View className="mt-4">
            <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
              {t('auth.complete_profile.ward_label')}
            </Text>
            <DropdownPicker
              label={t('auth.complete_profile.ward_label')}
              value={watch('ward') ?? ''}
              options={wards}
              disabled={!selectedProvinceCode}
              isOpen={showWard}
              onToggle={() => {
                setShowWard((p) => !p);
                setShowProvince(false);
              }}
              onSelect={(opt) => {
                setValue('ward', opt.name);
                setShowWard(false);
              }}
              errorText={errors.ward?.message}
            />
          </View>
        </View>
      </View>

      <Pressable
        className="z-0 mt-6 flex-row items-start"
        onPress={() => {
          setAcceptedTerms((prev) => !prev);
          setTermsError(false);
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: acceptedTerms }}>
        <View
          className={`mr-2 mt-0.5 h-5 w-5 items-center justify-center rounded border ${
            acceptedTerms
              ? 'border-primary-700 bg-primary-700'
              : termsError
                ? 'border-rose-400 bg-white'
                : 'border-primary-300 bg-white'
          }`}>
          {acceptedTerms && <Ionicons name="checkmark" size={13} color="white" />}
        </View>
        <Text className="text-foreground/70 flex-1 text-xs leading-5">
          {t('auth.complete_profile.terms_agree')}{' '}
          <Text className="font-inter-medium text-primary-700">
            {t('auth.complete_profile.terms_use')}
          </Text>{' '}
          {t('auth.complete_profile.terms_and')}{' '}
          <Text className="font-inter-medium text-primary-700">
            {t('auth.complete_profile.terms_privacy')}
          </Text>{' '}
          {t('auth.complete_profile.terms_of')}
        </Text>
      </Pressable>

      {termsError && (
        <Text className="mt-1 text-xs text-rose-600">{t('auth.complete_profile.terms_error')}</Text>
      )}

      <Button
        title={t('auth.complete_profile.submit_btn')}
        className="z-0 mt-6"
        isLoading={isPending}
        onPress={handleSubmit(onSubmit)}
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

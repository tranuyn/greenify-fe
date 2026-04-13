import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { AuthInput } from '@/components/shared/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { DropdownPicker } from '@/components/ui/DropdownPicker';

import { useProvinces, useWards } from '@/hooks/queries/useLocation';
import { completeProfileSchema, type CompleteProfileFormData } from '@/validations/auth.schema';

export interface ProfileFormProps {
  initialValues?: Partial<CompleteProfileFormData>;
  email: string;
  isEditMode?: boolean;
  onSubmitForm: (data: CompleteProfileFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProfileForm({
  initialValues,
  email,
  isEditMode = false,
  onSubmitForm,
  onCancel,
  isLoading = false,
}: ProfileFormProps) {
  const { t } = useTranslation();

  // Trạng thái điều khoản sử dụng (ẩn hoặc mặc định true nếu đang ở chế độ Edit)
  const [acceptedTerms, setAcceptedTerms] = useState(isEditMode);
  const [termsError, setTermsError] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      display_name: initialValues?.display_name || '',
      province: initialValues?.province || '',
      ward: initialValues?.ward || '',
    },
  });

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [showProvince, setShowProvince] = useState(false);
  const [showWard, setShowWard] = useState(false);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: wards = [] } = useWards(selectedProvinceCode);

  const onSubmit = (data: CompleteProfileFormData) => {
    // Nếu là màn hình đăng ký và chưa đồng ý điều khoản -> Báo lỗi
    if (!isEditMode && !acceptedTerms) {
      setTermsError(true);
      return;
    }
    onSubmitForm(data);
  };

  return (
    <View className="w-full">
      {/* Avatar Section */}
      <View className="mb-5 mt-4 items-center">
        <View className="relative h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <FontAwesome5 name="user" size={32} color="#166534" />
          {/* Nút chỉnh sửa avatar (Chỉ hiện khi đang ở chế độ cập nhật, hoặc bạn có thể cho hiện luôn) */}
          {isEditMode && (
            <View className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-800">
              <FontAwesome5 name="pen" size={10} color="white" />
            </View>
          )}
        </View>
      </View>

      <View className="gap-4">
        {/* Email Input - Luôn Readonly */}
        <AuthInput
          label={t('auth.complete_profile.email_label')}
          value={email}
          editable={false}
          placeholder="email@greenify.app"
        />

        {/* Name Input */}
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

        {/* Location Pickers */}
        <View className="z-10">
          {/* <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
            {t('auth.complete_profile.province_label')}
          </Text> */}
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
              setValue('ward', ''); // Reset ward khi đổi province
              setShowProvince(false);
            }}
            errorText={errors.province?.message}
          />

          <View className="mt-4">
            {/* <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
              {t('auth.complete_profile.ward_label')}
            </Text> */}
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

      {/* Điều khoản sử dụng - Chỉ hiện khi ở màn hình Tạo tài khoản */}

      <>
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
          <Text className="mt-1 text-xs text-rose-600">
            {t('auth.complete_profile.terms_error')}
          </Text>
        )}
      </>

      {/* Buttons Render Area */}
      <View className="z-0 mt-6">
        {isEditMode ? (
          // Layout 2 nút: Hủy & Xác nhận (Cho màn hình Edit Profile)
          <View className="flex-row gap-4">
            <Button
              title="Hủy"
              onPress={onCancel}
              className="flex-1 border-0 bg-green-100"
              textClassName="text-green-800 font-inter-semibold"
            />
            <Button
              title="Xác nhận"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              className="flex-1"
            />
          </View>
        ) : (
          // Layout 1 nút: Tạo tài khoản (Cho màn hình Complete Profile)
          <Button
            title={t('auth.complete_profile.submit_btn')}
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </View>
    </View>
  );
}

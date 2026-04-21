import React, { useEffect, useState } from 'react';
import { View, Pressable, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { AuthInput } from '@/components/shared/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { DropdownPicker } from '@/components/ui/DropdownPicker';
import ProvincePicker from '@/components/ui/ProvincePicker';
import { uploadService } from '@/services/upload.service';
import type { CompleteProfileRequest } from '@/types/user.type';

import { useProvinces, useWards } from '@/hooks/queries/useLocation';
import { completeProfileSchema, type CompleteProfileFormData } from '@/validations/auth.schema';

export interface ProfileFormProps {
  initialValues?: Partial<CompleteProfileRequest>;
  initialAvatarUrl?: string | null;
  email: string;
  isEditMode?: boolean;
  onSubmitForm: (data: CompleteProfileRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ProfileForm({
  initialValues,
  initialAvatarUrl,
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState<{
    uri: string;
    fileName?: string;
    mimeType?: string;
    isLocal: boolean;
  } | null>(
    initialAvatarUrl
      ? { uri: initialAvatarUrl, isLocal: false }
      : initialValues?.avatar?.imageUrl
        ? { uri: initialValues.avatar.imageUrl, isLocal: false }
        : null
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      displayName: initialValues?.displayName || '',
      province: initialValues?.province || '',
      ward: initialValues?.ward || '',
    },
  });

  useEffect(() => {
    reset({
      displayName: initialValues?.displayName || '',
      province: initialValues?.province || '',
      ward: initialValues?.ward || '',
    });
  }, [initialValues?.displayName, initialValues?.province, initialValues?.ward, reset]);

  useEffect(() => {
    if (!avatar?.isLocal && initialAvatarUrl) {
      setAvatar({ uri: initialAvatarUrl, isLocal: false });
    }
  }, [initialAvatarUrl, avatar?.isLocal]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [showWard, setShowWard] = useState(false);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: wards = [] } = useWards(selectedProvinceCode);

  useEffect(() => {
    if (!initialValues?.province || provinces.length === 0) return;
    const matchedProvince = provinces.find(
      (province) =>
        province.name.trim().toLowerCase() === initialValues.province?.trim().toLowerCase()
    );
    if (matchedProvince && matchedProvince.code !== selectedProvinceCode) {
      setSelectedProvinceCode(matchedProvince.code);
    }
  }, [initialValues?.province, provinces, selectedProvinceCode]);

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thiếu quyền', 'Vui lòng cho phép truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAvatar({
        uri: asset.uri,
        fileName: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
        isLocal: true,
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thiếu quyền', 'Vui lòng cho phép truy cập camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAvatar({
        uri: asset.uri,
        fileName: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
        isLocal: true,
      });
    }
  };

  const onPickAvatar = () => {
    Alert.alert('Cập nhật avatar', 'Chọn nguồn ảnh', [
      { text: 'Chụp ảnh', onPress: takePhoto },
      { text: 'Thư viện', onPress: pickFromLibrary },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const onSubmit = async (data: CompleteProfileFormData) => {
    // Nếu là màn hình đăng ký và chưa đồng ý điều khoản -> Báo lỗi
    if (!isEditMode && !acceptedTerms) {
      setTermsError(true);
      return;
    }

    const payload: CompleteProfileRequest = {
      displayName: data.displayName,
      province: data.province,
      ward: data.ward,
      district: initialValues?.district ?? '',
      addressDetail: initialValues?.addressDetail ?? '',
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
    };

    try {
      if (avatar?.isLocal) {
        setIsUploadingAvatar(true);
        const uploadedResult = (await uploadService.uploadFile({
          uri: avatar.uri,
          name: avatar.fileName,
          type: avatar.mimeType,
        })) as any;
        const uploaded = Array.isArray(uploadedResult) ? uploadedResult[0] : uploadedResult;
        if (!uploaded?.imageUrl) {
          throw new Error('Upload response missing imageUrl');
        }

        payload.avatar = {
          bucketName: uploaded.bucketName ?? '',
          objectKey: uploaded.objectKey ?? '',
          imageUrl: uploaded.imageUrl,
        };
      } else if (avatar?.uri) {
        payload.avatar = {
          bucketName: initialValues?.avatar?.bucketName ?? '',
          objectKey: initialValues?.avatar?.objectKey ?? '',
          imageUrl: avatar.uri,
        };
      }

      onSubmitForm(payload);
    } catch (error: any) {
      Alert.alert('Upload thất bại', error?.response?.data?.message || 'Không thể tải ảnh lên.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <View className="w-full">
      {/* Avatar Section */}
      <View className="mb-5 mt-4 items-center">
        <View className="relative h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          {avatar?.uri ? (
            <Image source={{ uri: avatar.uri }} className="h-16 w-16 rounded-full" />
          ) : (
            <FontAwesome5 name="user" size={32} color="#166534" />
          )}
          {/* Nút chỉnh sửa avatar (Chỉ hiện khi đang ở chế độ cập nhật, hoặc bạn có thể cho hiện luôn) */}
          <Pressable
            onPress={onPickAvatar}
            className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-800">
            <FontAwesome5 name="pen" size={10} color="white" />
          </Pressable>
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
          name="displayName"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label={t('auth.complete_profile.name_label')}
              placeholder={t('auth.complete_profile.name_placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.displayName?.message}
            />
          )}
        />

        {/* Location Pickers */}
        <View className="relative z-10">
          {/* BỌC PROVINCE: Cấp cho nó z-index và elevation cao nhất (VD: 50) */}
          <View className="relative z-50" style={{ elevation: 50, zIndex: 50 }}>
            <ProvincePicker
              label={t('auth.complete_profile.province_label')}
              value={watch('province')}
              onChange={(provinceName) => {
                setValue('province', provinceName, { shouldValidate: true });
                const matchedProvince = provinces.find(
                  (province) =>
                    province.name.trim().toLowerCase() === provinceName.trim().toLowerCase()
                );
                setSelectedProvinceCode(matchedProvince?.code ?? '');
                setValue('ward', '', { shouldValidate: true });
                setShowWard(false);
              }}
            />
          </View>

          {/* BỌC WARD: Cấp cho nó z-index và elevation thấp hơn cái ở trên (VD: 40) */}
          <View className="relative z-40 mt-4" style={{ elevation: 40, zIndex: 40 }}>
            <DropdownPicker
              label={t('auth.complete_profile.ward_label')}
              value={watch('ward') ?? ''}
              options={wards}
              disabled={!selectedProvinceCode}
              isOpen={showWard}
              onToggle={() => {
                setShowWard((p) => !p);
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
              isLoading={isLoading || isUploadingAvatar}
              className="flex-1"
            />
          </View>
        ) : (
          // Layout 1 nút: Tạo tài khoản (Cho màn hình Complete Profile)
          <Button
            title={t('auth.complete_profile.submit_btn')}
            isLoading={isLoading || isUploadingAvatar}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </View>
    </View>
  );
}

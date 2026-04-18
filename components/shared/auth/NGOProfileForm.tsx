import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { AuthInput } from '@/components/shared/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import { DropdownPicker } from '@/components/ui/DropdownPicker';
import { Text } from '@/components/ui/Text';
import { useProvinces, useWards } from '@/hooks/queries/useLocation';
import { uploadService } from '@/services/upload.service';
import type { CreateNgoProfileRequest } from '@/types/user.type';
import type { MediaDto } from '@/types/media.types';

type NGOProfileFormData = {
  orgName: string;
  representativeName: string;
  hotline: string;
  contactEmail: string;
  description: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  latitude: string;
  longitude: string;
};

type UploadAsset = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type Props = {
  email: string;
  isLoading?: boolean;
  onSubmitForm: (data: CreateNgoProfileRequest) => void;
};

const toMediaDto = (media?: MediaDto | null): MediaDto => ({
  bucketName: media?.bucketName ?? '',
  objectKey: media?.objectKey ?? '',
  imageUrl: media?.imageUrl ?? '',
});

export function NGOProfileForm({ email, isLoading = false, onSubmitForm }: Props) {
  const { t } = useTranslation();

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [showProvince, setShowProvince] = useState(false);
  const [showWard, setShowWard] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<UploadAsset | null>(null);
  const [verificationDocs, setVerificationDocs] = useState<UploadAsset[]>([]);

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: wards = [] } = useWards(selectedProvinceCode);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NGOProfileFormData>({
    defaultValues: {
      orgName: '',
      representativeName: '',
      hotline: '',
      contactEmail: email,
      description: '',
      province: '',
      district: '',
      ward: '',
      addressDetail: '',
      latitude: '',
      longitude: '',
    },
  });

  const pickImageAsset = async (fromCamera: boolean, allowCrop = false) => {
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thiếu quyền', 'Vui lòng cho phép truy cập camera.');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: allowCrop,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) return result.assets[0];
      return null;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thiếu quyền', 'Vui lòng cho phép truy cập thư viện ảnh.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: allowCrop,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) return result.assets[0];
    return null;
  };

  const showImageSourcePicker = (onSelect: (fromCamera: boolean) => void) => {
    Alert.alert('Chọn nguồn ảnh', 'Bạn muốn lấy ảnh từ đâu?', [
      { text: 'Chụp ảnh', onPress: () => onSelect(true) },
      { text: 'Thư viện', onPress: () => onSelect(false) },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const pickAvatar = async () => {
    showImageSourcePicker(async (fromCamera) => {
      const asset = await pickImageAsset(fromCamera, true);
      if (!asset) return;

      setAvatarFile({
        uri: asset.uri,
        fileName: asset.fileName ?? `ngo-avatar-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
    });
  };

  const pickVerificationDoc = async () => {
    showImageSourcePicker(async (fromCamera) => {
      const asset = await pickImageAsset(fromCamera);
      if (!asset) return;

      setVerificationDocs((prev) => [
        ...prev,
        {
          uri: asset.uri,
          fileName: asset.fileName ?? `ngo-doc-${Date.now()}.jpg`,
          mimeType: asset.mimeType ?? 'image/jpeg',
        },
      ]);
    });
  };

  const removeDoc = (index: number) => {
    setVerificationDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadOneFile = async (file: UploadAsset) => {
    const uploaded = await uploadService.uploadFile({
      uri: file.uri,
      name: file.fileName,
      type: file.mimeType,
    });
    return uploaded;
  };

  const onSubmit = async (data: NGOProfileFormData) => {
    if (!avatarFile) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn avatar cho tổ chức.');
      return;
    }

    if (verificationDocs.length === 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng thêm ít nhất 1 tài liệu xác minh.');
      return;
    }

    // const latitude = Number(data.latitude);
    // const longitude = Number(data.longitude);

    // if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    //   Alert.alert('Dữ liệu không hợp lệ', 'Vĩ độ và kinh độ phải là số hợp lệ.');
    //   return;
    // }

    try {
      setIsUploading(true);

      const [uploadedAvatar, ...uploadedDocs] = await Promise.all([
        uploadOneFile(avatarFile),
        ...verificationDocs.map(uploadOneFile),
      ]);

      const payload: CreateNgoProfileRequest = {
        orgName: data.orgName.trim(),
        representativeName: data.representativeName.trim(),
        hotline: data.hotline.trim(),
        contactEmail: data.contactEmail.trim(),
        description: data.description.trim(),
        address: {
          province: data.province.trim(),
          district: data.district.trim(),
          ward: data.ward.trim(),
          addressDetail: data.addressDetail.trim(),
          latitude: 0,
          longitude: 0,
        },
        avatar: uploadedAvatar,
        verificationDocs: uploadedDocs,
      };

      onSubmitForm(payload);
    } catch (error: any) {
      Alert.alert('Upload thất bại', error?.response?.data?.message || 'Không thể tải tệp lên.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
      <View className="mb-5 mt-4 items-center">
        <View className="relative h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          {avatarFile?.uri ? (
            <Image source={{ uri: avatarFile.uri }} className="h-16 w-16 rounded-full" />
          ) : (
            <FontAwesome5 name="building" size={28} color="#166534" />
          )}
          <Pressable
            onPress={pickAvatar}
            className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-800">
            <FontAwesome5 name="pen" size={10} color="white" />
          </Pressable>
        </View>
        <Text className="text-foreground/60 mt-2 text-xs">Avatar tổ chức</Text>
      </View>

      <View className="gap-4">
        <AuthInput
          label={t('auth.complete_profile.email_label')}
          value={email}
          editable={false}
          placeholder="email@greenify.app"
        />

        <Controller
          control={control}
          name="orgName"
          rules={{ required: 'Vui lòng nhập tên tổ chức' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Tên tổ chức"
              placeholder="Nhập tên tổ chức"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.orgName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="representativeName"
          rules={{ required: 'Vui lòng nhập người đại diện' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Người đại diện"
              placeholder="Nhập tên người đại diện"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.representativeName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="hotline"
          rules={{ required: 'Vui lòng nhập hotline' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Hotline"
              placeholder="Nhập hotline"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.hotline?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="contactEmail"
          rules={{ required: 'Vui lòng nhập email liên hệ' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Email liên hệ"
              placeholder="Nhập email liên hệ"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.contactEmail?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          rules={{ required: 'Vui lòng nhập mô tả' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Mô tả tổ chức"
              placeholder="Nhập mô tả"
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="py-3"
              errorText={errors.description?.message}
            />
          )}
        />

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
            setValue('ward', '', { shouldValidate: true });
            setShowProvince(false);
          }}
          errorText={errors.province?.message}
        />

        <DropdownPicker
          label={t('auth.complete_profile.ward_label')}
          value={watch('ward')}
          options={wards}
          disabled={!selectedProvinceCode}
          isOpen={showWard}
          onToggle={() => {
            setShowWard((p) => !p);
            setShowProvince(false);
          }}
          onSelect={(opt) => {
            setValue('ward', opt.name, { shouldValidate: true });
            setShowWard(false);
          }}
          errorText={errors.ward?.message}
        />

        <Controller
          control={control}
          name="addressDetail"
          rules={{ required: 'Vui lòng nhập địa chỉ chi tiết' }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <AuthInput
              ref={ref}
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.addressDetail?.message}
            />
          )}
        />
      </View>

      <View className="mt-5 rounded-xl border border-primary-100 bg-primary-50 p-3">
        <Text className="font-inter-medium text-sm text-foreground">Tài liệu xác minh</Text>

        {verificationDocs.length === 0 ? (
          <Text className="text-foreground/60 mt-2 text-xs">Chưa có tài liệu nào được chọn.</Text>
        ) : (
          verificationDocs.map((doc, index) => (
            <View
              key={`${doc.uri}-${index}`}
              className="mt-2 flex-row items-center justify-between">
              <Text className="flex-1 text-xs text-foreground" numberOfLines={1}>
                {doc.fileName ?? `Tài liệu ${index + 1}`}
              </Text>
              <Pressable onPress={() => removeDoc(index)} hitSlop={6}>
                <Ionicons name="close-circle" size={18} color="#dc2626" />
              </Pressable>
            </View>
          ))
        )}

        <Pressable
          onPress={pickVerificationDoc}
          className="mt-3 flex-row items-center justify-center rounded-lg border border-primary-300 bg-white px-3 py-2">
          <Ionicons name="add" size={16} color="#166534" />
          <Text className="ml-1 font-inter-medium text-xs text-primary-700">Thêm tài liệu</Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <Button
          title="Tạo tài khoản Tổ chức"
          isLoading={isLoading || isUploading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
}

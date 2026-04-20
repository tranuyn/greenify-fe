import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { reverseGeocodeWithCache } from '@/utils/reverseGeocode.util';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import ProvincePicker from '@/components/ui/ProvincePicker';
import { Text } from '@/components/ui/Text';
import { useCreateTrashSpotReport } from '@/hooks/mutations/useTrashReports';
import { useWasteTypes } from '@/hooks/queries/useMap';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { uploadService } from '@/services/upload.service';
import type { MediaDto } from '@/types/media.types';

type SelectedImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

const DEFAULT_LATITUDE = '10.7769';
const DEFAULT_LONGITUDE = '106.7009';

export default function CreateTrashSpotScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { data: wasteTypes = [] } = useWasteTypes();
  const { mutateAsync: createTrashSpot, isPending } = useCreateTrashSpotReport();
  const isMountedRef = useRef(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [province, setProvince] = useState(t('coexistence.create_trash_spot.default_province'));
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [selectedWasteTypeIds, setSelectedWasteTypeIds] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const selectedWasteTypeNames = useMemo(
    () =>
      selectedWasteTypeIds
        .map((id) => wasteTypes.find((item) => item.id === id)?.name)
        .filter(Boolean)
        .join(', '),
    [selectedWasteTypeIds, wasteTypes]
  );

  const addImages = useCallback((assets: ImagePicker.ImagePickerAsset[]) => {
    setSelectedImages((prev) => [
      ...prev,
      ...assets.map((asset) => ({
        uri: asset.uri,
        fileName: asset.fileName ?? `trash-spot-${Date.now()}.jpg`,
        mimeType: asset.mimeType ?? 'image/jpeg',
      })),
    ]);
  }, []);

  const handleTakePhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t('coexistence.create_trash_spot.alert_error_title'),
          t('coexistence.create_trash_spot.camera_permission_required')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets.length > 0) {
        addImages(result.assets);
      }
    } catch (error) {
      console.error('Failed to open camera picker:', error);
      Alert.alert(
        t('coexistence.create_trash_spot.alert_error_title'),
        t('coexistence.create_trash_spot.create_error')
      );
    }
  }, [addImages]);

  const handlePickImagesFromLibrary = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t('coexistence.create_trash_spot.alert_error_title'),
          t('coexistence.create_trash_spot.library_permission_required')
        );
        return;
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 0,
        quality: 0.8,
      };

      if (Platform.OS === 'ios') {
        (pickerOptions as any).preferredAssetRepresentationMode = 'compatible';
      }

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets.length > 0) {
        addImages(result.assets);
      }
    } catch (error: any) {
      console.error('Failed to read picked image:', error);
      Alert.alert(
        t('coexistence.create_trash_spot.alert_error_title'),
        error?.message || t('coexistence.create_trash_spot.create_error')
      );
    }
  }, [addImages]);

  const handleOpenImageSourcePicker = useCallback(() => {
    Alert.alert(
      t('coexistence.create_trash_spot.image_source_title'),
      t('coexistence.create_trash_spot.image_source_message'),
      [
        {
          text: t('coexistence.create_trash_spot.pick_camera'),
          onPress: () => void handleTakePhoto(),
        },
        {
          text: t('coexistence.create_trash_spot.pick_library'),
          onPress: () => void handlePickImagesFromLibrary(),
        },
        { text: t('coexistence.create_trash_spot.cancel'), style: 'cancel' },
      ]
    );
  }, [handlePickImagesFromLibrary, handleTakePhoto, t]);

  const toggleWasteType = useCallback((id: string) => {
    setSelectedWasteTypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const resolveCurrentLocation = useCallback(async () => {
    try {
      setIsLocating(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          t('coexistence.create_trash_spot.alert_error_title'),
          t('coexistence.create_trash_spot.location_permission_required')
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocoded = await reverseGeocodeWithCache({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const first = geocoded[0];

      if (!isMountedRef.current) {
        return;
      }

      setLatitude(position.coords.latitude.toFixed(6));
      setLongitude(position.coords.longitude.toFixed(6));
      setProvince((current) => first?.region || first?.city || first?.district || current);
    } catch (error) {
      console.error('Failed to get current location:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLocating(false);
      }
    }
  }, [t]);

  useEffect(() => {
    void resolveCurrentLocation();

    return () => {
      isMountedRef.current = false;
    };
  }, [resolveCurrentLocation]);

  const handleSubmit = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!trimmedName) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_info_title'),
        t('coexistence.create_trash_spot.require_name')
      );
      return;
    }

    if (!trimmedDescription) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_info_title'),
        t('coexistence.create_trash_spot.require_description')
      );
      return;
    }

    if (!province.trim()) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_info_title'),
        t('coexistence.create_trash_spot.require_province')
      );
      return;
    }

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_info_title'),
        t('coexistence.create_trash_spot.require_valid_coordinates')
      );
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_image_title'),
        t('coexistence.create_trash_spot.require_image')
      );
      return;
    }

    if (selectedWasteTypeIds.length === 0) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_missing_waste_type_title'),
        t('coexistence.create_trash_spot.require_waste_type')
      );
      return;
    }

    try {
      const uploadedImages: MediaDto[] = await Promise.all(
        selectedImages.map((image) =>
          uploadService.uploadFile({
            uri: image.uri,
            name: image.fileName,
            type: image.mimeType,
          })
        )
      );

      await createTrashSpot({
        name: trimmedName,
        description: trimmedDescription,
        images: uploadedImages,
        province: province.trim(),
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        wasteTypeIds: selectedWasteTypeIds,
      });

      Alert.alert(
        t('coexistence.create_trash_spot.alert_success_title'),
        t('coexistence.create_trash_spot.create_success')
      );
      router.back();
    } catch (error: any) {
      Alert.alert(
        t('coexistence.create_trash_spot.alert_error_title'),
        error?.response?.data?.message ||
          error?.message ||
          t('coexistence.create_trash_spot.create_error')
      );
    }
  }, [
    createTrashSpot,
    description,
    latitude,
    longitude,
    name,
    province,
    selectedImages,
    selectedWasteTypeIds,
    t,
  ]);

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          className="border-b border-primary bg-background px-5 pb-4"
          style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/5">
              <Feather name="chevron-left" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="font-inter-bold text-xl text-foreground">
              {t('coexistence.create_trash_spot.title')}
            </Text>
            <View className="h-10 w-10" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 140 }}>
          <View className="mb-4 rounded-3xl bg-background p-4 shadow-sm shadow-black/5">
            <Text className="mb-3 font-inter-bold text-base text-foreground">
              {t('coexistence.create_trash_spot.image_section_title')}
            </Text>

            {selectedImages.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-x-3">
                  {selectedImages.map((image, index) => (
                    <View
                      key={`${image.uri}-${index}`}
                      className="relative h-40 w-40 overflow-hidden rounded-2xl">
                      <Image
                        source={{ uri: image.uri }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedImages((prev) =>
                            prev.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/55">
                        <Feather name="x" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={handleOpenImageSourcePicker}
                    className="h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-primary-50">
                    <Feather name="plus" size={24} color={colors.primary} />
                    <Text className="text-foreground/60 mt-2 font-inter-medium text-xs">
                      {t('coexistence.create_trash_spot.add_image')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <TouchableOpacity
                onPress={handleOpenImageSourcePicker}
                className="h-48 items-center justify-center overflow-hidden rounded-3xl bg-primary-50">
                <View className="items-center px-6">
                  <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Feather name="image" size={22} color={colors.primary} />
                  </View>
                  <Text className="text-foreground/60 text-center font-inter-medium text-sm">
                    {t('coexistence.create_trash_spot.image_hint')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View className="gap-y-4 rounded-3xl bg-background p-4 shadow-sm shadow-black/5">
            <View>
              <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
                {t('coexistence.create_trash_spot.name_label')}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('coexistence.create_trash_spot.name_placeholder')}
                className="rounded-2xl border border-muted-foreground px-4 py-3 font-inter text-base text-foreground"
              />
            </View>

            <View>
              <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">
                {t('coexistence.create_trash_spot.description_label')}
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('coexistence.create_trash_spot.description_placeholder')}
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                className="min-h-[110px] rounded-2xl border border-muted-foreground px-4 py-3 font-inter text-base text-foreground"
              />
            </View>

            <View className="z-1000">
              <ProvincePicker
                label={t('coexistence.create_trash_spot.province_label')}
                value={province}
                onChange={setProvince}
              />
            </View>

            <View className="flex-row items-center justify-center rounded-2xl bg-neutral-200 px-4 py-3">
              <Feather name="crosshair" size={16} color={colors.foreground} />
              <Text className="ml-2 font-inter-medium text-sm text-foreground">
                {isLocating
                  ? t('coexistence.create_trash_spot.locating')
                  : t('coexistence.create_trash_spot.locate_current')}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="mb-2 font-inter-bold text-base text-foreground">
              {t('coexistence.create_trash_spot.waste_type_label')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-x-2">
                {wasteTypes.map((item) => {
                  const isSelected = selectedWasteTypeIds.includes(item.id);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => toggleWasteType(item.id)}
                      className={`rounded-full border px-4 py-2 ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground bg-background'
                      }`}>
                      <Text
                        className={`font-inter-medium text-sm ${
                          isSelected ? 'text-on-primary' : 'text-foreground'
                        }`}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {selectedWasteTypeNames ? (
              <Text className="text-foreground/50 mt-2 font-inter text-xs">
                {t('coexistence.create_trash_spot.selected_waste_types', {
                  value: selectedWasteTypeNames,
                })}
              </Text>
            ) : null}
          </View>

          <Button
            title={t('coexistence.create_trash_spot.submit')}
            onPress={handleSubmit}
            isLoading={isPending}
            iconLeft={<Feather name="plus" size={18} color="#fff" />}
            className="mt-6"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

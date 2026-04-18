import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Animated,
  Keyboard,
  Text,
  Alert,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import ExpandingInput from './components/ExpandingInput';
import ActionBottomSheet from './components/ActionBottomSheet';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { IMAGES } from '@/constants/linkMedia';
import { useActionTypes } from '@/hooks/queries/usePosts';
import { useCreatePost } from '@/hooks/mutations/usePosts';
import { useUpload } from '@/hooks/mutations/useUpload';
import { queryClient } from 'lib/queryClient';
import { QUERY_KEYS } from 'constants/queryKeys';

export default function PreviewScreen() {
  const { t } = useTranslation();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [description, setDescription] = useState('');
  const [selectedActionTypeId, setSelectedActionTypeId] = useState<string>('');
  const [isSavingImage, setIsSavingImage] = useState(false);
  // 1. Khai báo Ref cho Modal
  const { data: userProfile } = useCurrentUser();
  const { data: actionTypes = [] } = useActionTypes();
  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUpload();
  const animWidth = useRef(new Animated.Value(150)).current;

  const actionSheetRef = useRef<any>(null);

  const selectedActionType = useMemo(
    () => actionTypes.find((type) => type.id === selectedActionTypeId) ?? null,
    [actionTypes, selectedActionTypeId]
  );

  const handleCreatePost = async () => {
    if (!imageUri || typeof imageUri !== 'string') {
      Alert.alert(
        t('photograph.preview.download.unavailable_title'),
        t('photograph.preview.download.unavailable_message')
      );
      return;
    }

    let latitude = 0;
    let longitude = 0;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const uploadedMedia = await uploadFile({
        uri: imageUri,
      });

      await createPost({
        action_type_id: selectedActionTypeId,
        caption: description.trim(),
        media_url: uploadedMedia.imageUrl,
        media_bucket: uploadedMedia.bucketName,
        media_key: uploadedMedia.objectKey,
        latitude,
        longitude,
        action_date: new Date().toISOString().slice(0, 10),
      });

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all });
      router.back();
    } catch (error: any) {
      console.error('Create post error:', error.response || error);
      Alert.alert('Không thể đăng bài', 'Vui lòng thử lại sau.');
    }
  };

  const handleDownloadImage = async () => {
    if (!imageUri || typeof imageUri !== 'string') {
      Alert.alert(
        t('photograph.preview.download.unavailable_title'),
        t('photograph.preview.download.unavailable_message')
      );
      return;
    }

    try {
      setIsSavingImage(true);
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          t('photograph.preview.download.permission_title'),
          t('photograph.preview.download.permission_message')
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(imageUri);
      Alert.alert(
        t('photograph.preview.download.success_title'),
        t('photograph.preview.download.success_message')
      );
    } catch (error: any) {
      console.error('Lỗi khi lưu ảnh:', error.response || error);
      Alert.alert(
        t('photograph.preview.download.error_title'),
        t('photograph.preview.download.error_message')
      );
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, marginBottom: 100 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10">
          {/* --- CỤM 1: TOP BAR --- */}
          <View className="flex-row items-center justify-between px-6">
            <TouchableOpacity
              className="rounded-full bg-white/10 p-3"
              onPress={() => router.replace('/(tabs)/community')}>
              <Ionicons name="grid" size={24} color="white" />
            </TouchableOpacity>

            <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
              <Image
                source={{ uri: userProfile?.userProfile?.avatarUrl || IMAGES.treeAvatar }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity
              onPress={handleDownloadImage}
              disabled={isSavingImage}
              className={`rounded-2xl bg-white/10 p-3 shadow-sm ${isSavingImage ? 'opacity-60' : ''}`}>
              <Feather name="download" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* --- CỤM 2: ẢNH VÀ INPUT --- */}
          <View>
            <View className="relative mx-4 aspect-square w-[calc(100%-32px)] overflow-hidden rounded-[40px] border border-neutral-500">
              <Image source={{ uri: imageUri }} className="flex-1" />
              <ExpandingInput
                description={description}
                setDescription={setDescription}
                animWidth={animWidth}
              />
            </View>

            {selectedActionType ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4 h-10 px-4">
                {selectedActionType && (
                  <View className="mr-2 flex-row items-center rounded-full bg-green-800 px-3 py-1">
                    <Text className="font-inter text-xs text-white">
                      {selectedActionType.action_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedActionTypeId('')}
                      hitSlop={8}
                      className="ml-2 rounded-full bg-white/20 p-0.5">
                      <Ionicons name="close" size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            ) : null}
          </View>

          {/* --- CỤM 3: BOTTOM BAR --- */}
          <View className="flex-row items-center justify-between px-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={isCreatingPost || isUploading}
              className={`h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-xl ${
                isCreatingPost || isUploading ? 'opacity-60' : ''
              }`}>
              <Ionicons name="send" size={32} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* SỬA: Chuyển onPress từ MaterialIcons sang TouchableOpacity */}
            {/* BOTTOM BAR... */}
            <TouchableOpacity onPress={() => actionSheetRef.current?.present()}>
              <MaterialIcons name="draw" size={30} color="white" />
            </TouchableOpacity>

            {/* BOTTOM SHEETS */}
            <ActionBottomSheet
              ref={actionSheetRef}
              actionTypes={actionTypes}
              selectedActionTypeId={selectedActionTypeId}
              onSelectActionType={setSelectedActionTypeId}
            />
            {/* <LocationBottomSheet ref={locationSheetRef} onSelect={(loc) => setLocation(loc)} /> */}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}

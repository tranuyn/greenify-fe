import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Animated,
  Keyboard,
  Text,
  Platform,
  // Thêm Platform để check OS nếu cần
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// SỬA: Import đúng các component cần dùng
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import ExpandingInput from './components/ExpandingInput';
import ActionBottomSheet from './components/ActionBottomSheet';
import LocationBottomSheet from './components/LocationBottomSheet';

const SECTIONS = [
  { title: 'Chú thích', tags: ['Mô tả thêm', 'Thêm vị trí', 'Thêm Thời gian:', 'Gieo hạt'] },
  { title: 'Tag hành động', tags: ['Green Daily', 'Ô nhiễm', 'Cộng đồng', 'Hành động 4'] },
];

export default function PreviewScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // 1. Khai báo Ref cho Modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animWidth = useRef(new Animated.Value(150)).current;

  const [location, setLocation] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const actionSheetRef = useRef<any>(null);
  const locationSheetRef = useRef<any>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddLocation = () => {
    actionSheetRef.current?.dismiss();
    setTimeout(() => locationSheetRef.current?.present(), 300);
  };

  const handleAddTime = () => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    setTime((prev) => (prev ? null : timeStr)); // Toggle thời gian
  };
  return (
    <GestureHandlerRootView style={{ flex: 1, marginBottom: 100 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10">
          {/* --- CỤM 1: TOP BAR --- */}
          <View className="flex-row items-center justify-between px-6">
            <TouchableOpacity className="rounded-full bg-white/10 p-3">
              <Ionicons name="grid" size={24} color="white" />
            </TouchableOpacity>

            <View className="aspect-square w-14 overflow-hidden rounded-[40px] border border-neutral-500">
              <Image source={{ uri: imageUri || '' }} className="flex-1" />
            </View>

            <TouchableOpacity className="rounded-2xl bg-white/10 p-3 shadow-sm">
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

            {location || time || selectedTags.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4 h-10 px-4">
                {location && (
                  <View className="mr-2 flex-row items-center rounded-full bg-amber-500 px-3 py-1">
                    <Ionicons name="location" size={14} color="white" />
                    <Text className="ml-1 text-xs text-white">Vị trí: {location}</Text>
                  </View>
                )}
                {time && (
                  <View className="mr-2 flex-row items-center rounded-full bg-sky-500 px-3 py-1">
                    <Ionicons name="time" size={14} color="white" />
                    <Text className="ml-1 text-xs text-white">{time}</Text>
                  </View>
                )}
                {selectedTags.map((tag) => (
                  <View
                    key={tag}
                    className="mr-2 justify-center rounded-full bg-green-50 px-3 py-1">
                    <Text className="text-xs text-[var(--primary)]">{tag}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </View>

          {/* --- CỤM 3: BOTTOM BAR --- */}
          <View className="flex-row items-center justify-between px-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-xl">
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
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              onAddLocation={handleAddLocation}
              onAddTime={handleAddTime}
            />
            <LocationBottomSheet ref={locationSheetRef} onSelect={(loc) => setLocation(loc)} />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}

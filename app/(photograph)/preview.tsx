import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import ExpandingInput from './components/ExpandingInput';

export default function PreviewScreen() {
  // Lấy URI ảnh từ màn hình trước truyền sang
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [description, setDescription] = useState('');

  const animWidth = useRef(new Animated.Value(150)).current;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10">
        {/* --- CỤM 1: TOP BAR --- */}
        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity className="rounded-full bg-white/10 p-3">
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>

          <View className="aspect-square w-14 overflow-hidden rounded-[40px] border border-neutral-500">
            <Image
              source={{
                uri: 'data:image/jpeg;base64,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',
              }}
              className="flex-1"
            />
          </View>

          <TouchableOpacity className="rounded-2xl bg-white/10 p-3 shadow-sm">
            <Feather name="download" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- CỤM 2: ẢNH VÀ INPUT CO GIÃN --- */}
        <View className="relative mx-4 aspect-square w-[calc(100%-32px)] overflow-hidden rounded-[40px] border border-neutral-500">
          <Image source={{ uri: imageUri }} className="flex-1" />

          <ExpandingInput
            description={description}
            setDescription={setDescription}
            animWidth={animWidth}
          />
        </View>

        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] shadow-xl">
            <Ionicons name="send" size={32} color="white" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <TouchableOpacity className="p-2">
            <MaterialIcons name="draw" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- CỤM 4: BOTTOM FLOATING NAV BAR --- */}
        <View className="w-full items-center">
          <View className="w-[75%] flex-row items-center justify-between rounded-full border border-neutral-500  px-6 py-3 shadow-md">
            {/* 1. Nút Menu/Apps */}
            <TouchableOpacity className="p-2">
              <Ionicons name="apps-outline" size={26} color="white" />
            </TouchableOpacity>

            {/* 2. Nút Scan/Focus */}
            <TouchableOpacity className="rounded-full bg-neutral-700 p-5 shadow-lg">
              <Ionicons name="scan-outline" size={32} color="#22c55e" />
            </TouchableOpacity>

            {/* 3. Nút Icon Thiên nhiên/Hoa */}
            <TouchableOpacity className="p-2">
              <MaterialCommunityIcons name="flower-tulip-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

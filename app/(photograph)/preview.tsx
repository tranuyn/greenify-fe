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
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import ExpandingInput from './components/ExpandingInput';

export default function PreviewScreen() {
  // Lấy URI ảnh từ màn hình trước truyền sang
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [description, setDescription] = useState('');

  const animWidth = useRef(new Animated.Value(150)).current;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10">
        {/* --- CỤM 1: TOP BAR --- */}
        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity className="rounded-full bg-white/10 p-3">
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>

          <View className="aspect-square w-14 overflow-hidden rounded-[40px] border border-neutral-500">
            <Image
              source={{
                uri: '',
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

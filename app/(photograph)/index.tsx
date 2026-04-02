import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, usePathname } from 'expo-router';
import { setStatusBarStyle, StatusBar } from 'expo-status-bar';

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar from '../(photograph)/components/BottomNavBar';

export default function LocketScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(true);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const cameraRef = useRef<CameraView>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // tính năng Zoom
  const [cameraZoom, setCameraZoom] = useState(0);
  const currentZoomRef = useRef(0);
  const startZoomRef = useRef(0);
  const zoomOpacity = useRef(new Animated.Value(0.4)).current;

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => {
        setStatusBarStyle('dark');
      };
    }, [])
  );

  // --- LOGIC XỬ LÝ FLASH, ZOOM & GESTURE ---
  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const getFlashIcon = () => {
    if (flashMode === 'on') return 'flash';
    if (flashMode === 'auto') return 'flash-auto';
    return 'flash-off';
  };

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onStart(() => {
      startZoomRef.current = currentZoomRef.current;
    })
    .onUpdate((e) => {
      const velocity = (e.scale - 1) * 0.1;
      let newZoom = startZoomRef.current + velocity;
      newZoom = Math.max(0, Math.min(newZoom, 1));
      currentZoomRef.current = newZoom;
      setCameraZoom(newZoom);
    });

  const toggleZoom = () => {
    const nextZoom = cameraZoom < 0.05 ? 0.1 : 0;
    currentZoomRef.current = nextZoom;
    setCameraZoom(nextZoom);

    Animated.sequence([
      Animated.timing(zoomOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(zoomOpacity, { toValue: 0.4, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const displayZoomText = `${(1 + cameraZoom * 10).toFixed(1)}x`;

  async function handleTakePicture() {
    if (cameraRef.current) {
      try {
        // Chụp ảnh với cấu hình cơ bản để tăng tốc độ phản hồi
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Giảm nhẹ chất lượng để truyền params nhanh hơn
          skipProcessing: true,
        });

        if (photo) {
          router.push({
            // Thử dùng đường dẫn trực tiếp này nếu /(photograph)/preview không chạy
            pathname: '/preview',
            params: { imageUri: photo.uri },
          });
        }
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
      }
    }
  }

  const pathname = usePathname();

  // Logic xác định tab nào đang sáng đèn dựa trên URL
  const getActiveTab = () => {
    if (pathname.includes('schedule')) return 'schedule';
    if (pathname.includes('nature')) return 'nature';
    return 'scan'; // index.tsx và preview.tsx đều thuộc luồng scan
  };

  // --- KIỂM TRA QUYỀN CAMERA ---
  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <Text className="mb-4 text-center text-lg text-white">
          Ứng dụng cần quyền truy cập camera để bạn có thể check-in.
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-[var(--primary)] px-6 py-3"
          onPress={requestPermission}>
          <Text className="font-bold text-white">Cấp quyền Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 justify-between bg-neutral-900 py-10">
        {/* --- CỤM 1: TOP BAR --- */}
        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity className="rounded-full bg-white/10 p-3">
            <Ionicons name="grid" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center rounded-full bg-white/10 px-4 py-2">
            <MaterialCommunityIcons
              name="fire"
              size={22}
              color={hasCheckedInToday ? '#f97316' : '#9ca3af'}
            />
            <Text className="ml-1 text-lg font-extrabold text-white">23</Text>
          </View>

          <TouchableOpacity
            className="rounded-full bg-white/10 p-3"
            onPress={() => router.replace('/(tabs)/')}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- CỤM 2: CAMERA BOX (VUÔNG VỨC 1:1) --- */}
        <GestureDetector gesture={pinchGesture}>
          <View className="relative mx-4 aspect-square w-[calc(100%-32px)] overflow-hidden rounded-[40px] border border-neutral-500">
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
              zoom={cameraZoom}
              flash={flashMode}
            />

            <View className="absolute bottom-4 w-full flex-row items-center justify-between px-6">
              <TouchableOpacity
                className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
                onPress={toggleFlash}>
                <MaterialCommunityIcons
                  name={getFlashIcon()}
                  size={24}
                  color={flashMode === 'on' ? '#facc15' : 'white'}
                />
              </TouchableOpacity>

              <Animated.View style={{ opacity: zoomOpacity }}>
                <TouchableOpacity
                  onPress={toggleZoom}
                  className="h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md">
                  <Text className="text-xs font-bold text-white">{displayZoomText}</Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
                onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
                <MaterialCommunityIcons name="camera-flip" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </GestureDetector>

        {/* --- CỤM 3: MIDDLE CAPTURE CONTROLS --- */}
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            className="h-24 w-24 items-center justify-center rounded-full border-[3px] border-[var(--primary)] bg-transparent"
            onPress={handleTakePicture}>
            <View className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white shadow-lg">
              <MaterialCommunityIcons name="leaf" size={40} color="#22c55e" />
            </View>
          </TouchableOpacity>
        </View>

        <View className=" px-6">
          <BottomNavBar activeTab={getActiveTab()} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

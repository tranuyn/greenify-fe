import { Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

// Ngăn không cho Splash Screen tự động ẩn trước khi font load xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  // Khi font đã load xong (hoặc có lỗi), tiến hành ẩn Splash Screen
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Nếu font chưa nạp xong thì chưa render giao diện
  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

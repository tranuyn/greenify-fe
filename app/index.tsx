import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getOnboardingCompleted } from 'services/onboarding.service';
import { tokenStorage } from 'lib/apiClient';
import { authService } from 'services/auth.service';
import { queryClient } from 'lib/queryClient';
import { QUERY_KEYS } from 'constants/queryKeys';

type RouteState = 'loading' | 'onboarding' | 'auth' | 'app';

export default function StartPage() {
  const [route, setRoute] = useState<RouteState>('loading');

  useEffect(() => {
    const decide = async () => {
      try {
        const [onboardingDone, token] = await Promise.all([
          getOnboardingCompleted(),
          tokenStorage.getAccess(),
        ]);

        if (!onboardingDone) {
          setRoute('onboarding');
          return;
        }

        if (!token) {
          setRoute('auth');
          return;
        }

        // Có token -> fetch user info để populate React Query Cache
        const res = await authService.getMe();
        queryClient.setQueryData(QUERY_KEYS.auth.me(), res);
        setRoute('app');
      } catch (error) {
        // Token hết hạn hoặc có lỗi gọi api -> clear local token và đẩy về màn đăng nhập
        await tokenStorage.clear();
        setRoute('auth');
      }
    };

    decide();
  }, []);

  if (route === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#15803d" />
      </View>
    );
  }

  if (route === 'onboarding') return <Redirect href="/(onboarding)" />;
  if (route === 'auth') return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)" />;
}

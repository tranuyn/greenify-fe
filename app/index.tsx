import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getOnboardingCompleted } from 'services/onboarding.service';
import { tokenStorage } from 'lib/apiClient';

type RouteState = 'loading' | 'onboarding' | 'auth' | 'app';

export default function StartPage() {
  const [route, setRoute] = useState<RouteState>('loading');

  useEffect(() => {
    const decide = async () => {
      const [onboardingDone, token] = await Promise.all([
        getOnboardingCompleted(),
        tokenStorage.getAccess(),
      ]);

      if (!onboardingDone) {
        setRoute('onboarding');
      } else if (!token) {
        setRoute('auth');
      } else {
        setRoute('app');
      }
    };

    decide();
  }, []);

  if (route === 'loading') {
    // Splash screen đang hiện — render null hoặc spinner nhẹ
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

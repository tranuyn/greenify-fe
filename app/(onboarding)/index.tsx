import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  type ViewToken,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { ONBOARDING_SLIDES, type OnboardingSlide } from 'constants/onboarding.constant';
import { getOnboardingCompleted, setOnboardingCompleted } from 'services/onboarding.service';
import i18n from 'utils/i18n.util';

type IntroPhase = 'logo-static' | 'logo-loading' | 'landing';

function BrandSplash({ withLoader }: { withLoader: boolean }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-700">
        <Ionicons name="leaf" size={30} color="#dcfce7" />
      </View>
      <Text className="mt-4 font-inter-black text-4xl text-foreground">Greenify</Text>
      {withLoader ? <ActivityIndicator className="mt-5" size="small" color="#15803d" /> : null}
    </SafeAreaView>
  );
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<IntroPhase>('logo-static');
  const [activeSlide, setActiveSlide] = useState(0);
  // Đổi tên isSubmitting → isNavigating cho đúng nghĩa
  const [isNavigating, setIsNavigating] = useState(false);

  // Phase transitions
  useEffect(() => {
    if (phase !== 'logo-static') return;
    const t = setTimeout(() => setPhase('logo-loading'), 900);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'logo-loading') return;
    const t = setTimeout(() => setPhase('landing'), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  const viewabilityConfig = useMemo(() => ({ viewAreaCoveragePercentThreshold: 70 }), []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<OnboardingSlide>[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setActiveSlide(first.index);
    }
  );

  const finishOnboarding = async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    await setOnboardingCompleted(true);
    router.replace('/(auth)/login');
  };

  if (phase === 'logo-static') return <BrandSplash withLoader={false} />;
  if (phase === 'logo-loading') return <BrandSplash withLoader={true} />;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>
      <View className="flex-1">
        <FlatList
          data={ONBOARDING_SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <ImageBackground
                source={{ uri: item.imageUrl }}
                resizeMode="cover"
                className="flex-1">
                <View className="flex-1 bg-black/45 px-5 pb-40 pt-3">
                  <View className="items-end">
                    <Pressable onPress={finishOnboarding} hitSlop={8}>
                      <Text className="font-inter-semibold text-base text-white">
                        {i18n.t('onboarding.skip')}
                      </Text>
                    </Pressable>
                  </View>

                  <View className="mt-auto">
                    <Text className="max-w-[90%] font-inter-black text-5xl leading-tight text-white">
                      {i18n.t(item.titleKey)}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          )}
        />

        {/* Dot indicators + CTA button — absolute overlay */}
        <View className="absolute bottom-8 left-0 right-0 px-5">
          <View className="mb-6 flex-row items-center justify-center">
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                className={[
                  'mx-1 h-3 rounded-full',
                  index === activeSlide ? 'w-9 bg-primary-400' : 'w-3 bg-white/85',
                ].join(' ')}
              />
            ))}
          </View>

          <Button
            title={i18n.t('onboarding.cta')}
            onPress={finishOnboarding}
            isLoading={isNavigating}
            className="w-full rounded-xl bg-primary-500 py-4"
            textClassName="text-lg font-inter-bold text-primary-950"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

import { router } from 'expo-router';
import { Leaf } from 'lucide-react-native';
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
import { ONBOARDING_SLIDES, type OnboardingSlide } from '../../constants/onboarding.constant';
import { getOnboardingCompleted, setOnboardingCompleted } from '../../services/onboarding.service';
import i18n from '../../utils/i18n.util';

type IntroPhase = 'logo-static' | 'logo-loading' | 'landing';

function BrandSplash({ withLoader }: { withLoader: boolean }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-700">
        <Leaf size={30} color="#dcfce7" />
      </View>
      <Text className="mt-4 text-4xl font-inter-black text-foreground">Greenify</Text>
      {withLoader ? <ActivityIndicator className="mt-5" size="small" color="#15803d" /> : null}
    </SafeAreaView>
  );
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<IntroPhase>('logo-static');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkCompletedState = async () => {
      const completed = await getOnboardingCompleted();
      if (completed && mounted) {
        router.replace('/(tabs)');
      }
    };

    checkCompletedState();

    return () => {
      mounted = false;
    };
  }, []);

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 70,
    }),
    []
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<OnboardingSlide>[] }) => {
      const firstVisible = viewableItems[0];
      if (firstVisible?.index != null) {
        setActiveSlide(firstVisible.index);
      }
    }
  );

  useEffect(() => {
    if (phase !== 'logo-static') {
      return;
    }

    const timer = setTimeout(() => {
      setPhase('logo-loading');
    }, 900);

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'logo-loading') {
      return;
    }

    const timer = setTimeout(() => {
      setPhase('landing');
    }, 1200);

    return () => clearTimeout(timer);
  }, [phase]);

  const finishOnboarding = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    await setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  if (phase === 'logo-static') {
    return <BrandSplash withLoader={false} />;
  }

  if (phase === 'logo-loading') {
    return <BrandSplash withLoader={true} />;
  }

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
              <ImageBackground source={{ uri: item.imageUrl }} resizeMode="cover" className="flex-1">
                <View className="flex-1 bg-black/45 px-5 pt-3 pb-40">
                  <View className="items-end">
                    <Pressable onPress={finishOnboarding} hitSlop={8}>
                      <Text className="text-base font-inter-semibold text-white">
                        {i18n.t('onboarding.skip')}
                      </Text>
                    </Pressable>
                  </View>

                  <View className="mt-auto">
                    <Text className="max-w-[90%] text-5xl leading-tight font-inter-black text-white">
                      {i18n.t(item.titleKey)}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          )}
        />

        <View className="absolute bottom-8 left-0 right-0 px-5">
          <View className="mb-6 flex-row items-center justify-center">
            {ONBOARDING_SLIDES.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <View
                  key={slide.id}
                  className={`mx-1 h-3 rounded-full ${isActive ? 'w-9 bg-primary-400' : 'w-3 bg-white/85'}`}
                />
              );
            })}
          </View>

          <Button
            title={i18n.t('onboarding.cta')}
            onPress={finishOnboarding}
            isLoading={isSubmitting}
            className="w-full rounded-xl bg-primary-500 py-4"
            textClassName="text-lg font-inter-bold text-primary-950"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

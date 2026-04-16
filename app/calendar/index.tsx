import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import ProgressSection from './components/ProgressSection';
import WeekSection from './components/WeekSection';
import UtilitiesSection from './components/UtilitiesSection';
import GiftSection from './components/GiftSection';
import ActivityHistorySection from './components/ActivityHistorySection';
import MyGardenArchive from './components/MyGardenArchive';
import { IMAGES } from '@/constants/linkMedia';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function GreenCalendarScreen() {
  const { t } = useTranslation();
  const [isGardenArchiveMode, setIsGardenArchiveMode] = useState(false);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-[var(--background)]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. Header Background */}
        <ImageBackground
          source={{ uri: IMAGES.calendar }}
          className="h-60 px-4 pt-10"
          imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <View className="absolute inset-0 rounded-b-[24px] bg-black/20" />
          <View className="flex-row items-center justify-between">
            {/* Nút Back */}
            <TouchableOpacity
              className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]"
              onPress={() => {
                router.back();
              }}>
              <Feather name="chevron-left" size={24} className="text-[var(--on-primary)]" />
            </TouchableOpacity>

            <Text className="font-inter-bold text-lg text-[var(--on-primary)]">
              {t('calendar.header_title')}
            </Text>

            {/* Nút Home */}
            <TouchableOpacity
              className="h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]"
              onPress={() => router.replace('/(tabs)/')}>
              <Feather name="home" size={18} className="text-[var(--on-primary)]" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* 2. Progress & Banner */}
        <ProgressSection />

        {isGardenArchiveMode ? (
          <MyGardenArchive onBack={() => setIsGardenArchiveMode(false)} />
        ) : (
          <>
            {/* 3. Calendar & Utilities Section */}
            <View className="mt-6 px-4">
              <WeekSection />
              <UtilitiesSection onPressFarm={() => setIsGardenArchiveMode(true)} />
            </View>

            {/* 4. Gift Banner */}
            <GiftSection />

            {/* 5. History List */}
            <ActivityHistorySection />
          </>
        )}
      </ScrollView>

      {/* 6. Sticky Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--background)] p-4">
        <TouchableOpacity className="flex-row items-center justify-center space-x-2 rounded-xl bg-[var(--primary)] py-4">
          <Text className="mr-2 font-inter-bold text-lg text-[var(--on-primary)]">
            {t('calendar.green_action_button')}
          </Text>
          <FontAwesome5 name="leaf" size={20} className="text-[var(--on-primary)]" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

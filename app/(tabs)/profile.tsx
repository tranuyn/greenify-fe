import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '@/components/profile/Header';
import { QuickActions } from '@/components/profile/QuickActions';
import { Utilities } from '@/components/profile/Utilities';
import { UpgradeBanner } from '@/components/profile/UpgradeBanner';
import { EventStats } from '@/components/profile/EventStats';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        <Header />

        <View className="-mt-4 rounded-t-3xl bg-background">
          <QuickActions />

          <View className="h-2 bg-gray-50 dark:bg-neutral-900" />

          <Utilities />

          <View className="h-2 bg-gray-50 dark:bg-neutral-900" />

          <UpgradeBanner />

          <EventStats />

          {/* Padding bottom để không bị che bởi TabBar */}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

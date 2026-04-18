import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Header } from '@/components/profile/Header';
import { QuickActions } from '@/components/profile/QuickActions';
import { Utilities } from '@/components/profile/Utilities';
import { UpgradeBanner } from '@/components/profile/UpgradeBanner';
import { EventStats } from '@/components/profile/EventStats';
import { HomeHeader } from '@/components/features/home/HomeHeader';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useMyWallet } from '@/hooks/queries/useWallet';

export default function ProfileScreen() {
  const { data: authData } = useCurrentUser();
  const { data: wallet } = useMyWallet();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 bg-background pt-3" showsVerticalScrollIndicator={false}>
        <HomeHeader
          userName={
            authData?.userProfile?.displayName || authData?.ngoProfile?.orgName || 'Người dùng'
          }
          avatarUrl={authData?.userProfile?.avatarUrl || authData?.ngoProfile?.avatarUrl}
          points={wallet?.availablePoints ?? 0}
        />

        <View className=" rounded-t-3xl bg-background">
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

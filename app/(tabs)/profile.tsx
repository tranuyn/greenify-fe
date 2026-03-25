import { router } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { resetOnboardingCompleted } from '../../services/onboarding.service';

export default function ProfileScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    await resetOnboardingCompleted();
    router.replace('/(onboarding)');
  };

  return (
    <View className="flex-1 bg-background px-6 py-10">
      <View className="items-center rounded-3xl bg-flex-1 bg-background px-6 py-8">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Feather name="user" size={38} color="#166534" />
        </View>
        <Text className="text-2xl font-inter-bold text-foreground">Uyen Tran</Text>
        <Text className="mt-1 text-base font-inter-medium text-primary-700">
          Cấp độ: Người gieo mầm
        </Text>
      </View>

      <View className="mt-8">
        <Button
          title="Đăng xuất"
          onPress={handleSignOut}
          isLoading={isSigningOut}
          variant="outline"
          className="w-full border-red-500"
          textClassName="text-red-600 font-inter-bold"
          iconLeft={<MaterialIcons name="logout" size={18} color="#dc2626" />}
        />
      </View>
    </View>
  );
}
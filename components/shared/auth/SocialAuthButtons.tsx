import type { ReactNode } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { Text } from 'components/ui/Text';

type SocialAuthButtonsProps = {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
};

function SocialCircleButton({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon}
    </Pressable>
  );
}

export function SocialAuthButtons({ onGooglePress, onFacebookPress }: SocialAuthButtonsProps) {
  return (
    <View className="items-center">
      <Text className="text-xs uppercase tracking-[1.4px] text-foreground/50">Hoặc</Text>
      <View className="mt-3 flex-row gap-4">
        <SocialCircleButton
          label="Đăng nhập với Google"
          onPress={onGooglePress}
          icon={<FontAwesome name="google" size={20} color="#111827" />}
        />
        <SocialCircleButton
          label="Đăng nhập với Facebook"
          onPress={onFacebookPress}
          icon={<FontAwesome name="facebook" size={20} color="#1d4ed8" />}
        />
      </View>
    </View>
  );
}

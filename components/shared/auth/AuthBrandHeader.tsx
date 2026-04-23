import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'components/ui/Text';

type AuthBrandHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AuthBrandHeader({ title, subtitle }: AuthBrandHeaderProps) {
  return (
    <View className="mb-6 items-center">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary-700">
        <Ionicons name="leaf" size={28} color="#dcfce7" />
      </View>

      <Text className="text-center font-inter-black text-3xl text-primary">{title}</Text>
      {subtitle ? (
        <Text className="text-foreground/70 mt-2 text-center text-sm leading-5">{subtitle}</Text>
      ) : null}
    </View>
  );
}

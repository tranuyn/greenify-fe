import { Leaf } from 'lucide-react-native';
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
        <Leaf size={28} color="#dcfce7" />
      </View>

      <Text className="text-center text-3xl font-inter-black text-primary-950">{title}</Text>
      {subtitle ? (
        <Text className="mt-2 text-center text-sm leading-5 text-foreground/70">{subtitle}</Text>
      ) : null}
    </View>
  );
}

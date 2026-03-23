import { Crosshair } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from 'components/ui/Text';

export default function MapScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
        <Crosshair size={32} color="#166534" />
      </View>
      <Text className="text-center text-2xl font-inter-bold text-primary-800">Quét nhanh</Text>
      <Text className="mt-2 text-center text-base text-foreground/70">
        Tính năng quét và nhận diện hành động xanh sẽ xuất hiện tại đây trong bản kế tiếp.
      </Text>
    </View>
  );
}

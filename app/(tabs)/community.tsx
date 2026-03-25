import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import { Text } from 'components/ui/Text';

export default function CommunityScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
        <Feather name="users" size={32} color="#166534" />
      </View>
      <Text className="text-center text-2xl font-inter-bold text-primary-800">Cộng đồng</Text>
      <Text className="mt-2 text-center text-base text-foreground/70">
        Không gian kết nối các hoạt động và thử thách sống xanh sẽ có tại đây.
      </Text>
    </View>
  );
}

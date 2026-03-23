import { CalendarRange } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from 'components/ui/Text';

export default function EventsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
        <CalendarRange size={32} color="#166534" />
      </View>
      <Text className="text-center text-2xl font-inter-bold text-primary-800">Sự kiện</Text>
      <Text className="mt-2 text-center text-base text-foreground/70">
        Lịch sự kiện môi trường, workshop và chiến dịch cộng đồng sẽ được cập nhật sớm.
      </Text>
    </View>
  );
}

import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Uyen Tran</Text>
      <Text className="text-green-600 font-semibold mt-1">Cấp độ: Người gieo mầm</Text>
    </View>
  );
}
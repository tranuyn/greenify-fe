import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const stats = [
  { label: 'Đã tham gia', value: 10 },
  { label: 'Đang chờ duyệt', value: 1 },
  { label: 'Đã hủy', value: 1 },
];

export const EventStats = () => (
  <View className="mt-6 px-4">
    <TouchableOpacity className="mb-4 flex-row items-center justify-between">
      <Text className="font-inter-bold text-lg text-foreground">
        Sự kiện <Text className="text-primary">Xanh</Text>
      </Text>
      <Feather name="chevron-right" size={20} color="#888" />
    </TouchableOpacity>

    <View className=" overflow-hidden rounded-2xl border border-border">
      {stats.map((item, index) => (
        <View
          key={index}
          className={`flex-row items-center justify-between p-4 ${
            index !== stats.length - 1 ? 'border-b border-border' : ''
          }`}>
          <Text className="font-inter-medium text-foreground">{item.label}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-inter-bold text-foreground">{item.value}</Text>
            <Feather name="calendar" size={18} color="#888" />
          </View>
        </View>
      ))}
    </View>
  </View>
);

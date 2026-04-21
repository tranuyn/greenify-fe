import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useMyParticipationSummary } from '@/hooks/queries/useEvents';

const formatCount = (value: number | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '0';
  }

  const safeValue = Math.min(Math.max(value, 0), Number.MAX_SAFE_INTEGER);
  return safeValue.toLocaleString('vi-VN');
};

export const EventStats = () => {
  const { data, isLoading } = useMyParticipationSummary();

  const stats = [
    { label: 'Đã đăng ký', value: formatCount(data?.registeredCount) },
    { label: 'Đang chờ duyệt', value: formatCount(data?.waitlistedCount) },
    { label: 'Đã hủy', value: formatCount(data?.cancelledCount) },
    { label: 'Đã hoàn thành', value: formatCount(data?.attendedCount) },
  ];

  return (
    <View className="mt-6 px-4">
      <TouchableOpacity className="mb-4 flex-row items-center justify-between">
        <Text className="font-inter-bold text-lg text-foreground">
          Sự kiện <Text className="text-primary">Xanh</Text>
        </Text>
        <Feather name="chevron-right" size={20} color="#888" />
      </TouchableOpacity>

      <View className=" overflow-hidden rounded-2xl border border-border">
        {isLoading ? (
          <View className="items-center justify-center p-4">
            <ActivityIndicator size="small" color="#22c55e" />
          </View>
        ) : (
          stats.map((item, index) => (
            <View
              key={item.label}
              className={`flex-row items-center justify-between p-4 ${
                index !== stats.length - 1 ? 'border-b border-border' : ''
              }`}>
              <Text className="font-inter-medium text-foreground">{item.label}</Text>
              <View className="flex-row items-center gap-2">
                <Text className="font-inter-bold text-foreground">{item.value}</Text>
                <Feather name="calendar" size={18} color="#888" />
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

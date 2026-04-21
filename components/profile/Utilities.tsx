import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IMAGES } from '@/constants/linkMedia';

const utils = [
  { name: 'Bản đồ Xanh', icon: IMAGES.map, route: '/map', isForHome: true },
  { name: 'Chợ Voucher', icon: IMAGES.vegetable, route: '/market', isForHome: true },
  { name: 'Bảng xếp hạng', icon: IMAGES.winner, route: '/leaderboard', isForHome: true },
  { name: 'Lịch xanh', icon: IMAGES.calendarImg, route: '/calendar', isForHome: true },
  {
    name: 'Ví & Điểm',
    icon: IMAGES.saveWater,
    route: '/history', // Khai báo đường dẫn ở đây
    isForHome: false,
  },
  { name: 'Điểm rác', icon: IMAGES.coexistence, route: '/coexistence', isForHome: false },
];

type UtilitiesProps = {
  isForHome?: boolean;
};

export const Utilities = ({ isForHome = false }: UtilitiesProps) => {
  const router = useRouter();
  const visibleUtils = isForHome ? utils.filter((item) => item.isForHome) : utils;
  return (
    <View className="px-4 pt-4">
      {isForHome && <View className="pt-6" />}
      {!isForHome ? (
        <Text className="mb-4 text-lg font-bold text-foreground">Tiện ích của tôi</Text>
      ) : null}
      <View className="flex-row flex-wrap">
        {visibleUtils.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="w-1/4 items-center"
            // 4. Kiểm tra xem item có route không thì mới push
            onPress={() => {
              if (item.route) {
                router.push(item.route as any);
              } else {
                console.log(`Chưa có route cho ${item.name}`);
              }
            }}>
            <Image source={{ uri: item.icon }} className="mb-2 h-10 w-10" resizeMode="contain" />
            <Text className="text-center text-[11px] text-foreground">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!isForHome && <View className="pb-6" />}
    </View>
  );
};

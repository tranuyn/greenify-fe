import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const utils = [
  { name: 'Bản đồ Xanh', icon: require('../../assets/map.png'), route: '/map' },
  { name: 'Chợ Voucher', icon: require('../../assets/market.png'), route: '/market' },
  { name: 'Bảng xếp hạng', icon: require('../../assets/rank.png'), route: '/leaderboard' },
  { name: 'Lịch xanh', icon: require('../../assets/calender.png'), route: '/calendar' },
  {
    name: 'Ví & Điểm',
    icon: require('../../assets/wallet.png'),
    route: '/history', // Khai báo đường dẫn ở đây
  },
];

type UtilitiesProps = {
  isForHome?: boolean;
};

export const Utilities = ({ isForHome = false }: UtilitiesProps) => {
  const router = useRouter();
  const visibleUtils = isForHome ? utils.filter((item) => item.name !== 'Ví & Điểm') : utils;
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
            <Image source={item.icon} className="mb-2 h-10 w-10" resizeMode="contain" />
            <Text className="text-center text-[11px] text-foreground">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!isForHome && <View className="pb-6" />}
    </View>
  );
};

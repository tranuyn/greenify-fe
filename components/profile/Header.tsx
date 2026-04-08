import { View, Text, Image } from 'react-native';

export const Header = () => (
  <View
    className="elevation-5 z-50 flex-row items-center justify-between overflow-visible  bg-primary  px-6  py-1 pb-6 pt-12 shadow-xl"
    style={{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    }}>
    <View className="flex-row items-center gap-3">
      <View className="bg-on-primary/20 h-16 w-16 items-center justify-center rounded-full border-2 border-on-primary">
        <Image source={require('../../assets/avatar.png')} className="h-12 w-12 rounded-full" />
      </View>
      <Text className="font-inter-bold text-xl text-on-primary">User name</Text>
    </View>
    <View className=" items-end">
      <Text className="text-xs text-on-primary">Điểm tích lũy</Text>
      <Text className="font-inter-bold text-3xl text-on-primary">10 GP</Text>
    </View>
  </View>
);

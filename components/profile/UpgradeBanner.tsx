import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useState } from 'react';
import UpgradeModal from './UpgradeModal';

const GP = 70; // ví dụ, bạn có thể truyền prop hoặc lấy từ state
const GP_TARGET = 100;
const percent = Math.min(GP / GP_TARGET, 1);
const size = 120;
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const progress = circumference * (1 - percent);

export const UpgradeBanner = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View className="items-center px-4 py-4">
      <Text className="mb-3 w-full font-inter-bold text-lg text-foreground">
        Nâng cấp tài khoản
      </Text>
      <View style={{ position: 'relative', width: size, height: size, marginBottom: 16 }}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#e0e0e0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#22c55e"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text className="text-lg font-bold text-primary">{Math.round(percent * 100)}%</Text>
        </View>
      </View>
      <Text className="my-6 text-center text-base ">
        {GP >= GP_TARGET
          ? 'Bạn đã đủ điều kiện nâng cấp!'
          : 'Đạt 100 GP (Green Points) để trở thành Cộng tác viên'}
      </Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)} // <--- THÊM DÒNG NÀY
        className={`w-full flex-row items-center justify-center rounded-full py-4 ${GP >= GP_TARGET ? 'bg-accent' : 'bg-gray-300'}`}
        disabled={GP < GP_TARGET}
        style={{ opacity: GP < GP_TARGET ? 0.5 : 1 }}>
        <Ionicons name="leaf" size={22} style={{ marginRight: 8 }} />
        <Text className="font-inter-bold text-lg text-black">Nâng cấp</Text>
      </TouchableOpacity>

      {/* 3. Gọi Modal ở dưới cùng của Component và truyền props */}
      <UpgradeModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

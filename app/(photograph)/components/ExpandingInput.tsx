import React, { memo, useRef, useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';

const ExpandingInput = memo(({ description, setDescription }: any) => {
  const animWidth = useRef(new Animated.Value(150)).current;
  const animHeight = useRef(new Animated.Value(42)).current;
  const [currentHeight, setCurrentHeight] = useState(42);
  const MAX_WIDTH = 300; // Giới hạn chiều ngang tối đa

  return (
    <View className="absolute bottom-6 w-full items-center">
      <Animated.View
        className="flex-row items-center rounded-3xl bg-black/50 px-5 py-2 shadow-md"
        style={{
          alignSelf: 'center',
          width: animWidth,
          height: currentHeight,
          justifyContent: 'center',
        }}>
        {/* THẺ ĐO CHIỀU RỘNG (Chỉ đo Width) */}
        <Text
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            // Chỉ giãn ngang, tối đa là MAX_WIDTH
            const targetWidth = Math.max(150, Math.min(width + 60, MAX_WIDTH));

            Animated.spring(animWidth, {
              toValue: targetWidth,
              useNativeDriver: false,
              friction: 9,
              tension: 50,
            }).start();
          }}
          className="absolute font-medium opacity-0"
          style={{ fontSize: 15 }}>
          {/* Chỉ lấy dòng cuối cùng hoặc nội dung ngắn để đo Width ngang */}
          {description || 'Thêm mô tả'}
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Thêm mô tả"
          placeholderTextColor="#cbd5e1"
          className="w-full text-center font-medium text-white"
          style={{
            fontSize: 15,
            padding: 0,
            textAlignVertical: 'center',
          }}
          multiline={true}
          // ĐÂY LÀ CHÌA KHÓA: Đo chiều cao thực tế khi xuống dòng
          onContentSizeChange={(e) => {
            const { height } = e.nativeEvent.contentSize;
            // Cập nhật height ngay lập tức bằng state để không bị mất chữ
            const targetHeight = Math.max(42, Math.min(height + 15, 120));
            setCurrentHeight(targetHeight);
          }}
          autoCorrect={false}
          blurOnSubmit={true}
          scrollEnabled={false}
        />
      </Animated.View>
    </View>
  );
});

export default ExpandingInput;

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { apiClient } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import { authService } from '@/services/auth.service';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface UpgradeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isVisible, onClose }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const benefits = [
    'Quyền tham gia xác thực hành động xanh và báo cáo môi trường',
    'Tích điểm từ hoạt động duyệt hợp lệ theo quy định hệ thống',
    'Badge "Cộng tác viên" hiển thị trên hồ sơ',
    'Truy cập các tính năng và công cụ hỗ trợ dành cho Cộng tác viên',
    'Cơ hội đồng hành cùng cộng đồng và các chiến dịch môi trường',
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await apiClient.patch('/users/me/ctv-upgrade');
      const res = await authService.getMe();
      queryClient.setQueryData(QUERY_KEYS.auth.me(), res);
      Alert.alert('Thành công', 'Bạn đã nâng cấp thành Cộng tác viên!');
      onClose();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.response?.data?.message || 'Không thể nâng cấp. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible} // Dùng props isVisible
      onRequestClose={onClose} // Dùng props onClose
    >
      {/* Overlay */}
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full rounded-[32px] border border-border bg-background p-5 shadow-2xl">
          {/* Header */}
          <Text className="mb-2 text-center text-xl font-black text-primary">
            Nâng cấp Cộng tác viên
          </Text>

          <Text className="mb-2 text-center text-sm leading-5 text-foreground">
            Đạt 100 Green Points để trở thành Cộng tác viên
          </Text>

          {/* Điểm hiện tại */}
          <View className="mb-6 flex-row items-baseline justify-center">
            <Text className="text-base text-muted-foreground">Điểm hiện tại </Text>
            <Text className="text-lg font-black text-foreground">110 Green Points</Text>
          </View>

          {/* Quyền lợi */}
          <View className="mb-4">
            <Text className="mb-3 font-bold text-foreground">✨ Bạn sẽ nhận được:</Text>
            {benefits.map((item, index) => (
              <View key={index} className="mb-2 ml-2 flex-row items-start">
                <Text className="mr-2 text-lg font-bold text-primary">·</Text>
                <Text className="flex-1 text-sm leading-5 text-foreground">{item}</Text>
              </View>
            ))}
          </View>

          {/* Link điều khoản */}
          <TouchableOpacity className="mb-5">
            <Text className="text-center text-[12px] font-semibold text-primary underline">
              Điều khoản sử dụng và Chính sách bảo mật
            </Text>
          </TouchableOpacity>

          {/* Checkbox */}
          <Pressable
            onPress={() => setIsAgreed(!isAgreed)}
            className="mb-6 flex-row items-center px-1">
            <View
              className={`mr-3 h-5 w-5 items-center justify-center rounded-md border 
                ${isAgreed ? 'border-primary bg-primary' : 'border-border'}`}>
              {isAgreed && <AntDesign name="check" size={12} color="white" />}
            </View>
            <Text className="flex-1 text-[12px] leading-4 text-foreground">
              Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật
            </Text>
          </Pressable>

          {/* Actions */}
          <View className="flex-row gap-x-3">
            <TouchableOpacity
              onPress={onClose} // 4. Gắn sự kiện đóng modal vào nút Thoát
              className="flex-1 items-center rounded-2xl border border-border bg-card py-4">
              <Text className="font-bold text-foreground">Thoát</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isAgreed || isLoading}
              onPress={handleUpgrade}
              className={`flex-1 items-center rounded-2xl py-4 shadow-sm 
                ${isAgreed ? 'bg-primary' : 'bg-primary-200'}`}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-bold text-on-primary">Nâng cấp ngay</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpgradeModal;

import React, { useCallback, useRef, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { resetOnboardingCompleted } from '@/services/onboarding.service';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { router } from 'expo-router';

// Giả lập dữ liệu cho Quick Actions
const actions = [
  { id: 'user', icon: 'user', label: 'Thông tin\ntài khoản' },
  { id: 'security', icon: 'shield', label: 'Bảo mật\ntài khoản' },
  { id: 'help', icon: 'headphones', label: 'Trợ giúp' },
  { id: 'settings', icon: 'settings', label: 'Tất cả\ncài đặt' },
] as const;

const mapUserRoleToAccountRole = (role?: string) => {
  if (role === 'NGO') {
    return 'organization';
  }

  return 'citizen';
};

export const QuickActions = ({ navigation }: any) => {
  // Ref sử dụng BottomSheetModal thay vì BottomSheet
  const [isSigningOut, setIsSigningOut] = useState(false);
  const settingsModalRef = useRef<BottomSheetModal>(null);
  const securityModalRef = useRef<BottomSheetModal>(null);
  const { data: meData } = useCurrentUser();

  // Điểm dừng
  const snapPoints = useMemo(() => ['60%'], []);
  const securitySnapPoints = useMemo(() => ['45%'], []);

  // Hàm xử lý khi bấm vào từng Action
  const handlePress = (id: string) => {
    switch (id) {
      case 'user':
        router.push({
          pathname: '/(auth)/edit-profile',
          params: {
            role: mapUserRoleToAccountRole(meData?.roles?.[0]),
            email: meData?.email,
          },
        });
        break;
      case 'security':
        // Dùng .present() để mở Modal
        securityModalRef.current?.present();
        break;
      case 'help':
        router.push('/faq');
        break;
      case 'settings':
        // Dùng .present() để mở Modal
        settingsModalRef.current?.present();
        break;
    }
  };

  // Backdrop (lớp nền mờ khi mở Sheet)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    await resetOnboardingCompleted();
    router.replace('/(onboarding)');
  };
  return (
    <View className="flex-row justify-around  py-6">
      {actions.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item.id)}
          className="w-1/4 items-center">
          {/* Màu sắc giữ nguyên theo code mới nhất của bạn */}
          <View className="bg-primary-0 mb-2 rounded-xl p-2">
            <Feather name={item.icon as any} size={24} color="#22c55e" />
          </View>
          <Text className="px-1 text-center text-[11px] font-medium text-foreground">
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* --- MODAL TẤT CẢ CÀI ĐẶT --- */}
      <BottomSheetModal
        ref={settingsModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose>
        <BottomSheetView className="flex-1 p-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between px-2">
            <View style={{ width: 24 }} />
            <Text className="text-lg font-bold">Tất cả cài đặt</Text>
            <TouchableOpacity onPress={() => settingsModalRef.current?.dismiss()}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* List Items */}
          <SettingItem
            icon="user"
            label="Thông tin tài khoản"
            showChevron
            onPress={() => {
              settingsModalRef.current?.dismiss();
              navigation?.navigate('Profile');
            }}
          />

          <SettingItem
            icon="shield"
            label="Bảo mật tài khoản"
            showChevron
            onPress={() => {
              // Bước 1: Đóng modal hiện tại
              settingsModalRef.current?.dismiss();
              // Bước 2: Mở modal bảo mật (đợi một chút để modal cũ đóng hẳn cho mượt)
              setTimeout(() => {
                securityModalRef.current?.present();
              }, 100);
            }}
          />

          <SettingItem
            icon="headphones"
            label="Trung tâm trợ giúp"
            showChevron
            onPress={() => {
              settingsModalRef.current?.dismiss();
              router.push('/faq');
            }}
          />

          <SettingItem icon="log-out" label="Đăng xuất" isLast onPress={handleSignOut} />
        </BottomSheetView>
      </BottomSheetModal>

      {/* --- MODAL BẢO MẬT --- */}
      <BottomSheetModal
        ref={securityModalRef}
        index={0}
        snapPoints={securitySnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose>
        <BottomSheetView className="p-6">
          <Text className="mb-4 text-center text-lg font-bold">Bảo mật</Text>
          <TouchableOpacity
            className="flex-row items-center rounded-lg bg-gray-50 p-4"
            onPress={() => {
              // Xử lý đổi mật khẩu ở đây
              securityModalRef.current?.dismiss();
              router.push('/(forgot)/send-otp');
            }}>
            <Feather name="lock" size={20} color="black" />
            <Text className="ml-3 font-medium">Đổi mật khẩu</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const SettingItem = ({ icon, label, showChevron, isLast, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-2 py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <Feather name={icon} size={22} color="black" />
    <Text className="ml-4 flex-1 text-[16px] text-gray-800">{label}</Text>
    {showChevron && <Feather name="chevron-right" size={20} color="gray" />}
  </TouchableOpacity>
);

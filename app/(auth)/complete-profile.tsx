import { router, useLocalSearchParams } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { Pressable, View } from 'react-native';
import { AuthBrandHeader } from 'components/shared/auth/AuthBrandHeader';
import { AuthInput } from 'components/shared/auth/AuthInput';
import { AuthScaffold } from 'components/shared/auth/AuthScaffold';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { CITY_OPTIONS } from '../../constants/auth.constant';
import { useMemo, useState } from 'react';

export default function CompleteProfileScreen() {
  const params = useLocalSearchParams<{ role?: string; email?: string }>();
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState<string>(CITY_OPTIONS[0]);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [address, setAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const roleTitle = useMemo(() => {
    return params.role === 'organization' ? 'Tổ chức' : 'Công dân xanh';
  }, [params.role]);

  return (
    <AuthScaffold>
      <AuthBrandHeader title="Hoàn thiện thông tin" subtitle={`Loại tài khoản: ${roleTitle}`} />

      <View className="mb-5 items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <FontAwesome5 name="user" size={32} color="#166534" />
        </View>
      </View>

      <View className="gap-4">
        <AuthInput
          label="Email"
          value={params.email ?? ''}
          editable={false}
          placeholder="email@greenify.app"
        />

        <AuthInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <AuthInput
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />

        <View>
          <Text className="text-foreground/80 mb-1 font-inter-medium text-sm">Tỉnh/Thành phố</Text>
          <Pressable
            className="flex-row items-center justify-between rounded-xl border border-primary-100 bg-primary-50 px-3 py-3"
            onPress={() => setShowCityOptions((prev) => !prev)}>
            <Text className="text-base text-foreground">{city}</Text>
            <Entypo name="chevron-down" size={18} color="text-foreground" />
          </Pressable>

          {showCityOptions ? (
            <View className="mt-2 rounded-xl border border-primary-100 bg-white p-2">
              {CITY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  className="rounded-lg px-3 py-2 active:bg-primary-50"
                  onPress={() => {
                    setCity(option);
                    setShowCityOptions(false);
                  }}>
                  <Text className="text-foreground/80 text-sm">{option}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <AuthInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <Pressable
        className="mt-5 flex-row items-start"
        onPress={() => setAcceptedTerms((prev) => !prev)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: acceptedTerms }}>
        <View
          className={`mr-2 mt-0.5 h-4 w-4 items-center justify-center rounded border ${
            acceptedTerms ? 'border-primary-700 bg-primary-700' : 'border-primary-300 bg-white'
          }`}>
          {acceptedTerms ? <FontAwesome name="check-square" size={12} color="white" /> : null}
        </View>
        <Text className="text-foreground/70 flex-1 text-xs leading-5">
          Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Greenify.
        </Text>
      </Pressable>

      <Button title="Tạo tài khoản" className="mt-5" onPress={() => router.replace('/(tabs)')} />

      <View className="mt-6 flex-row items-center justify-center gap-1">
        <Text className="text-foreground/70 text-sm">Đã có tài khoản?</Text>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={6}>
          <Text className="font-inter-semibold text-sm text-primary-700">Đăng nhập</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

import { View, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

type Props = {
  title: string;
  /** @deprecated Dùng title đầy đủ từ i18n thay vì concatenation */
  highlightWord?: string;
  onPress?: () => void;
};

/**
 * SectionHeader — Tiêu đề section trên Home.
 * Vẫn hỗ trợ highlightWord cho backward-compat nhưng khuyến khích dùng title đầy đủ.
 */
export function SectionHeader({ title, highlightWord, onPress }: Props) {
  const colors = useThemeColor();

  return (
    <View className="mb-3 mt-7 flex-row items-center justify-between px-5">
      <View className="flex-row items-center">
        {/* Thanh accent nhỏ bên trái */}
        <View className="mr-2.5 h-5 w-1 rounded-full bg-primary" />
        <Text className="font-inter-bold text-[17px] text-foreground">
          {title}
          {highlightWord ? (
            <Text className="font-inter-bold text-[17px] text-primary">
              {' '}
              {highlightWord}
            </Text>
          ) : null}
        </Text>
      </View>
      {onPress && (
        <TouchableOpacity
          onPress={onPress}
          className="rounded-full p-1 active:opacity-70"
        >
          <Feather name="chevron-right" size={20} color={colors.neutral400} />
        </TouchableOpacity>
      )}
    </View>
  );
}

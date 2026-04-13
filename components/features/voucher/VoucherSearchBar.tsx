import { View, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { NEUTRAL_COLORS } from 'constants/color.constant';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function VoucherSearchBar({ value, onChangeText }: Props) {
  return (
    <View className="mx-4 mt-2 mb-4">
      <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-md shadow-black/10 dark:bg-card">
        <Feather name="search" size={18} color={NEUTRAL_COLORS[400]} />
        <TextInput
          className="ml-3 flex-1 font-inter text-sm text-foreground"
          placeholder="Tìm voucher, đối tác..."
          placeholderTextColor={NEUTRAL_COLORS[400]}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Feather
            name="x"
            size={16}
            color={NEUTRAL_COLORS[400]}
            onPress={() => onChangeText('')}
          />
        )}
      </View>
    </View>
  );
}

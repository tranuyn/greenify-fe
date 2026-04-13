import { View, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function MapSearchBar({ value, onChangeText }: Props) {
  return (
    <View className="mx-4">
      <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-md shadow-black/10">
        <Feather name="search" size={18} color="#9ca3af" />
        <TextInput
          className="ml-3 flex-1 font-inter text-sm text-foreground"
          placeholder="Tìm điểm thu gom..."
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Feather name="x" size={16} color="#9ca3af" onPress={() => onChangeText('')} />
        )}
      </View>
    </View>
  );
}

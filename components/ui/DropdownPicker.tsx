import Entypo from '@expo/vector-icons/Entypo';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from './Text';

export type DropdownOption = {
  code: string;
  name: string;
};

type DropdownPickerProps = {
  label: string;
  placeholder?: string;
  value: string; // Tên hiển thị đang chọn
  options: DropdownOption[];
  isOpen: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  errorText?: string;
  onToggle: () => void;
  onSelect: (option: DropdownOption) => void;
};

export function DropdownPicker({
  label,
  placeholder,
  value,
  options,
  isOpen,
  isLoading = false,
  disabled = false,
  errorText,
  onToggle,
  onSelect,
}: DropdownPickerProps) {
  const borderClass = errorText ? 'border-rose-400' : 'border-primary-100';

  return (
    <View className="relative z-[9999]">
      <Text className="mb-1 font-inter-medium text-sm text-foreground">{label}</Text>

      <Pressable
        className={`flex-row items-center justify-between rounded-xl border bg-background px-3 py-3 ${borderClass} ${
          disabled ? 'opacity-50' : ''
        }`}
        onPress={onToggle}
        disabled={disabled}>
        <Text className={`text-base ${value ? 'text-foreground' : 'text-gray-400'}`}>
          {isLoading ? 'Đang tải...' : value || placeholder || `Chọn ${label.toLowerCase()}`}
        </Text>
        <Entypo name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#374151" />
      </Pressable>

      {isOpen && !isLoading && (
        <View
          className="elevation-5 absolute inset-x-0 z-[9999] rounded-xl border border-primary-100 bg-background shadow-sm shadow-black/10"
          style={{ top: '100%', marginTop: 8 }}>
          <ScrollView className="max-h-48 p-2" nestedScrollEnabled>
            {options.length === 0 ? (
              <Text className="px-3 py-2 text-sm text-muted-foreground">Không có dữ liệu</Text>
            ) : (
              options.map((opt) => (
                <Pressable
                  key={opt.code}
                  className={`rounded-lg px-3 py-2 active:bg-primary ${
                    value === opt.name ? 'bg-primary' : ''
                  }`}
                  onPress={() => onSelect(opt)}>
                  <Text
                    className={`text-sm ${
                      value === opt.name
                        ? 'font-inter-medium text-primary-700'
                        : 'text-muted-foreground'
                    }`}>
                    {opt.name}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {errorText ? <Text className="mt-1 text-xs text-rose-600">{errorText}</Text> : null}
    </View>
  );
}

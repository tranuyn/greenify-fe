import { Feather } from '@expo/vector-icons';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { Text } from 'components/ui/Text';

type AuthInputProps = TextInputProps & {
  label: string;
  errorText?: string;
  containerClassName?: string;
  secureToggle?: {
    visible: boolean;
    onToggle: () => void;
  };
};

export function AuthInput({
  label,
  errorText,
  containerClassName = '',
  secureToggle,
  className = '',
  ...props
}: AuthInputProps) {
  const hasError = Boolean(errorText);

  return (
    <View className={containerClassName}>
      <Text className="mb-1 text-sm font-inter-medium text-foreground/80">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-primary-50 px-3 ${
          hasError ? 'border-rose-400' : 'border-primary-100'
        }`}
      >
        <TextInput
          placeholderTextColor="#9ca3af"
          className={`flex-1 py-3 text-base font-inter text-foreground ${className}`}
          {...props}
        />
        {secureToggle ? (
          <Pressable onPress={secureToggle.onToggle} hitSlop={8}>
            {secureToggle.visible ? (
              <Feather name="eye-off" size={18} color="#4b5563" />
            ) : (
              <Feather name="eye" size={18} color="#4b5563" />
            )}
          </Pressable>
        ) : null}
      </View>
      {hasError ? <Text className="mt-1 text-xs text-rose-600">{errorText}</Text> : null}
    </View>
  );
}

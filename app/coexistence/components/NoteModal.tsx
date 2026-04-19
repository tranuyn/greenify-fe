import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/Text';
import { de } from 'zod/v4/locales';

type NoteModalProps = {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  cancelText: string;
  confirmText: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => void;
};

const NoteModal = ({
  visible,
  title,
  placeholder,
  initialValue = '',
  cancelText,
  confirmText,
  isConfirming = false,
  onCancel,
  onConfirm,
}: NoteModalProps) => {
  const [note, setNote] = useState(initialValue);

  useEffect(() => {
    if (visible) {
      setNote(initialValue);
    }
  }, [initialValue, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/45 px-5"
          onPress={onCancel}>
          <Pressable
            className="w-full max-w-[420px] rounded-3xl bg-background px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <Text className="font-inter-bold text-lg text-foreground">{title}</Text>

            <TextInput
              autoFocus
              value={note}
              onChangeText={setNote}
              placeholder={placeholder}
              placeholderTextColor="#A1A1AA"
              multiline
              textAlignVertical="top"
              className="mt-4 min-h-[110px] rounded-2xl border border-black/10 bg-white px-4 py-3 font-inter text-base text-foreground"
            />

            <View className="mt-4 flex-row gap-x-3">
              <Pressable
                className="flex-1 items-center justify-center rounded-xl border border-black/10 py-3"
                onPress={onCancel}
                disabled={isConfirming}>
                <Text className="font-inter-medium text-base text-foreground">{cancelText}</Text>
              </Pressable>

              <Pressable
                className="flex-1 items-center justify-center rounded-xl py-3"
                style={{ backgroundColor: '#2EC15F' }}
                onPress={() => onConfirm(note)}
                disabled={isConfirming}>
                <Text className="font-inter-medium text-base text-on-primary">
                  {isConfirming ? confirmText : confirmText}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NoteModal;

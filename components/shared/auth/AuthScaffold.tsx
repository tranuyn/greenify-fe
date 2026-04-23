import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScaffoldProps = {
  children: ReactNode;
};

export function AuthScaffold({ children }: AuthScaffoldProps) {
  return (
    <SafeAreaView className="flex-1 bg-primary-950 dark:bg-primary-950" edges={['top', 'bottom']}>
      <View className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-primary-400/25" />
      <View className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-primary-500/20" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
          showsVerticalScrollIndicator={false}>
          <View className="rounded-3xl border border-white/15 bg-background px-6 py-7 shadow-lg">
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

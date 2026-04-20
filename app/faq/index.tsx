import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { GREENIFY_FAQS } from '@/constants/faq.constant';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

type FAQAccordionProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
};

const FAQAccordion = ({ question, answer, isOpen, onPress }: FAQAccordionProps) => {
  const colors = useThemeColor();

  return (
    <View className="border-b border-primary-100 py-4">
      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={onPress}
        activeOpacity={0.8}>
        <Text className="flex-1 font-inter-semibold text-base text-foreground">{question}</Text>

        <View className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-primary-50">
          <Feather
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={isOpen ? colors.primary700 : colors.neutral400}
          />
        </View>
      </TouchableOpacity>

      {isOpen ? (
        <Text className="text-foreground/70 mt-3 pr-2 font-inter text-sm leading-6">{answer}</Text>
      ) : null}
    </View>
  );
};

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const handleToggle = (id: number) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="rounded-2xl border border-primary-100 bg-white p-5 dark:bg-card">
          <View className="mb-5">
            <Text className="font-inter-bold text-2xl text-foreground">Câu hỏi thường gặp</Text>
            <Text className="text-foreground/60 mt-2 font-inter text-sm leading-6">
              Tìm hiểu mọi thứ bạn cần biết về Greenify và cách chúng ta cùng nhau xây dựng lối sống
              xanh.
            </Text>
          </View>

          {GREENIFY_FAQS.map((faq) => (
            <FAQAccordion
              key={faq.id}
              question={`${faq.id}. ${faq.question}`}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onPress={() => handleToggle(faq.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

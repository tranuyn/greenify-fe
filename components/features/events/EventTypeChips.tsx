import { FlatList, TouchableOpacity } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { EventTypeOption } from './eventFilters';

type Props = {
  types: EventTypeOption[];
  activeType: EventTypeOption;
  onChangeType: (type: EventTypeOption) => void;
};

export function EventTypeChips({ types, activeType, onChangeType }: Props) {
  return (
    <FlatList
      data={types}
      horizontal
      keyExtractor={(type) => type}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 }}
      renderItem={({ item: type }) => {
        const isActive = type === activeType;
        return (
          <TouchableOpacity
            onPress={() => onChangeType(type)}
            className={`mr-2 rounded-full px-4 py-2 ${
              isActive ? 'bg-primary' : 'bg-primary-50 dark:bg-card'
            }`}>
            <Text className={`font-inter-medium text-xs ${isActive ? 'text-white' : 'text-foreground/60'}`}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

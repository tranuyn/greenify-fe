import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { WasteType } from '@/types/community.types';

type Props = {
  types: WasteType[];
  activeType: string | null;
  onSelect: (typeID: string) => void;
};

export function WasteTypeFilter({ types, activeType, onSelect }: Props) {
  if (types.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}>
      {types.map((type) => {
        const isActive = type.id === activeType;
        return (
          <TouchableOpacity
            key={type.id}
            onPress={() => onSelect(type.id)}
            className={`mr-2 rounded-full px-4 py-2 shadow-sm ${
              isActive ? 'shadow-primary/20 bg-primary' : 'bg-background shadow-black/10'
            }`}>
            <Text
              className={`font-inter-medium text-xs ${
                isActive ? 'text-white' : 'text-foreground/70'
              }`}>
              {type.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

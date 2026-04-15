import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';

type Props = {
  partners: string[];
  activePartner: string | null;
  onSelect: (partner: string) => void;
};

export function PartnerFilter({ partners, activePartner, onSelect }: Props) {
  if (partners.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}>
      {partners.map((partner) => {
        const isActive = partner === activePartner;
        return (
          <TouchableOpacity
            key={partner}
            onPress={() => onSelect(partner)}
            className={`mr-2 rounded-full px-4 py-2 shadow-sm ${
              isActive ? 'bg-primary shadow-primary/20' : 'bg-white shadow-black/10 dark:bg-card'
            }`}>
            <Text
              className={`font-inter-medium text-xs ${
                isActive ? 'text-white' : 'text-foreground/70'
              }`}>
              {partner}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

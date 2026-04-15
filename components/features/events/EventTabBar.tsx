import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/Text';

export type EventTab = 'all' | 'registered' | 'upcoming';

type TabConfig = {
  key: EventTab;
  label: string;
};

const TABS: TabConfig[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'registered', label: 'Đã đăng ký' },
  { key: 'upcoming', label: 'Sắp diễn ra' },
];

type Props = {
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
};

export function EventTabBar({ activeTab, onTabChange }: Props) {
  return (
    <View className="flex-row gap-2 px-5 py-3">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.85}
            className={`min-h-11 flex-1 items-center justify-center rounded-full px-3 py-2.5 ${
              isActive ? 'bg-primary' : 'bg-primary-50 dark:bg-card'
            }`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={`!font-inter-semibold text-sm leading-5 ${
                isActive ? 'text-white' : 'text-foreground/60'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

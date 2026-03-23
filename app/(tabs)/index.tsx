import { Text } from 'components/ui/Text';
import { View } from 'react-native';
import i18n from '../../utils/i18n.util';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-primary mb-2">{i18n.t('home.welcome')}</Text>
      <Text className="text-foreground text-center px-6">
        {i18n.t('home.description')}
      </Text>
    </View>
  );
}
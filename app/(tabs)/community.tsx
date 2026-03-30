import React from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Icons
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text } from 'components/ui/Text';
import { useThemeColor } from 'hooks/useThemeColor.hook';

// -----------------------------------------------------------------
// COMPONENTS PHỤ
// -----------------------------------------------------------------

const Tag = ({ label }: { label: string }) => (
  <View className="border border-primary-900 px-4 py-1.5 rounded-full mr-3 mb-2">
    <Text numberOfLines={1} className="text-foreground font-inter-medium text-sm">{label}</Text>
  </View>
);

const PostCard = () => {
  const { t } = useTranslation();
  const colors = useThemeColor();
  
  return (
    <View className="mt-6 mb-8">
      <View className="flex-row items-center mb-4">
        <View className="w-14 h-14 rounded-full border border-primary bg-primary-50 items-center justify-center mr-3">
          <FontAwesome6 name="tree" size={28} color={colors.primary} />
        </View>
        <View>
          {/* Data này tạm thời hardcode, sau này đổ từ API về sẽ không dùng i18n */}
          <Text className="text-foreground font-inter-medium text-lg">Người dùng 01</Text>
          <Text className="text-foreground/60 font-inter text-sm mt-0.5">01/03/2026 - 3 ngày trước</Text>
        </View>
      </View>

      <View className="relative w-full h-[320px] rounded-[32px] overflow-hidden border-2 border-primary">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop' }}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute bottom-4 left-4 flex-row items-center">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-2 shadow-sm">
            <FontAwesome6 name="leaf" size={20} color={colors.primary800} />
          </TouchableOpacity>
          <View className="bg-primary-100 px-4 py-2 rounded-full shadow-sm">
            <Text className="text-primary-800 font-inter-medium">
              {t('community.post.feeling')}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap mt-4">
        <Tag label={t('community.tags.location')} />
        <Tag label={t('community.tags.time')} />
        <Tag label={t('community.tags.greenDaily')} />
        <Tag label={t('community.tags.seed')} />
      </View>

      <View className="bg-primary-50 p-4 rounded-2xl mt-2">
        <Text className="text-primary-800 font-inter text-base leading-relaxed">
          {t('community.post.caption')}
        </Text>
      </View>
    </View>
  );
};

export default function CommunityScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      
      <Text className="text-foreground font-inter-bold text-2xl px-6 mb-2">
        {t('community.title')}
      </Text>

      <View className="flex-1 px-6 pt-4">
        
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-primary-50 rounded-full px-5 mr-3">
            <TextInput 
              placeholder={t('community.search')}
              placeholderTextColor={colors.primary800}
              className="flex-1 font-inter text-base text-primary-800 mr-2"
            />
            <Feather name="search" size={24} color={colors.primary800} />
          </View>
          
          <TouchableOpacity className="w-[40px] h-[40px] bg-primary-50 rounded-full items-center justify-center">
            <Feather name="filter" size={22} color={colors.primary800} />
          </TouchableOpacity>
        </View>
        
        <View className="mb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Tag label={t('community.tags.location')} />
            <Tag label={t('community.tags.time')} />
            <Tag label={t('community.tags.greenDaily')} />
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <PostCard />
        </ScrollView>

      </View>
    </View>
  );
}
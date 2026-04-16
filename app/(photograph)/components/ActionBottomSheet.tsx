import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface Props {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  onAddLocation: () => void;
  onAddTime: () => void;
}

const SECTIONS = [
  {
    titleKey: 'photograph.action_sheet.sections.notes',
    tags: ['location', 'time', 'seed'] as const,
  },
  {
    titleKey: 'photograph.action_sheet.sections.action_tags',
    tags: ['green_daily', 'pollution', 'community', 'action_4'] as const,
  },
];

const ActionBottomSheet = forwardRef((props: Props, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const renderBackdrop = (p: any) => (
    <BottomSheetBackdrop {...p} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['50%']}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: '#1c1917', // Màu tương đương với bg-neutral-700
        borderRadius: 40,
      }}
      containerStyle={{ zIndex: 1000 }}>
      <BottomSheetView className=" px-6 pb-5">
        {SECTIONS.map((section, idx) => (
          <View key={idx} className="mt-6">
            <Text className="mb-4  text-lg font-bold text-white">{t(section.titleKey)}</Text>
            <View className="flex-row flex-wrap">
              {section.tags.map((tag) => {
                const isSelected = props.selectedTags.includes(tag);

                const handlePress = () => {
                  if (tag === 'location') props.onAddLocation();
                  else if (tag === 'time') props.onAddTime();
                  else props.toggleTag(tag);
                  bottomSheetModalRef.current?.dismiss();
                };

                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => handlePress()}
                    // Thêm flex-row và items-center để icon và chữ nằm ngang
                    className={`mb-3 mr-2 flex-row items-center rounded-full px-4 py-2 ${
                      isSelected ? 'bg-green-500' : 'bg-neutral-600'
                    }`}>
                    {/* 1. Thêm Icon cho 'Thêm vị trí' */}
                    {tag === 'location' && (
                      <Ionicons
                        name="location-sharp"
                        size={16}
                        color={'white'}
                        style={{ marginRight: 6 }}
                      />
                    )}

                    {/* 2. Thêm Icon cho 'Thêm Thời gian' */}
                    {tag === 'time' && (
                      <Ionicons
                        name="time-sharp"
                        size={16}
                        color={'white'}
                        style={{ marginRight: 6 }}
                      />
                    )}

                    <Text className="py-2 text-white">
                      {t(`photograph.action_sheet.tags.${tag}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ActionBottomSheet;

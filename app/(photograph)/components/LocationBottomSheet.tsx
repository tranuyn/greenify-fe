import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

const LOCATIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Đà Lạt'];

const LocationBottomSheet = forwardRef(({ onSelect }: { onSelect: (loc: string) => void }, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    present: () => modalRef.current?.present(),
    dismiss: () => modalRef.current?.dismiss(),
  }));

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={['40%']}
      backdropComponent={(p) => (
        <BottomSheetBackdrop {...p} disappearsOnIndex={-1} appearsOnIndex={0} />
      )}
      containerStyle={{ zIndex: 1001 }}>
      <BottomSheetView className="p-6">
        <Text className="font-inter-bold mb-4 text-xl">{t('photograph.location_sheet.title')}</Text>
        <FlatList
          data={LOCATIONS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                modalRef.current?.dismiss();
              }}
              className="border-b border-gray-100 py-4">
              <Text className="font-inter text-lg">{item}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LocationBottomSheet;

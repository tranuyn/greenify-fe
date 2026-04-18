import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import type { GreenActionType } from '@/types/action.types';

interface Props {
  actionTypes: GreenActionType[];
  selectedActionTypeId: string | null;
  onSelectActionType: (actionTypeId: string) => void;
}

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
        backgroundColor: '#1c1917',
        borderRadius: 40,
      }}
      containerStyle={{ zIndex: 1000 }}>
      <BottomSheetView className=" px-6 pb-5">
        <View className="mt-6">
          <Text className="mb-4 text-lg font-bold text-white">
            {t('photograph.action_sheet.sections.action_tags')}
          </Text>
          <View className="mt-2">
            {props.actionTypes.map((type) => {
              const isSelected = props.selectedActionTypeId === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => {
                    props.onSelectActionType(type.id);
                    bottomSheetModalRef.current?.dismiss();
                  }}
                  // Chỉnh lại padding và bo góc cho giống một thanh list item
                  className={`mb-3 w-full flex-row items-center justify-between rounded-2xl px-4 py-3 ${
                    isSelected ? 'bg-green-500' : 'bg-neutral-600'
                  }`}>
                  {/* Bọc text trong 1 view có flex-1 để nó tự co giãn */}
                  <View className="flex-1 pr-2">
                    <Text className="mb-1 text-base leading-5 text-white">{type.actionName}</Text>
                    <Text className="text-xs text-white/70">#{type.groupName}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default ActionBottomSheet;

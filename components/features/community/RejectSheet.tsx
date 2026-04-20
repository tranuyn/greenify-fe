import React, { useMemo, useState, forwardRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { REJECT_REASONS, type RejectReasonCode } from '@/constants/review.constant';

type RejectSheetProps = {
  colors: any;
  insets: any;
  isReviewing: boolean;
  onSubmit: (code: RejectReasonCode, note: string) => void;
  renderBackdrop: any;
};

export const RejectSheet = forwardRef<BottomSheetModal, RejectSheetProps>((props, ref) => {
  const { colors, insets, isReviewing, onSubmit, renderBackdrop } = props;
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ['60%'], []);
  const [selectedReasonCode, setSelectedReasonCode] = useState<RejectReasonCode | null>(null);
  const [customNote, setCustomNote] = useState('');

  const handleConfirm = () => {
    if (selectedReasonCode) {
      onSubmit(selectedReasonCode, customNote);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background, borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: colors.primary300, width: 40 }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      onChange={(idx: number) => {
        if (idx === -1) {
          setSelectedReasonCode(null);
          setCustomNote('');
        }
      }}>
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
        {/* Sheet header */}
        <View className="mb-5 flex-row items-center justify-between pt-2">
          <Text className="font-inter-bold text-lg text-foreground">
            {t('community.post_detail.reject_reasons_title', 'Lý do từ chối')}
          </Text>
          <TouchableOpacity onPress={() => (ref as any)?.current?.dismiss()} hitSlop={8}>
            <Feather name="x" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Reason options */}
        <View className="gap-2">
          {REJECT_REASONS.map((reason) => {
            const isSelected = selectedReasonCode === reason.code;
            return (
              <TouchableOpacity
                key={reason.code}
                onPress={() => setSelectedReasonCode(reason.code)}
                className={`flex-row items-center rounded-2xl border px-4 py-3.5 ${
                  isSelected
                    ? 'border-primary bg-primary-50'
                    : 'border-primary-100 bg-white dark:border-white/10 dark:bg-card'
                }`}>
                <View
                  className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-primary' : 'border-primary-200'
                  }`}>
                  {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </View>
                <Text
                  className={`flex-1 font-inter-medium text-sm ${
                    isSelected ? 'text-primary-700' : 'text-foreground/80'
                  }`}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom note */}
        {selectedReasonCode === 'OTHER' && (
          <View className="mt-4">
            <Text className="text-foreground/70 mb-2 font-inter-medium text-sm">
              {t('community.post_detail.additional_note', 'Mô tả thêm *')}
            </Text>
            <BottomSheetTextInput
              className="min-h-[80px] rounded-2xl border border-primary-900 bg-card px-4 py-3 font-inter text-sm text-foreground"
              placeholder={t(
                'community.post_detail.additional_note_placeholder',
                'Nhập lý do cụ thể...'
              )}
              placeholderTextColor={colors.neutral400}
              value={customNote}
              onChangeText={setCustomNote}
              multiline
              textAlignVertical="top"
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={
            isReviewing ||
            !selectedReasonCode ||
            (selectedReasonCode === 'OTHER' && customNote.trim().length === 0)
          }
          style={{
            marginTop: 20,
            backgroundColor: selectedReasonCode ? colors.error : colors.rose200,
            opacity:
              isReviewing ||
              !selectedReasonCode ||
              (selectedReasonCode === 'OTHER' && customNote.trim().length === 0)
                ? 0.5
                : 1,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
          }}>
          <Text
            style={{
              color: selectedReasonCode ? (colors.onError ?? '#fff') : colors.error,
              fontWeight: 'bold',
              fontSize: 13,
            }}>
            {t('community.post_detail.confirm_reject_btn', 'Xác nhận từ chối')}
          </Text>
        </TouchableOpacity>

        {/* <Button
          title={t('community.post_detail.confirm_reject_btn', 'Xác nhận từ chối')}
          onPress={handleConfirm}
          isLoading={isReviewing}
          disabled={
            !selectedReasonCode ||
            (selectedReasonCode === 'OTHER' && customNote.trim().length === 0)
          }
          className="mt-5"
          style={{
            backgroundColor: selectedReasonCode ? colors.error : colors.rose200,
            color: selectedReasonCode ? (colors.onError ?? '#fff') : colors.error, // fallback màu chữ
          }}
          textStyle={{
            color: selectedReasonCode ? (colors.onError ?? '#fff') : colors.error,
          }}
        /> */}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

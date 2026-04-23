import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { toLabel } from '@/constants/severityTierLabel';
import {
  useClaimTrashSpot,
  useReportTrashSpot,
  useVerifyTrashSpot,
} from '@/hooks/mutations/useTrashReports';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { TrashSpotListItem, TrashSpotReport } from '@/types/community.types';
import { openDirections } from '@/utils/directions.util';
import NoteModal from './NoteModal';
import { useAuthRole } from '@/hooks/queries/useAuth';

type Props = {
  station: TrashSpotListItem;
  detail?: TrashSpotReport;
  resolvedAddress?: string;
  isResolvingAddress?: boolean;
  isDetailLoading?: boolean;
  onClose: () => void;
  onReport?: (spotId: string) => void;
};

const TrashSpotBottomSheet = ({
  station,
  detail,
  resolvedAddress,
  isResolvingAddress = false,
  isDetailLoading = false,
  onClose,
  onReport,
}: Props) => {
  const colors = useThemeColor();
  const { t } = useTranslation();
  const roleData = useAuthRole();
  const { width: screenWidth } = useWindowDimensions();
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [noteAction, setNoteAction] = useState<'verify' | 'report'>('verify');
  const verifyTrashSpotMutation = useVerifyTrashSpot(station.id);
  const reportTrashSpotMutation = useReportTrashSpot(station.id);
  const claimTrashSpotMutation = useClaimTrashSpot(station.id);
  const sliderWidth = Math.max(screenWidth - 40, 1);
  const imageUrls = useMemo(() => detail?.imageUrls ?? [], [detail?.imageUrls]);
  const description = detail?.description ?? '';
  const defaultVerifyNote = t(
    'coexistence.trash_spot_sheet.verify_note_default',
    'Xác thực từ bản đồ'
  );
  const defaultReportNote = t(
    'coexistence.trash_spot_sheet.report_note_default',
    'Báo cáo từ bản đồ'
  );

  useEffect(() => {
    setActiveImageIndex(0);
  }, [station.id, imageUrls.length]);

  const handleOpenDirections = async () => {
    try {
      await openDirections({ latitude: station.latitude, longitude: station.longitude });
    } catch {
      Alert.alert(
        t('common.error', 'Loi'),
        t('map.open_directions_error', 'Khong the mo ung dung ban do.')
      );
    }
  };

  const handleOpenNoteModal = (action: 'verify' | 'report') => {
    setNoteAction(action);
    setIsNoteModalVisible(true);
  };

  const handleVerifyTrashSpot = async (note: string) => {
    try {
      await verifyTrashSpotMutation.mutateAsync({
        note: note.trim() || defaultVerifyNote,
      });

      Alert.alert(
        t('common.success', 'Thành công'),
        t('coexistence.trash_spot_sheet.verify_success', 'Xác thực điểm rác thành công.')
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || t('common.error', 'Lỗi');

      console.error('Error verifying trash spot:', error?.response || error);
      Alert.alert(
        t('common.error', 'Lỗi'),
        errorMessage ||
          t(
            'coexistence.trash_spot_sheet.verify_error',
            'Không thể xác thực điểm rác. Vui lòng thử lại.'
          )
      );
    }
  };

  const handleReportTrashSpot = async (note: string) => {
    try {
      await reportTrashSpotMutation.mutateAsync({
        note: note.trim() || defaultReportNote,
      });

      Alert.alert(
        t('common.success', 'Thành công'),
        t('coexistence.trash_spot_sheet.report_success', 'Báo cáo điểm rác thành công.')
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || t('common.error', 'Lỗi');

      console.error('Error reporting trash spot:', error?.response || error);
      Alert.alert(
        t('common.error', 'Lỗi'),
        errorMessage ||
          t(
            'coexistence.trash_spot_sheet.report_error',
            'Không thể báo cáo điểm rác. Vui lòng thử lại.'
          )
      );
    }
  };

  const handleClaimTrashSpot = async () => {
    try {
      await claimTrashSpotMutation.mutateAsync();

      Alert.alert(
        t('common.success', 'Thành công'),
        t('coexistence.trash_spot_sheet.claim_success', 'Nhận xử lý điểm rác thành công.')
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || t('common.error', 'Lỗi');

      console.error('Error claiming trash spot:', error?.response || error);
      Alert.alert(
        t('common.error', 'Lỗi'),
        errorMessage ||
          t(
            'coexistence.trash_spot_sheet.claim_error',
            'Không thể nhận xử lý điểm rác. Vui lòng thử lại.'
          )
      );
    }
  };

  return (
    <BottomSheet snapPoints={snapPoints} onClose={onClose} enablePanDownToClose>
      <BottomSheetView className="flex-1 rounded-t-3xl bg-background px-5 pb-6 pt-3">
        <Text className="font-inter-bold text-lg text-foreground">
          {detail?.name || t('coexistence.trash_spot_sheet.unknown_title', 'Điểm rác chưa rõ tên')}
        </Text>

        <View className="mt-4 gap-y-3">
          <View className="flex-row items-center">
            <Feather name="alert-triangle" size={22} color={colors.primary} />
            <Text className="ml-3 font-inter-bold text-base text-foreground">
              {t('coexistence.trash_spot_sheet.severity_label')}
            </Text>
            <Text className="ml-4 font-inter text-base text-foreground">
              {toLabel(detail?.severityTier, t)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="check-circle" size={22} color={colors.primary} />
            <Text className="ml-3 font-inter-bold text-base text-foreground">
              {t('coexistence.trash_spot_sheet.verification_label')}
            </Text>
            <Text className="ml-4 font-inter text-base text-foreground">
              {detail?.verificationCount ?? 0}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="trash-2" size={22} color={colors.primary} />
            <Text className="ml-3 font-inter-bold text-base text-foreground">
              {t('coexistence.trash_spot_sheet.waste_type_label')}
            </Text>
            <Text className="ml-3 font-inter text-base text-foreground">
              {detail?.wasteTypeNames?.[0] ||
                station.wasteTypeNames?.[0] ||
                t('coexistence.trash_spot_sheet.unknown_waste_type', 'Khac')}
            </Text>
          </View>

          <View className="flex-row">
            <Feather name="map-pin" size={22} color={colors.primary} />
            <Text className="ml-3 font-inter-bold text-base text-foreground">
              {t('coexistence.trash_spot_sheet.address_label')}
            </Text>
            <Text className="ml-4 flex-1 font-inter text-base text-foreground">
              {isResolvingAddress
                ? t('coexistence.trash_spot_sheet.resolving_address')
                : resolvedAddress || detail?.province}
            </Text>
          </View>
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl bg-black/5">
          {isDetailLoading ? (
            <View className="h-52 items-center justify-center">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : imageUrls.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ width: sliderWidth }}
                onMomentumScrollEnd={(event) => {
                  const { contentOffset, layoutMeasurement } = event.nativeEvent;
                  const nextIndex = Math.round(contentOffset.x / layoutMeasurement.width);
                  setActiveImageIndex(nextIndex);
                }}>
                {imageUrls.map((uri) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    resizeMode="cover"
                    style={{ width: sliderWidth, height: 208 }}
                  />
                ))}
              </ScrollView>

              {imageUrls.length > 1 ? (
                <View className="absolute bottom-3 left-0 right-0 flex-row items-center justify-center gap-x-2">
                  {imageUrls.map((uri, index) => (
                    <View
                      key={`${uri}-${index}`}
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          index === activeImageIndex
                            ? 'rgba(255,255,255,0.95)'
                            : 'rgba(255,255,255,0.45)',
                      }}
                    />
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <View className="h-52 items-center justify-center">
              <Text className="font-inter text-sm text-foreground">
                {t('coexistence.trash_spot_sheet.no_image')}
              </Text>
            </View>
          )}
        </View>

        <Text className="mt-4 font-inter-bold text-base leading-6 text-foreground">
          {t('coexistence.trash_spot_sheet.description_label')}
        </Text>
        <Text className="mt-2 font-inter text-base leading-6 text-foreground">{description}</Text>

        {roleData?.isNgo ? (
          <TouchableOpacity
            className="mt-5 items-center justify-center border border-primary p-4"
            onPress={handleClaimTrashSpot}
            disabled={claimTrashSpotMutation.isPending}>
            <Text className="font-inter-medium text-base text-foreground">
              {t('coexistence.trash_spot_sheet.ngo_claim_trash_spot', 'Nhận xử lý điểm rác')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="mt-5 flex-row gap-x-4">
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-xl py-4"
              style={{ backgroundColor: '#F7DCDD' }}
              onPress={() => handleOpenNoteModal('report')}
              disabled={reportTrashSpotMutation.isPending || verifyTrashSpotMutation.isPending}>
              <Text className="font-inter-medium text-base text-foreground">
                {t('coexistence.trash_spot_sheet.report_button')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-xl py-4"
              style={{ backgroundColor: colors.primary }}
              onPress={() => handleOpenNoteModal('verify')}
              disabled={verifyTrashSpotMutation.isPending || reportTrashSpotMutation.isPending}>
              <Text className="font-inter-medium text-base text-on-primary">
                {t('coexistence.trash_spot_sheet.verify_button')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={handleOpenDirections}
          className="mt-4 flex-row items-center justify-center rounded-xl bg-primary px-4 py-3">
          <Feather name="navigation" size={16} color="#ffffff" />
          <Text className="ml-2 font-inter-semibold text-sm text-white">
            {t('map.open_directions', 'Mở bản đồ')}
          </Text>
        </TouchableOpacity>

        <NoteModal
          visible={isNoteModalVisible}
          title={
            noteAction === 'verify'
              ? t('coexistence.trash_spot_sheet.verify_note_label', 'Ghi chú xác thực')
              : t('coexistence.trash_spot_sheet.report_note_label', 'Ghi chú báo cáo')
          }
          placeholder={t(
            noteAction === 'verify'
              ? 'coexistence.trash_spot_sheet.verify_note_placeholder'
              : 'coexistence.trash_spot_sheet.report_note_placeholder',
            noteAction === 'verify' ? 'Nhập ghi chú xác thực' : 'Nhập ghi chú báo cáo'
          )}
          initialValue={noteAction === 'verify' ? defaultVerifyNote : defaultReportNote}
          cancelText={t('common.cancel', 'Hủy')}
          confirmText={
            verifyTrashSpotMutation.isPending || reportTrashSpotMutation.isPending
              ? t('common.processing', 'Đang xử lý...')
              : noteAction === 'verify'
                ? t('coexistence.trash_spot_sheet.verify_button')
                : t('coexistence.trash_spot_sheet.report_button')
          }
          isConfirming={verifyTrashSpotMutation.isPending || reportTrashSpotMutation.isPending}
          onCancel={() => setIsNoteModalVisible(false)}
          onConfirm={async (note) => {
            setIsNoteModalVisible(false);
            if (noteAction === 'verify') {
              await handleVerifyTrashSpot(note);
              return;
            }

            await handleReportTrashSpot(note);
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TrashSpotBottomSheet;

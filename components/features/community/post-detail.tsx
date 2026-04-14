import { useRef, useCallback, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useAuthRole } from '@/hooks/queries/useAuth';
import { usePostDetail, usePostReviews } from '@/hooks/queries/usePosts';
import { useReviewPost } from '@/hooks/mutations/usePosts';
import { getTimeAgo } from '@/utils/date.util';
import { REJECT_REASONS, type RejectReasonCode } from '@/constants/review.constant';
import type { ReviewDecision } from '@/types/action.types';

// ── Status badge config ────────────────────────────────────────
const POST_STATUS_CONFIG = {
  PENDING_REVIEW:     { label: 'Chờ duyệt',          bg: 'bg-amber-50',   text: 'text-amber-600',  icon: 'clock' },
  PARTIALLY_APPROVED: { label: 'Đang xét duyệt',      bg: 'bg-blue-50',    text: 'text-blue-600',   icon: 'loader' },
  VERIFIED:           { label: 'Đã xác thực',         bg: 'bg-primary-50', text: 'text-primary-700',icon: 'check-circle' },
  REJECTED:           { label: 'Bị từ chối',          bg: 'bg-rose-50',    text: 'text-rose-500',   icon: 'x-circle' },
  FLAGGED:            { label: 'Đang bị gắn cờ',      bg: 'bg-orange-50',  text: 'text-orange-600', icon: 'flag' },
  REVOKED:            { label: 'Đã thu hồi điểm',     bg: 'bg-gray-100',   text: 'text-gray-500',   icon: 'slash' },
  DRAFT:              { label: 'Nháp',                bg: 'bg-gray-100',   text: 'text-gray-500',   icon: 'file' },
} as const;

// ── Review decision badge ──────────────────────────────────────
const DECISION_CONFIG = {
  APPROVE:           { label: 'Đã duyệt',    bg: 'bg-primary-50', text: 'text-primary-700' },
  REJECT:            { label: 'Từ chối',     bg: 'bg-rose-50',    text: 'text-rose-500' },
  REPORT_SUSPICIOUS: { label: 'Báo nghi vấn',bg: 'bg-orange-50',  text: 'text-orange-600' },
} as const;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { isCtv, userId } = useAuthRole();

  // ── Data ────────────────────────────────────────────────────
  const { data: post, isLoading: isLoadingPost } = usePostDetail(id);
  const { data: reviews = [], isLoading: isLoadingReviews } = usePostReviews(id);
  const { mutate: reviewPost, isPending: isReviewing } = useReviewPost(id);

  // ── Reject bottom sheet state ────────────────────────────────
  const rejectSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const [selectedReasonCode, setSelectedReasonCode] = useState<RejectReasonCode | null>(null);
  const [customNote, setCustomNote] = useState('');

  // ── Computed ─────────────────────────────────────────────────
  // CTV không thể duyệt bài của chính mình
  const alreadyReviewed = reviews.some((r) => r.reviewer_id === userId && r.is_valid);
  const canReview = isCtv && !alreadyReviewed && post?.status === 'PENDING_REVIEW';

  // ── Handlers ─────────────────────────────────────────────────
  const handleApprove = useCallback(() => {
    Alert.alert('Xác nhận duyệt', 'Bạn muốn duyệt bài đăng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Duyệt',
        onPress: () =>
          reviewPost(
            { decision: 'APPROVE' },
            {
              onSuccess: () => {
                Alert.alert('Thành công', 'Đã duyệt bài đăng.');
                router.back();
              },
              onError: (err: any) => {
                Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể duyệt bài.');
              },
            },
          ),
      },
    ]);
  }, [reviewPost]);

  const handleOpenRejectSheet = useCallback(() => {
    setSelectedReasonCode(null);
    setCustomNote('');
    rejectSheetRef.current?.present();
  }, []);

  const handleConfirmReject = useCallback(() => {
    if (!selectedReasonCode) return;

    const payload = {
      decision: 'REJECT' as ReviewDecision,
      reject_reason_code: selectedReasonCode,
      reject_reason_note: selectedReasonCode === 'OTHER' ? customNote.trim() : undefined,
    };

    reviewPost(payload, {
      onSuccess: () => {
        rejectSheetRef.current?.dismiss();
        Alert.alert('Đã ghi nhận', 'Bài đăng đã bị từ chối.');
        router.back();
      },
      onError: (err: any) => {
        Alert.alert('Lỗi', err?.response?.data?.message ?? 'Không thể từ chối bài.');
      },
    });
  }, [reviewPost, selectedReasonCode, customNote]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  // ── Loading ───────────────────────────────────────────────────
  if (isLoadingPost || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const statusCfg = POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (canReview ? 140 : 40) }}
      >
        {/* ── Header ── */}
        <View
          className="flex-row items-center border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
          style={{ paddingTop: insets.top + 16 }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary-50"
            hitSlop={8}
          >
            <Feather name="chevron-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="flex-1 font-inter-bold text-xl text-foreground">
            Chi tiết bài đăng
          </Text>
          {/* Status badge */}
          {statusCfg && (
            <View className={`flex-row items-center rounded-full px-3 py-1.5 ${statusCfg.bg}`}>
              <Feather
                name={statusCfg.icon as any}
                size={12}
                color={statusCfg.text.replace('text-', '')}
                style={{ marginRight: 4 }}
              />
              <Text className={`font-inter-semibold text-xs ${statusCfg.text}`}>
                {statusCfg.label}
              </Text>
            </View>
          )}
        </View>

        {/* ── User info ── */}
        <View className="flex-row items-center px-5 py-4">
          {post.user_avatar_url ? (
            <Image
              source={{ uri: post.user_avatar_url }}
              className="mr-3 h-12 w-12 rounded-full border border-primary"
            />
          ) : (
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full border border-primary bg-primary-50">
              <FontAwesome6 name="tree" size={20} color={colors.primary} />
            </View>
          )}
          <View className="flex-1">
            <Text className="font-inter-semibold text-base text-foreground">
              {post.user_display_name ?? 'Người dùng ẩn danh'}
            </Text>
            <Text className="mt-0.5 font-inter text-sm text-foreground/50">
              {getTimeAgo(post.created_at)}
            </Text>
          </View>
          {/* Approve count */}
          <View className="flex-row items-center rounded-full bg-primary-50 px-3 py-1.5">
            <Feather name="check-circle" size={13} color={colors.primary} />
            <Text className="ml-1.5 font-inter-semibold text-sm text-primary-700">
              {post.approve_count} duyệt · {post.reject_count} từ chối
            </Text>
          </View>
        </View>

        {/* ── Ảnh full width ── */}
        <Image
          source={{ uri: post.media_url }}
          className="h-80 w-full bg-primary-100"
          resizeMode="cover"
        />

        {/* ── Action type + Caption ── */}
        <View className="px-5 pt-5">
          {post.action_type && (
            <View className="mb-3 self-start rounded-full bg-primary-50 px-4 py-1.5">
              <Text className="font-inter-semibold text-sm text-primary-700">
                {post.action_type.group_name} · {post.action_type.action_name}
              </Text>
            </View>
          )}

          <View className="rounded-2xl bg-primary-50 p-4">
            <Text className="font-inter text-base leading-relaxed text-primary-800">
              {post.caption}
            </Text>
          </View>

          {/* Location nếu có */}
          {post.latitude && post.longitude && (
            <View className="mt-3 flex-row items-center">
              <Feather name="map-pin" size={14} color={colors.neutral400} />
              <Text className="ml-2 font-inter text-sm text-foreground/50">
                {post.latitude.toFixed(5)}, {post.longitude.toFixed(5)}
              </Text>
            </View>
          )}

          {/* Action date */}
          <View className="mt-1.5 flex-row items-center">
            <Feather name="calendar" size={14} color={colors.neutral400} />
            <Text className="ml-2 font-inter text-sm text-foreground/50">
              Ngày thực hiện: {post.action_date}
            </Text>
          </View>
        </View>

        {/* ── Lịch sử review ── */}
        <View className="mt-6 px-5">
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            Lịch sử duyệt bài
          </Text>

          {isLoadingReviews ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : reviews.length === 0 ? (
            <View className="rounded-2xl bg-primary-50 px-4 py-6 items-center dark:bg-card">
              <Feather name="clock" size={24} color={colors.primary300} />
              <Text className="mt-2 font-inter text-sm text-foreground/50">
                Chưa có lượt duyệt nào.
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {reviews.map((review, index) => {
                const decCfg = DECISION_CONFIG[review.decision];
                return (
                  <View
                    key={review.id}
                    className="flex-row items-start rounded-2xl bg-white px-4 py-3 shadow-sm shadow-black/5 dark:bg-card"
                  >
                    {/* Index */}
                    <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                      <Text className="font-inter-bold text-xs text-primary-700">
                        {index + 1}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-inter-medium text-sm text-foreground">
                          CTV #{review.reviewer_id.slice(0, 6)}
                        </Text>
                        <View className={`rounded-full px-2.5 py-0.5 ${decCfg.bg}`}>
                          <Text className={`font-inter-semibold text-[10px] ${decCfg.text}`}>
                            {decCfg.label}
                          </Text>
                        </View>
                      </View>

                      {/* Lý do từ chối */}
                      {review.reject_reason_code && (
                        <Text className="mt-1 font-inter text-xs text-foreground/50">
                          Lý do:{' '}
                          {REJECT_REASONS.find(
                            (r) => r.code === review.reject_reason_code,
                          )?.label ?? review.reject_reason_code}
                        </Text>
                      )}
                      {review.reject_reason_note && (
                        <Text className="mt-0.5 font-inter text-xs text-foreground/50 italic">
                          "{review.reject_reason_note}"
                        </Text>
                      )}

                      <Text className="mt-1 font-inter text-[11px] text-foreground/40">
                        {getTimeAgo(review.created_at)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom CTA — chỉ hiện khi CTV có thể duyệt ── */}
      {canReview && (
        <View
          className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          {/* Từ chối */}
          <TouchableOpacity
            onPress={handleOpenRejectSheet}
            className="flex-1 flex-row items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 py-3.5 active:opacity-80"
          >
            <Feather name="x-circle" size={18} color="#f43f5e" />
            <Text className="ml-2 font-inter-semibold text-base text-rose-500">Từ chối</Text>
          </TouchableOpacity>

          {/* Duyệt */}
          <TouchableOpacity
            onPress={handleApprove}
            disabled={isReviewing}
            className="flex-1 flex-row items-center justify-center rounded-2xl bg-primary py-3.5 active:opacity-80"
          >
            {isReviewing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Feather name="check-circle" size={18} color="white" />
                <Text className="ml-2 font-inter-semibold text-base text-white">Duyệt</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Reject Bottom Sheet ── */}
      <BottomSheetModal
        ref={rejectSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background, borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: colors.primary300, width: 40 }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
        >
          {/* Sheet header */}
          <View className="mb-5 flex-row items-center justify-between pt-2">
            <Text className="font-inter-bold text-lg text-foreground">
              Lý do từ chối
            </Text>
            <TouchableOpacity
              onPress={() => rejectSheetRef.current?.dismiss()}
              hitSlop={8}
            >
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
                  }`}
                >
                  {/* Radio indicator */}
                  <View
                    className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-primary' : 'border-primary-200'
                    }`}
                  >
                    {isSelected && (
                      <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text
                    className={`flex-1 font-inter-medium text-sm ${
                      isSelected ? 'text-primary-700' : 'text-foreground/80'
                    }`}
                  >
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom note — chỉ hiện khi chọn "OTHER" */}
          {selectedReasonCode === 'OTHER' && (
            <View className="mt-4">
              <Text className="mb-2 font-inter-medium text-sm text-foreground/70">
                Mô tả thêm *
              </Text>
              <TextInput
                className="min-h-[80px] rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 font-inter text-sm text-foreground"
                placeholder="Nhập lý do cụ thể..."
                placeholderTextColor="#9ca3af"
                value={customNote}
                onChangeText={setCustomNote}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Confirm button */}
          <Button
            title="Xác nhận từ chối"
            onPress={handleConfirmReject}
            isLoading={isReviewing}
            disabled={
              !selectedReasonCode ||
              (selectedReasonCode === 'OTHER' && customNote.trim().length === 0)
            }
            className={`mt-5 ${
              selectedReasonCode ? 'bg-rose-500' : 'bg-rose-200'
            }`}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
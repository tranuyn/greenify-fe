import { useRef, useCallback } from 'react';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/Text';
import { RejectSheet } from '@/components/features/community/RejectSheet';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { useAuthRole } from '@/hooks/queries/useAuth';
import { usePostDetail } from '@/hooks/queries/usePosts';
import { useReviewPost } from '@/hooks/mutations/usePosts';
import { getTimeAgo } from '@/utils/date.util';
import { REJECT_REASONS, type RejectReasonCode } from '@/constants/review.constant';
import type { PostReviewDto, PostStatus, ReviewDecision } from '@/types/action.types';

type PostStatusConfig = {
  labelKey: string;
  bgClass: string;
  textClass: string;
  icon: string;
};

const POST_STATUS_CONFIG: Record<PostStatus, PostStatusConfig> = {
  PENDING_REVIEW: {
    labelKey: 'community.post_status.pending_review',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    icon: 'clock',
  },
  PARTIALLY_APPROVED: {
    labelKey: 'community.post_status.partially_approved',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    icon: 'loader',
  },
  VERIFIED: {
    labelKey: 'community.post_status.verified',
    bgClass: 'bg-primary-50',
    textClass: 'text-primary-700',
    icon: 'check-circle',
  },
  REJECTED: {
    labelKey: 'community.post_status.rejected',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    icon: 'x-circle',
  },
  FLAGGED: {
    labelKey: 'community.post_status.flagged',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    icon: 'flag',
  },
  REVOKED: {
    labelKey: 'community.post_status.revoked',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
    icon: 'slash',
  },
  DRAFT: {
    labelKey: 'community.post_status.draft',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
    icon: 'file',
  },
};

type DecisionConfig = {
  labelKey: string;
  bgClass: string;
  textClass: string;
};

const DECISION_CONFIG: Record<ReviewDecision, DecisionConfig> = {
  APPROVE: {
    labelKey: 'community.review_decision.approve',
    bgClass: 'bg-primary-50',
    textClass: 'text-primary-700',
  },
  REJECT: {
    labelKey: 'community.review_decision.reject',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-500',
  },
  REPORT_SUSPICIOUS: {
    labelKey: 'community.review_decision.report_suspicious',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-600',
  },
};

export default function PostDetailScreen() {
  const { t } = useTranslation();
  const c = (key: string, fallback = '') => t(`common.${key}`, { defaultValue: fallback });
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { isCtv, userId } = useAuthRole();

  const { data: post, isLoading: isLoadingPost } = usePostDetail(id);
  const { mutate: reviewPost, isPending: isReviewing } = useReviewPost(id);

  const rejectSheetRef = useRef<BottomSheetModal>(null);

  const reviews: PostReviewDto[] = post?.reviews ?? [];
  const isLoadingReviews = isLoadingPost;
  const alreadyReviewed = reviews.some((r) => r.reviewerId === userId);
  const canReview = isCtv && !alreadyReviewed && post?.status === 'PENDING_REVIEW';

  const handleApprove = useCallback(() => {
    Alert.alert(
      t('community.post_detail.confirm_approve_title', 'Xác nhận duyệt'),
      t('community.post_detail.confirm_approve_message', 'Bạn muốn duyệt bài đăng này?'),
      [
        { text: c('cancel', 'Hủy'), style: 'cancel' },
        {
          text: t('community.post_detail.approve_btn', 'Duyệt'),
          onPress: () =>
            reviewPost(
              { decision: 'APPROVE' },
              {
                onSuccess: () => {
                  Alert.alert(
                    c('success', 'Thành công'),
                    t('community.post_detail.approve_success', 'Đã duyệt bài đăng.')
                  );
                  router.back();
                },
                onError: (err: any) => {
                  Alert.alert(
                    c('error', 'Lỗi'),
                    err?.response?.data?.message ??
                      t('community.post_detail.approve_error', 'Không thể duyệt bài.')
                  );
                },
              }
            ),
        },
      ]
    );
  }, [reviewPost, t, c]);

  const handleOpenRejectSheet = useCallback(() => {
    rejectSheetRef.current?.present();
  }, []);

  const handleConfirmReject = useCallback(
    (reasonCode: RejectReasonCode, note: string) => {
      const payload = {
        decision: 'REJECT' as ReviewDecision,
        reject_reason_code: reasonCode,
        reject_reason_note: reasonCode === 'OTHER' ? note.trim() : undefined,
      };

      reviewPost(payload, {
        onSuccess: () => {
          rejectSheetRef.current?.dismiss();
          Alert.alert(
            t('community.post_detail.confirm_reject_title', 'Đã ghi nhận'),
            t('community.post_detail.confirm_reject_message', 'Bài đăng đã bị từ chối.')
          );
          router.back();
        },
        onError: (err: any) => {
          Alert.alert(
            c('error', 'Lỗi'),
            err?.response?.data?.message ??
              t('community.post_detail.reject_error', 'Không thể từ chối bài.')
          );
        },
      });
    },
    [reviewPost, t, c]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  if (isLoadingPost || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const statusCfg = POST_STATUS_CONFIG[post.status as PostStatus];

  return (
    <View className="flex-1 bg-background">
      {/* ── Header (Fixed) ── */}
      <View
        className="z-10 flex-row items-center border-b border-primary-50 bg-background px-5 pb-4 dark:border-white/5"
        style={{ paddingTop: insets.top + 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-primary-50"
          hitSlop={8}>
          <Feather name="chevron-left" size={20} color={colors.background} />
        </TouchableOpacity>
        <Text className="flex-1 font-inter-bold text-xl text-foreground">
          {t('community.post_detail.header_title', 'Chi tiết bài đăng')}
        </Text>
        {statusCfg && (
          <View className={`flex-row items-center rounded-full px-3 py-1.5 ${statusCfg.bgClass}`}>
            <Feather
              name={statusCfg.icon as any}
              size={12}
              color={statusCfg.textClass.replace('text-', '')}
              style={{ marginRight: 4 }}
            />
            <Text
              useDefaultColor={false}
              className={`font-inter-semibold text-xs ${statusCfg.textClass}`}>
              {t(statusCfg.labelKey)}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (canReview ? 140 : 40) }}>
        <View className="flex-row items-center px-5 py-4">
          {post.authorAvatarUrl  ? (
            <Image
              source={{ uri: post.authorAvatarUrl  }}
              className="mr-3 h-12 w-12 rounded-full border border-primary"
            />
          ) : (
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full border border-primary bg-primary-50">
              <FontAwesome6 name="tree" size={20} color={colors.primary} />
            </View>
          )}
          <View className="flex-1">
            <Text className="font-inter-semibold text-base text-foreground">
              {post.authorDisplayName ??
                t('community.post_detail.anonymous_user', 'Người dùng ẩn danh')}
            </Text>
            <Text className="text-foreground/50 mt-0.5 font-inter text-sm">
              {getTimeAgo(post.createdAt)}
            </Text>
          </View>
          {/* Approve count */}
          <View className="flex-row items-center rounded-full bg-primary-50 px-3 py-1.5">
            <Feather name="check-circle" size={13} color={colors.primary} />
            <Text className="ml-1.5 font-inter-semibold text-sm text-primary-700">
              {t('community.post_detail.approve_count', {
                count: post.approveCount,
                defaultValue: `${post.approveCount} duyệt`,
              })}{' '}
              ·{' '}
              {t('community.post_detail.reject_count', {
                count: post.rejectCount,
                defaultValue: `${post.rejectCount} từ chối`,
              })}
            </Text>
          </View>
        </View>

        <Image
          source={{ uri: post.mediaUrl }}
          className="h-80 w-full bg-primary-100"
          resizeMode="cover"
        />
        <View className="px-5 pt-5">
          {post.actionTypeName && (
            <View className="mb-3 self-start rounded-full bg-primary-50 px-4 py-1.5">
              <Text className="font-inter-semibold text-sm text-primary-700">
                {post.actionTypeName}
              </Text>
            </View>
          )}

          <View className="rounded-2xl bg-primary-50 p-4">
            <Text className="font-inter text-base leading-relaxed text-primary-800">
              {post.caption}
            </Text>
          </View>

          {/* Location nếu có */}
          {post.location && (
            <View className="mt-3 flex-row items-center">
              <Feather name="map-pin" size={14} color={colors.neutral400} />
              <Text className="text-foreground/50 ml-2 font-inter text-sm">
                {/* {post.latitude.toFixed(5)}, {post.longitude.toFixed(5)} */}
                {post.location}
              </Text>
            </View>
          )}

          <View className="mt-1.5 flex-row items-center">
            <Feather name="calendar" size={14} color={colors.neutral400} />
            <Text className="text-foreground/50 ml-2 font-inter text-sm">
              {t('community.post_detail.action_date', {
                date: post.actionDate,
                defaultValue: `Ngày thực hiện: ${post.actionDate}`,
              })}
            </Text>
          </View>
        </View>

        {/* ── Lịch sử review ── */}
        <View className="mt-6 px-5">
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            {t('community.post_detail.review_history', 'Lịch sử duyệt bài')}
          </Text>

          {isLoadingReviews ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : reviews.length === 0 ? (
            <View className="items-center rounded-2xl bg-primary-50 px-4 py-6 dark:bg-card">
              <Feather name="clock" size={24} color={colors.primary300} />
              <Text className="text-foreground/50 mt-2 font-inter text-sm">
                {t('community.post_detail.no_reviews', 'Chưa có lượt duyệt nào.')}
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {reviews.map((review, index) => {
                const decCfg = DECISION_CONFIG[review.decision];
                return (
                  <View
                    key={review.reviewId}
                    className="flex-row items-start rounded-2xl bg-white px-4 py-3 shadow-sm shadow-black/5 dark:bg-card">
                    {/* Index */}
                    <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                      <Text className="font-inter-bold text-xs text-primary-700">{index + 1}</Text>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-inter-medium text-sm text-foreground">
                          CTV #{review.reviewerId.slice(0, 6)}
                        </Text>
                        <View className={`rounded-full px-2.5 py-0.5 ${decCfg.bgClass}`}>
                          <Text
                            useDefaultColor={false}
                            className={`font-inter-semibold text-[10px] ${decCfg.textClass}`}>
                            {t(decCfg.labelKey)}
                          </Text>
                        </View>
                      </View>

                      {/* Lý do từ chối */}
                      {review.rejectReason  && (
                        <Text className="text-foreground/50 mt-1 font-inter text-xs">
                          {t('community.post_detail.reason', 'Lý do')}:{' '} `${review.rejectReason}`
                          {/* {REJECT_REASONS.find((r) => r.code === review.rejectReasonCode)
                            ?.label ?? review.rejectReasonCode} */}
                        </Text>
                      )}
                      {review.rejectReason && (
                        <Text className="text-foreground/50 mt-0.5 font-inter text-xs italic">
                          {review.rejectReason}
                        </Text>
                      )}

                      <Text className="text-foreground/40 mt-1 font-inter text-[11px]">
                        {getTimeAgo(review.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {canReview && (
        <View
          className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-primary-50 bg-background px-5 pt-3 dark:border-white/5"
          style={{ paddingBottom: insets.bottom + 12 }}>
          {/* Từ chối */}
          <TouchableOpacity
            onPress={handleOpenRejectSheet}
            className="flex-1 flex-row items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 py-3.5 active:opacity-80">
            <Feather name="x-circle" size={18} color={colors.error} />
            <Text className="ml-2 font-inter-semibold text-base" style={{ color: colors.error }}>
              {t('community.post_detail.reject_btn', 'Từ chối')}
            </Text>
          </TouchableOpacity>

          {/* Duyệt */}
          <TouchableOpacity
            onPress={handleApprove}
            disabled={isReviewing}
            className="flex-1 flex-row items-center justify-center rounded-2xl bg-primary py-3.5 active:opacity-80">
            {isReviewing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Feather name="check-circle" size={18} color="white" />
                <Text className="ml-2 font-inter-semibold text-base text-white">
                  {t('community.post_detail.approve_btn', 'Duyệt')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Reject Bottom Sheet ── */}
      <RejectSheet
        ref={rejectSheetRef}
        colors={colors}
        insets={insets}
        isReviewing={isReviewing}
        onSubmit={handleConfirmReject}
        renderBackdrop={renderBackdrop}
      />
    </View>
  );
}

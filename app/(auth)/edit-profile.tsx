import { router } from 'expo-router';
import { View, Pressable, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useCompleteProfile,
  useUpdateProfile,
  useUpdateNgoProfile,
} from '@/hooks/mutations/useAuth';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import type { CompleteProfileRequest, CreateNgoProfileRequest } from '@/types/user.type';
import { ProfileForm } from '@/components/shared/auth/ProfileForm';
import { NGOProfileForm } from '@/components/shared/auth/NGOProfileForm';

export default function EditProfileScreen() {
  const { data: meData, isLoading: isLoadingUser } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: updateNgoProfile, isPending: isUpdatingNgoProfile } = useUpdateNgoProfile();
  const { mutate: completeProfile, isPending: isCompleteProfilePending } = useCompleteProfile();
  const isNgoProfile = meData?.roles?.includes('NGO') ?? false;
  const isCitizenProfile = meData?.userProfile && 'displayName' in meData.userProfile;
  const handleUpdateProfile = (data: CompleteProfileRequest) => {
    if (!meData) return;
    if (meData?.userProfile?.id)
      updateProfile(data, {
        onSuccess: () => {
          router.back();
        },
      });
    else
      completeProfile(data, {
        onSuccess: () => {
          router.back();
        },
      });
  };

  const handleUpdateNgoProfile = (data: CreateNgoProfileRequest) => {
    updateNgoProfile(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header cho Edit Profile */}
      <View className="z-10 items-center justify-center border-b border-gray-100  px-4 pb-4 pt-20 shadow-sm">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="absolute bottom-4 left-4 h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Ionicons name="chevron-back" size={20} color="#166534" />
        </Pressable>
        <Text className="text-center font-inter-bold  text-lg text-gray-900">
          Thông tin tài khoản
        </Text>
      </View>

      {isLoadingUser && !meData ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : isNgoProfile ? (
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          <NGOProfileForm
            email={meData?.email ?? ''}
            initialValues={{
              orgName: meData?.ngoProfile?.orgName,
              representativeName: meData?.ngoProfile?.representativeName,
              hotline: meData?.ngoProfile?.hotline,
              contactEmail: meData?.ngoProfile?.contactEmail ?? meData?.email,
              description: meData?.ngoProfile?.description,
              address: meData?.ngoProfile?.address,
              avatar: meData?.ngoProfile?.avatar,
              verificationDocs: meData?.ngoProfile?.verificationDocs,
            }}
            isEditMode
            isLoading={isUpdatingNgoProfile || isLoadingUser}
            onSubmitForm={handleUpdateNgoProfile}
          />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          <NGOProfileForm
            email={meData?.email ?? ''}
            initialValues={{
              orgName: meData?.ngoProfile?.orgName,
              representativeName: meData?.ngoProfile?.representativeName,
              hotline: meData?.ngoProfile?.hotline,
              contactEmail: meData?.ngoProfile?.contactEmail ?? meData?.email,
              description: meData?.ngoProfile?.description,
              address: meData?.ngoProfile?.address,
              avatar: meData?.ngoProfile?.avatar,
              verificationDocs: meData?.ngoProfile?.verificationDocs,
            }}
            isEditMode
            isLoading={isUpdatingNgoProfile || isLoadingUser}
            onSubmitForm={handleUpdateNgoProfile}
          />
        </ScrollView>
      )}
    </View>
  );
}

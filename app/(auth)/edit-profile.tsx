import { router } from 'expo-router';
import { View, Pressable, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateProfile } from '@/hooks/mutations/useAuth';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import type { CompleteProfileFormData } from '@/validations/auth.schema';
import { ProfileForm } from '@/components/shared/auth/ProfileForm';

export default function EditProfileScreen() {
  const { data: meData, isLoading: isLoadingUser } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const currentProfile = meData?.userProfile;
  const isCitizenProfile = currentProfile && 'displayName' in currentProfile;
  const handleUpdateProfile = (data: CompleteProfileFormData) => {
    updateProfile(data, {
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

      {/* Form Content */}
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <ProfileForm
          email={meData?.user?.email ?? ''}
          initialValues={{
            displayName: isCitizenProfile ? currentProfile.displayName || '' : '',
            province: meData?.userProfile?.province ?? '',
            ward: meData?.userProfile?.ward ?? '',
          }}
          isEditMode={true}
          isLoading={isPending || isLoadingUser}
          onSubmitForm={handleUpdateProfile}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </View>
  );
}

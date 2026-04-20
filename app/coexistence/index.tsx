import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WasteTypeFilter } from '@/components/features/map/WasteTypeFilter';
import { toLabel } from '@/constants/severityTierLabel';
import { useReverseGeocode } from '@/hooks/useReverseGeocode.hook';
import { useTrashSpotDetail, useTrashSpots } from '@/hooks/queries/useTrashReports';
import { useWasteTypes } from '@/hooks/queries/useMap';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import { Text } from '@/components/ui/Text';
import type { TrashSpotListItem } from '@/types/community.types';
import { SeverityTier } from '@/types/community.types';
import { useTranslation } from 'react-i18next';
import MapViewTrashSpot from './components/MapViewTrashSpot';
import TrashSpotBottomSheet from './components/TrashSpotBottomSheet';
export default function MapScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const { data: wasteTypes } = useWasteTypes();
  const [selectedTrashSpot, setSelectedTrashSpot] = useState<TrashSpotListItem | null>(null);
  const [activeWasteTypeID, setActiveWasteTypeID] = useState<string | null>(null);
  const [activeSeverityTier, setActiveSeverityTier] = useState<SeverityTier | null>(null);

  const trashSpotParams = useMemo(
    () => ({
      wasteTypeId: activeWasteTypeID ?? undefined,
      severityTier: activeSeverityTier ?? undefined,
    }),
    [activeWasteTypeID, activeSeverityTier]
  );

  const { data: trashSpotsData, isLoading } = useTrashSpots(trashSpotParams);
  const { data: selectedTrashSpotDetail, isFetching: isLoadingTrashSpotDetail } =
    useTrashSpotDetail(selectedTrashSpot?.id);

  const { address: selectedAddress, isLoading: isResolvingSelectedAddress } = useReverseGeocode({
    latitude: selectedTrashSpotDetail?.latitude ?? selectedTrashSpot?.latitude,
    longitude: selectedTrashSpotDetail?.longitude ?? selectedTrashSpot?.longitude,
    fallbackAddress: selectedTrashSpotDetail?.province ?? selectedTrashSpot?.province ?? '',
  });

  const handleCloseSheet = useCallback(() => {
    setSelectedTrashSpot(null);
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* Map chiếm toàn màn hình */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <MapViewTrashSpot
          trashSpots={trashSpotsData || []}
          selectedStation={selectedTrashSpot}
          onSelectStation={setSelectedTrashSpot}
        />
      )}

      {/* Search bar nổi phía trên map */}
      <View className="absolute left-0 right-0 px-4" style={{ top: insets.top + 12 }}>
        <View className=" flex-row items-center">
          <TouchableOpacity
            className="mr-3 h-[48px] w-[48px] items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/10 dark:bg-card"
            onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.neutral400} />
          </TouchableOpacity>
          {/* Severity tier filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
            <View className="flex-row gap-x-2 px-4">
              {[
                { value: SeverityTier.SEVERITY_LOW },
                { value: SeverityTier.SEVERITY_MEDIUM },
                { value: SeverityTier.SEVERITY_HIGH },
              ].map((tier) => (
                <TouchableOpacity
                  key={tier.value}
                  className={`rounded-full px-4 py-2 ${
                    activeSeverityTier === tier.value ? 'bg-primary' : 'bg-background'
                  }`}
                  onPress={() =>
                    setActiveSeverityTier((prev) => (prev === tier.value ? null : tier.value))
                  }>
                  <Text
                    className={`font-inter-medium text-sm ${
                      activeSeverityTier === tier.value ? 'text-on-primary' : 'text-foreground'
                    }`}>
                    {toLabel(tier.value, t)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Waste type filter chips */}
        <View className="-mx-4 mt-2">
          <WasteTypeFilter
            types={wasteTypes || []}
            activeType={activeWasteTypeID}
            onSelect={(typeID) => setActiveWasteTypeID((prev) => (prev === typeID ? null : typeID))}
          />
        </View>
      </View>

      {/* Bottom sheet khi chọn station */}
      {selectedTrashSpot && (
        <TrashSpotBottomSheet
          station={selectedTrashSpot}
          detail={selectedTrashSpotDetail}
          resolvedAddress={selectedAddress}
          isResolvingAddress={isResolvingSelectedAddress}
          isDetailLoading={isLoadingTrashSpotDetail}
          onClose={handleCloseSheet}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/coexistence/create-trash-spot')}
        className="absolute right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-2xl shadow-black/25"
        style={{ bottom: insets.bottom + 20, elevation: 8 }}>
        <Feather name="plus" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

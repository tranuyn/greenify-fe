import { useState, useCallback, useMemo } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

import { MapView } from '@/components/features/map/MapView';
import { useStations } from '@/hooks/queries/useMap';
import { useThemeColor } from '@/hooks/useThemeColor.hook';
import type { RecyclingStation } from '@/types/community.types';
import { SearchBar } from '@/components/shared/SearchBar';
import { WasteTypeFilter } from '@/components/features/map/WasteTypeFilter';
import { StationBottomSheet } from '@/components/features/map/StationBottomSheet';

export default function MapScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();

  const [selectedStation, setSelectedStation] = useState<RecyclingStation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWasteType, setActiveWasteType] = useState<string | null>(null);

  const { data: stations = [], isLoading } = useStations();

  // Filter stations theo search + waste type
  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchWaste = !activeWasteType || s.waste_types.includes(activeWasteType);

      return matchSearch && matchWaste;
    });
  }, [stations, searchQuery, activeWasteType]);

  // Tất cả waste types có trong data — dùng cho filter chips
  const allWasteTypes = useMemo(() => {
    const set = new Set<string>();
    stations.forEach((s) => s.waste_types.forEach((w) => set.add(w)));
    return Array.from(set).sort();
  }, [stations]);

  const handleSelectStation = useCallback((station: RecyclingStation) => {
    setSelectedStation(station);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedStation(null);
  }, []);

  return (
    <View className="flex-1 bg-background">
      {/* Map chiếm toàn màn hình */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <MapView
          stations={filteredStations}
          selectedStation={selectedStation}
          onSelectStation={handleSelectStation}
        />
      )}

      {/* Search bar nổi phía trên map */}
      <View className="absolute left-0 right-0 px-4" style={{ top: insets.top + 12 }}>
        <View className="flex-row items-center">
          <TouchableOpacity 
             className="mr-3 h-[48px] w-[48px] items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/10 dark:bg-card"
             onPress={() => router.back()}
          >
             <Feather name="arrow-left" size={24} color={colors.neutral400} />
          </TouchableOpacity>
          <SearchBar 
             value={searchQuery} 
             onChangeText={setSearchQuery} 
             placeholder={t('map.search_placeholder', 'Tìm điểm thu gom...')}
             containerClassName="flex-1 bg-white shadow-sm shadow-black/10 dark:bg-card"
             inputClassName="h-12"
          />
        </View>

        {/* Waste type filter chips */}
        <View className="-mx-4 mt-2">
          <WasteTypeFilter
            types={allWasteTypes}
            activeType={activeWasteType}
            onSelect={(type: any) => setActiveWasteType((prev) => (prev === type ? null : type))}
          />
        </View>
      </View>

      {/* Bottom sheet khi chọn station */}
      {selectedStation && (
        <StationBottomSheet station={selectedStation} onClose={handleCloseSheet} />
      )}
    </View>
  );
}

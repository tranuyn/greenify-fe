import { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import RNMapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import type { RecyclingStation } from '@/types/community.types';
import { useThemeColor } from '@/hooks/useThemeColor.hook';

// TP.HCM center — default region
const DEFAULT_REGION = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type Props = {
  stations: RecyclingStation[];
  selectedStation: RecyclingStation | null;
  onSelectStation: (station: RecyclingStation) => void;
};

export function MapView({ stations, selectedStation, onSelectStation }: Props) {
  const mapRef = useRef<RNMapView>(null);
  const colors = useThemeColor();

  // Animate map về station được chọn
  useEffect(() => {
    if (selectedStation) {
      mapRef.current?.animateToRegion(
        {
          latitude: selectedStation.latitude - 0.003, // offset xuống chút để sheet không che
          longitude: selectedStation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );
    }
  }, [selectedStation]);

  return (
    <RNMapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      initialRegion={DEFAULT_REGION}
      showsUserLocation
      showsMyLocationButton={false}>
      {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => onSelectStation(station)}
          pinColor={selectedStation?.id === station.id ? colors.primary600 : colors.primary500}
        />
      ))}
    </RNMapView>
  );
}

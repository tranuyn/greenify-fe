import { Linking, Platform } from 'react-native';

type OpenDirectionsParams = {
  latitude: number;
  longitude: number;
};

export async function openDirections({ latitude, longitude }: OpenDirectionsParams) {
  const googleAppUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
  const googleWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

  if (Platform.OS === 'ios') {
    const canOpenGoogleApp = await Linking.canOpenURL(googleAppUrl);
    await Linking.openURL(canOpenGoogleApp ? googleAppUrl : appleMapsUrl);
    return;
  }

  await Linking.openURL(googleWebUrl);
}

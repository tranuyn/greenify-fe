import * as Location from 'expo-location';

const DEFAULT_REVERSE_GEOCODE_TTL_MS = 5 * 60 * 1000;

type ReverseGeocodeCacheEntry = {
  value: Location.LocationGeocodedAddress[];
  expiresAt: number;
};

const reverseGeocodeCache = new Map<string, ReverseGeocodeCacheEntry>();
const reverseGeocodeInFlight = new Map<string, Promise<Location.LocationGeocodedAddress[]>>();

const toCacheKey = (latitude: number, longitude: number) =>
  `${latitude.toFixed(4)}:${longitude.toFixed(4)}`;

export async function reverseGeocodeWithCache(
  coords: Location.LocationGeocodedLocation,
  ttlMs = DEFAULT_REVERSE_GEOCODE_TTL_MS
): Promise<Location.LocationGeocodedAddress[]> {
  const cacheKey = toCacheKey(coords.latitude, coords.longitude);
  const now = Date.now();
  const cached = reverseGeocodeCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const inFlightRequest = reverseGeocodeInFlight.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = Location.reverseGeocodeAsync(coords)
    .then((result) => {
      reverseGeocodeCache.set(cacheKey, {
        value: result,
        expiresAt: Date.now() + ttlMs,
      });
      return result;
    })
    .finally(() => {
      reverseGeocodeInFlight.delete(cacheKey);
    });

  reverseGeocodeInFlight.set(cacheKey, request);

  return request;
}

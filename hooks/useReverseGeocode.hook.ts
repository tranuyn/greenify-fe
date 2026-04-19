import { useEffect, useMemo, useState } from 'react';
import { reverseGeocodeWithCache } from '@/utils/reverseGeocode.util';

type Params = {
  latitude?: number | null;
  longitude?: number | null;
  fallbackAddress?: string;
};

type ReturnValue = {
  address: string;
  isLoading: boolean;
};

export function useReverseGeocode({
  latitude,
  longitude,
  fallbackAddress = '',
}: Params): ReturnValue {
  const [address, setAddress] = useState(fallbackAddress);
  const [isLoading, setIsLoading] = useState(false);

  const normalizedFallback = useMemo(() => fallbackAddress.trim(), [fallbackAddress]);

  useEffect(() => {
    let isCancelled = false;

    const resolveAddress = async () => {
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        setAddress(normalizedFallback);
        return;
      }

      setIsLoading(true);

      try {
        const geocoded = await reverseGeocodeWithCache({ latitude, longitude });
        const first = geocoded[0];

        const parts = [
          first?.name,
          first?.street,
          first?.district,
          first?.city,
          first?.region,
          first?.country,
        ].filter(Boolean);

        const resolved = parts.length > 0 ? parts.join(', ') : normalizedFallback;

        if (!isCancelled) {
          setAddress(resolved);
        }
      } catch {
        if (!isCancelled) {
          setAddress(normalizedFallback);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    resolveAddress();

    return () => {
      isCancelled = true;
    };
  }, [latitude, longitude, normalizedFallback]);

  return { address, isLoading };
}

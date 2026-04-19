import type { TFunction } from 'i18next';

import { SeverityTier } from '@/types/community.types';

export const SEVERITY_TIER_LABEL_KEYS: Record<SeverityTier, string> = {
  [SeverityTier.SEVERITY_LOW]: 'coexistence.severity.low',
  [SeverityTier.SEVERITY_MEDIUM]: 'coexistence.severity.medium',
  [SeverityTier.SEVERITY_HIGH]: 'coexistence.severity.high',
};

export const toLabel = (severityTier: SeverityTier | undefined, t: TFunction): string => {
  if (!severityTier) {
    return t('coexistence.severity.unknown');
  }

  return t(SEVERITY_TIER_LABEL_KEYS[severityTier]);
};

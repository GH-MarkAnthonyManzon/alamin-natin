import type { Source } from './types';
import {
  getMediaSourceMeta,
  type MediaReliability,
  type MediaBias,
  type MediaStatus,
} from './media-sources';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface SourceWithMeta extends Source {
  reliability?: MediaReliability;
  bias?: MediaBias;
  status?: MediaStatus;
}

export function enrichSource(source: Source): SourceWithMeta {
  const meta = getMediaSourceMeta(source.url || source.label);

  if (!meta) {
    return source;
  }

  return {
    ...source,
    reliability: meta.reliability,
    bias: meta.bias,
    status: meta.status,
  };
}

export function getSourceConfidence(source: Source): ConfidenceLevel {
  const meta = getMediaSourceMeta(source.url || source.label);
  if (!meta) return 'low';

  if (meta.status === 'Reputable' || meta.status === 'Watchdog') {
    return 'high';
  }

  if (meta.status === 'Biased Opinion' || meta.status === 'Tabloid') {
    return 'medium';
  }

  // Propaganda, Unverified, User-Generated
  return 'low';
}

export function isStrongSource(source: Source): boolean {
  return getSourceConfidence(source) === 'high';
}



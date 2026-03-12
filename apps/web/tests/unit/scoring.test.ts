import { describe, expect, it } from 'vitest';

import { calculateFinalScore, classifyDecision, mapDecisionToTrackingStatus } from '@/server/services/scoring';

describe('scoring service', () => {
  it('calculates final score based on DP2 formula', () => {
    const score = calculateFinalScore({
      nameScore: 0.77,
      affiliationScore: 0.67,
      timelineScore: 0.97,
      fieldScore: 0.74,
      crossValidationBonus: 0.08,
      conflictPenalty: 0
    });

    expect(score).toBe(0.86);
  });

  it('classifies thresholds correctly', () => {
    expect(classifyDecision(0.8)).toBe('KEMUNGKINAN_KUAT');
    expect(classifyDecision(0.65)).toBe('PERLU_VERIFIKASI');
    expect(classifyDecision(0.59)).toBe('TIDAK_COCOK');
  });

  it('maps decision to tracking status', () => {
    expect(mapDecisionToTrackingStatus('KEMUNGKINAN_KUAT')).toBe('TERIDENTIFIKASI');
    expect(mapDecisionToTrackingStatus('PERLU_VERIFIKASI')).toBe('PERLU_VERIFIKASI_MANUAL');
    expect(mapDecisionToTrackingStatus('TIDAK_COCOK')).toBe('BELUM_DITEMUKAN');
  });
});

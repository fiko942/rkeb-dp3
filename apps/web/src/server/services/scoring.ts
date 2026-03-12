import { SCORE_WEIGHTS, THRESHOLDS } from '@/lib/constants';
export type DecisionLabel = 'KEMUNGKINAN_KUAT' | 'PERLU_VERIFIKASI' | 'TIDAK_COCOK';
export type TrackingStatus =
  | 'TERIDENTIFIKASI'
  | 'PERLU_VERIFIKASI_MANUAL'
  | 'BELUM_DITEMUKAN'
  | 'BELUM_DILACAK';

export type ScoreInput = {
  nameScore: number;
  affiliationScore: number;
  timelineScore: number;
  fieldScore: number;
  crossValidationBonus?: number;
  conflictPenalty?: number;
};

export function calculateFinalScore(input: ScoreInput): number {
  const weighted =
    SCORE_WEIGHTS.name * input.nameScore +
    SCORE_WEIGHTS.affiliation * input.affiliationScore +
    SCORE_WEIGHTS.timeline * input.timelineScore +
    SCORE_WEIGHTS.field * input.fieldScore;

  return Number((weighted + (input.crossValidationBonus ?? 0) - (input.conflictPenalty ?? 0)).toFixed(2));
}

export function classifyDecision(score: number): DecisionLabel {
  if (score >= THRESHOLDS.strong) return 'KEMUNGKINAN_KUAT';
  if (score >= THRESHOLDS.review) return 'PERLU_VERIFIKASI';
  return 'TIDAK_COCOK';
}

export function mapDecisionToTrackingStatus(decision: DecisionLabel): TrackingStatus {
  if (decision === 'KEMUNGKINAN_KUAT') return 'TERIDENTIFIKASI';
  if (decision === 'PERLU_VERIFIKASI') return 'PERLU_VERIFIKASI_MANUAL';
  return 'BELUM_DITEMUKAN';
}

export function labelDecision(decision: DecisionLabel): string {
  switch (decision) {
    case 'KEMUNGKINAN_KUAT':
      return 'Kemungkinan kuat';
    case 'PERLU_VERIFIKASI':
      return 'Perlu verifikasi';
    case 'TIDAK_COCOK':
      return 'Tidak cocok';
  }
}

export function labelTrackingStatus(status: TrackingStatus): string {
  switch (status) {
    case 'TERIDENTIFIKASI':
      return 'Teridentifikasi dari sumber publik';
    case 'PERLU_VERIFIKASI_MANUAL':
      return 'Perlu Verifikasi Manual';
    case 'BELUM_DITEMUKAN':
      return 'Belum ditemukan di sumber publik';
    case 'BELUM_DILACAK':
      return 'Belum Dilacak';
  }
}

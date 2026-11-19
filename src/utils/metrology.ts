import type { FlowRegime } from '../data/installationData';

export interface HydraulicInput {
  pumpOn: boolean;
  ballValveOpen: boolean;
  regime: FlowRegime;
}

export interface HydraulicState {
  statusCode: 'IDLE' | 'BLOCKED' | 'FLOWING';
  statusLabel: string;
  statusNote: string;
  suctionActive: boolean;
  upstreamActive: boolean;
  downstreamActive: boolean;
  returnActive: boolean;
  flowRateLph: number;
  pressureBar: number;
  valveOpeningPercent: number;
}

const REGIME_SPEC: Record<
  FlowRegime,
  { flowRateLph: number; pressureBar: number; valveOpeningPercent: number; tolerancePercent: number }
> = {
  Q1: { flowRateLph: 32, pressureBar: 1.8, valveOpeningPercent: 18, tolerancePercent: 5.0 },
  Q2: { flowRateLph: 50, pressureBar: 1.6, valveOpeningPercent: 34, tolerancePercent: 2.0 },
  Q3: { flowRateLph: 2500, pressureBar: 1.2, valveOpeningPercent: 100, tolerancePercent: 2.0 },
};

export function computeHydraulicState(input: HydraulicInput): HydraulicState {
  const spec = REGIME_SPEC[input.regime];

  if (!input.pumpOn) {
    return {
      statusCode: 'IDLE',
      statusLabel: 'SIAGA · Pompa Mati',
      statusNote: 'Sistem tidak bertekanan. Aman untuk memasang atau melepas meter air uji.',
      suctionActive: false,
      upstreamActive: false,
      downstreamActive: false,
      returnActive: false,
      flowRateLph: 0,
      pressureBar: 0,
      valveOpeningPercent: spec.valveOpeningPercent,
    };
  }

  if (!input.ballValveOpen) {
    return {
      statusCode: 'BLOCKED',
      statusLabel: 'TERTAHAN · Katup Bola Tertutup',
      statusNote:
        'Pompa aktif namun aliran tertahan pada Katup Bola (03). Buka katup atau matikan pompa.',
      suctionActive: true,
      upstreamActive: true,
      downstreamActive: false,
      returnActive: false,
      flowRateLph: 0,
      pressureBar: 2.4,
      valveOpeningPercent: spec.valveOpeningPercent,
    };
  }

  return {
    statusCode: 'FLOWING',
    statusLabel: `ALIRAN AKTIF · Debit ${input.regime}`,
    statusNote: `Sirkulasi tertutup berjalan stabil pada ${spec.flowRateLph.toLocaleString('id-ID')} L/jam melewati Meter Uji dan Master Meter.`,
    suctionActive: true,
    upstreamActive: true,
    downstreamActive: true,
    returnActive: true,
    flowRateLph: spec.flowRateLph,
    pressureBar: spec.pressureBar,
    valveOpeningPercent: spec.valveOpeningPercent,
  };
}

export interface ErrorCalculationInput {
  testedVolumeL: number;
  masterVolumeL: number;
  regime: FlowRegime;
}

export interface ErrorCalculationResult {
  valid: boolean;
  errorPercent: number | null;
  tolerancePercent: number;
  isWithinTolerance: boolean | null;
  statusLabel: 'LULUS UJI' | 'PERLU KALIBRASI' | 'INPUT TIDAK VALID';
  recommendation: string;
}

export function getToleranceForRegime(regime: FlowRegime): number {
  return REGIME_SPEC[regime].tolerancePercent;
}

export function calculateMeterError(input: ErrorCalculationInput): ErrorCalculationResult {
  const tolerancePercent = getToleranceForRegime(input.regime);

  if (
    !Number.isFinite(input.testedVolumeL) ||
    !Number.isFinite(input.masterVolumeL) ||
    input.testedVolumeL < 0 ||
    input.masterVolumeL <= 0
  ) {
    return {
      valid: false,
      errorPercent: null,
      tolerancePercent,
      isWithinTolerance: null,
      statusLabel: 'INPUT TIDAK VALID',
      recommendation:
        'Masukkan volume Master Meter lebih besar dari 0 liter dan volume Meter Uji bernilai positif.',
    };
  }

  const rawError = ((input.testedVolumeL - input.masterVolumeL) / input.masterVolumeL) * 100;
  const errorPercent = Math.round(rawError * 100) / 100;
  const isWithinTolerance = Math.abs(errorPercent) <= tolerancePercent;

  return {
    valid: true,
    errorPercent,
    tolerancePercent,
    isWithinTolerance,
    statusLabel: isWithinTolerance ? 'LULUS UJI' : 'PERLU KALIBRASI',
    recommendation: isWithinTolerance
      ? `Nilai galat berada dalam batas toleransi ±${tolerancePercent.toFixed(1)}% untuk titik uji ${input.regime}.`
      : `Galat melampaui batas toleransi ±${tolerancePercent.toFixed(1)}% untuk titik uji ${input.regime}. Lakukan pemeriksaan ulang, pembersihan strainer, atau kalibrasi meter.`,
  };
}

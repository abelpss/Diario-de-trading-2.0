import type { OperationType, Setup, Trend, Location, TimeFrame, Outcome, TrailingStop, Result } from './types';

export const OPERATION_TYPE_OPTIONS: { value: OperationType; label: string }[] = [
  { value: 'buy', label: 'Compra 🟢' },
  { value: 'sell', label: 'Venda 🔴' },
];

export const SETUP_OPTIONS: { value: Setup; label: string }[] = [
  { value: 'breakout', label: 'Rompimento' },
  { value: 'pullback', label: 'Pullback' },
];

export const TREND_OPTIONS: { value: Trend; label: string }[] = [
  { value: 'with_m200', label: 'A favor da M200' },
  { value: 'against_m200', label: 'Contra a M200' },
];

export const LOCATION_OPTIONS: { value: Location; label: string }[] = [
  { value: 'near_m200', label: 'Perto da M200' },
  { value: 'far_from_m200', label: 'Longe da M200' },
];

export const TIMEFRAME_OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: 'M2', label: 'M2' },
  { value: 'M5', label: 'M5' },
  { value: 'M15', label: 'M15' },
  { value: 'H1', label: 'H1' },
];

export const TRAILING_STOP_OPTIONS: { value: TrailingStop; label: string }[] = [
    { value: 'T/F', label: 'T/F' },
    { value: 'B/B', label: 'B/B' },
];

export const RESULT_OPTIONS: { value: Result; label: string }[] = [
    { value: 'gain', label: 'Gain' },
    { value: 'loss', label: 'Loss' },
];

export const OUTCOME_OPTIONS: { value: Outcome; label: string }[] = [
  { value: '-1', label: '-1 (Loss)' },
  { value: '1:1', label: '1:1' },
  { value: '2:1', label: '2:1' },
  { value: '3:1', label: '3:1' },
  { value: '4:1', label: '4:1' },
];

export const OUTCOME_R_MAP: Record<Outcome, number> = {
  '-1': -1,
  '1:1': 1,
  '2:1': 2,
  '3:1': 3,
  '4:1': 4,
};
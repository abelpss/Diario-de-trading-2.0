export type OperationType = 'buy' | 'sell';
export type Setup = 'breakout' | 'pullback';
export type Trend = 'with_m200' | 'against_m200';
export type Location = 'near_m200' | 'far_from_m200';
export type TimeFrame = 'M2' | 'M5' | 'M15' | 'H1';
export type Outcome = '-1' | '1:1' | '2:1' | '3:1' | '4:1';
export type TrailingStop = 'T/F' | 'B/B';
export type Result = 'gain' | 'loss';

export interface Trade {
  id: string;
  date: string; // ISO string
  asset: string;
  operationType: OperationType;
  setup: Setup;
  trend: Trend;
  location: Location;
  timeFrame: TimeFrame;
  trailingStop: TrailingStop;
  result: Result;
  outcome: Outcome;
  screenshot?: string; // base64
  comment: string;
}

export interface TradesContextType {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'date'>) => void;
  updateTrade: (id: string, trade: Partial<Omit<Trade, 'id'>>) => void;
  deleteTrade: (id: string) => void;
  importTrades: (trades: Trade[]) => void;
  clearTrades: () => void;
  loading: boolean;
}
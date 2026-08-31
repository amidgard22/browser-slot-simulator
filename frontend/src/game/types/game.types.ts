export type GameStatus = "idle" | "spinning" | "settled";

export type GameState = {
  balance: number;
  bet: number;
  status: GameStatus;
};

export type SlotCellProps = {
  symbol: string;
};

export type SlotGridProps = {
  board: string[][];
  winHighlights?: boolean[][];
  onReelStop?: (reelIndex: number) => void;
};

export type WayWin = {
  symbol: string;
  reelCount: number;
  ways: number;
  amount: number;
};

export type SpinResult = {
  waysWins: WayWin[];
  scatterCount: number;
  scatterWin: number;
  totalWin: number;
};

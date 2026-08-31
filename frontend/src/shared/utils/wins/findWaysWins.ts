import { GAME_CONFIG, SYMBOL_PAYOUTS } from "../../../game/config/game.config";
import type { WayWin } from "../../../game/types/game.types";
import { countConsecutiveReels } from "./countConsecutiveReels";
import { countWays } from "./countMatchesOnReel";
import { lockWildsForWin } from "./getReel";

type PayableSymbol = keyof typeof SYMBOL_PAYOUTS;
type WinReelCount = 3 | 4 | 5;

const PAYABLE_SYMBOLS = Object.keys(SYMBOL_PAYOUTS) as PayableSymbol[];

export const findWaysWins = (board: string[][], bet: number): WayWin[] => {
  const lockedWilds = new Set<string>();
  const wins: WayWin[] = [];
  const remainingSymbols = new Set(PAYABLE_SYMBOLS);

  while (remainingSymbols.size > 0) {
    let bestWin: WayWin | null = null;

    for (const symbol of remainingSymbols) {
      const reelCount = countConsecutiveReels(board, symbol, lockedWilds);

      if (reelCount < GAME_CONFIG.minWinReels) continue;

      const winReelCount = reelCount as WinReelCount;
      const ways = countWays(board, symbol, reelCount, lockedWilds);
      const amount = SYMBOL_PAYOUTS[symbol][winReelCount] * bet * ways;

      if (!bestWin || amount > bestWin.amount) {
        bestWin = { symbol, reelCount, ways, amount };
      }
    }

    if (!bestWin) {
      break;
    }

    wins.push(bestWin);
    remainingSymbols.delete(bestWin.symbol as PayableSymbol);
    lockWildsForWin(board, bestWin.reelCount, lockedWilds);
  }

  return wins;
};

export const getTotalWin = (wins: WayWin[]) =>
  wins.reduce((total, win) => total + win.amount, 0);

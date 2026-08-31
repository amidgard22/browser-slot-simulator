import { GAME_CONFIG } from "../../../game/config/game.config";
import { reelHasSymbol } from "./getReel";

export const countConsecutiveReels = (
  board: string[][],
  symbol: string,
  lockedWilds: ReadonlySet<string> = new Set(),
) => {
  let count = 0;

  for (let col = 0; col < GAME_CONFIG.reels; col++) {
    if (!reelHasSymbol(board, col, symbol, lockedWilds)) {
      break;
    }

    count++;
  }

  return count;
};

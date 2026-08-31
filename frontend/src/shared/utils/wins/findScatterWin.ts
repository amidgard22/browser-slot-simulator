import { SCATTER_FREE_SPINS, SCATTER_PAYOUTS } from "../../../game/config/game.config";

export type ScatterWin = {
  count: number;
  amount: number;
  freeSpins: number;
};

export const findScatterWin = (
  board: string[][],
  bet: number,
): ScatterWin => {
  const count = board.flat().filter((symbol) => symbol === "SCATTER").length;

  if (count < 3) {
    return { count, amount: 0, freeSpins: 0 };
  }

  const payoutKey = Math.min(count, 5) as keyof typeof SCATTER_PAYOUTS;
  const multiplier = SCATTER_PAYOUTS[payoutKey] ?? 0;
  const freeSpins = SCATTER_FREE_SPINS[payoutKey] ?? 0;

  return {
    count,
    amount: multiplier * bet,
    freeSpins,
  };
};

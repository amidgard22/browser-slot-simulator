import { isWildMatch } from "./getReel";

export const countMatchesOnReel = (
  board: string[][],
  col: number,
  symbol: string,
  lockedWilds: ReadonlySet<string> = new Set(),
) =>
  board.filter((rowCells, row) =>
    isWildMatch(rowCells[col], symbol, row, col, lockedWilds),
  ).length;

export const countWays = (
  board: string[][],
  symbol: string,
  reelCount: number,
  lockedWilds: ReadonlySet<string> = new Set(),
) => {
  let ways = 1;

  for (let col = 0; col < reelCount; col++) {
    ways *= countMatchesOnReel(board, col, symbol, lockedWilds);
  }

  return ways;
};

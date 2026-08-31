import type { WayWin } from "../../../game/types/game.types";
import { cellKey } from "./getReel";

const buildWildAssignments = (board: string[][], waysWins: WayWin[]) => {
  const assignments = new Map<string, string>();
  const locked = new Set<string>();

  for (const win of waysWins) {
    for (let col = 0; col < win.reelCount; col++) {
      for (let row = 0; row < board.length; row++) {
        if (board[row][col] !== "WILD") continue;

        const key = cellKey(row, col);

        if (!locked.has(key)) {
          locked.add(key);
          assignments.set(key, win.symbol);
        }
      }
    }
  }

  return assignments;
};

export const getWinningCells = (
  board: string[][],
  waysWins: WayWin[],
  highlightScatter: boolean,
): boolean[][] => {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const wildAssignments = buildWildAssignments(board, waysWins);

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const cell = board[row][col];

      const isWaysWin = waysWins.some((win) => {
        if (col >= win.reelCount) return false;

        if (cell === win.symbol) return true;

        return (
          cell === "WILD" && wildAssignments.get(cellKey(row, col)) === win.symbol
        );
      });

      const isScatterWin = highlightScatter && cell === "SCATTER";

      return isWaysWin || isScatterWin;
    }),
  );
};

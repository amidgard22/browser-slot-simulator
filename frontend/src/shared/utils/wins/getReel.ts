export const getReel = (board: string[][], col: number) =>
  board.map((row) => row[col]);

export const cellKey = (row: number, col: number) => `${row},${col}`;

export const isWildMatch = (
  cell: string,
  symbol: string,
  row: number,
  col: number,
  lockedWilds: ReadonlySet<string>,
) =>
  cell === symbol ||
  (cell === "WILD" && !lockedWilds.has(cellKey(row, col)));

export const reelHasSymbol = (
  board: string[][],
  col: number,
  symbol: string,
  lockedWilds: ReadonlySet<string> = new Set(),
) =>
  board.some((rowCells, row) =>
    isWildMatch(rowCells[col], symbol, row, col, lockedWilds),
  );

export const lockWildsForWin = (
  board: string[][],
  reelCount: number,
  lockedWilds: Set<string>,
) => {
  for (let col = 0; col < reelCount; col++) {
    for (let row = 0; row < board.length; row++) {
      if (board[row][col] === "WILD") {
        lockedWilds.add(cellKey(row, col));
      }
    }
  }
};

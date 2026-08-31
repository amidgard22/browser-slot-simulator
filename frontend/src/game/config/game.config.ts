export const GAME_CONFIG = {
  reels: 5,
  rows: 4,
  initialBalance: 1_000,
  defaultBet: 10,
  minWinReels: 3,
  spinBaseDurationMs: 1800,
  spinStaggerMs: 350,
} as const;

export const SPIN_DURATION_MS =
  GAME_CONFIG.spinBaseDurationMs +
  (GAME_CONFIG.reels - 1) * GAME_CONFIG.spinStaggerMs;

export const SYMBOL_WEIGHTS = {
  J: 14,
  Q: 13,
  K: 12,
  A: 11,
  STAR: 10,
  RING: 8,
  DRAGON: 5,
  WILD: 2,
  SCATTER: 2,
} as const;

export const SYMBOL_PAYOUTS = {
  J: { 3: 0.1, 4: 0.2, 5: 0.5 },
  Q: { 3: 0.1, 4: 0.2, 5: 0.5 },
  K: { 3: 0.1, 4: 0.2, 5: 0.5 },
  A: { 3: 0.1, 4: 0.2, 5: 0.5 },
  STAR: { 3: 0.2, 4: 0.4, 5: 1.5 },
  RING: { 3: 0.2, 4: 0.4, 5: 1.5 },
  DRAGON: { 3: 0.5, 4: 1.0, 5: 2.5 },
} as const;

export const SCATTER_PAYOUTS = {
  3: 5,
  4: 15,
  5: 50,
} as const;

export const SCATTER_FREE_SPINS = {
  3: 8,
  4: 12,
  5: 20,
} as const;

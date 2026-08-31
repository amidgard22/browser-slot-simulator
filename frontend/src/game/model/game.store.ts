import { create } from "zustand";

import { GAME_CONFIG } from "../config/game.config";

import type { GameState, GameStatus, WayWin } from "../types/game.types";



type GameStore = GameState & {

  lastWins: WayWin[];

  lastTotalWin: number;

  scatterCount: number;

  scatterWin: number;

  freeSpinsRemaining: number;

  lastFreeSpinsAwarded: number;

  setStatus: (status: GameStatus) => void;

  increaseBet: () => void;

  decreaseBet: () => void;

  startSpin: () => boolean;

  settleSpin: (payload: {

    totalWin: number;

    waysWins: WayWin[];

    scatterCount: number;

    scatterWin: number;

    freeSpinsAwarded: number;

  }) => void;

};



export const useGameStore = create<GameStore>((set, get) => ({

  balance: GAME_CONFIG.initialBalance,

  bet: GAME_CONFIG.defaultBet,

  status: "idle",

  lastWins: [],

  lastTotalWin: 0,

  scatterCount: 0,

  scatterWin: 0,

  freeSpinsRemaining: 0,

  lastFreeSpinsAwarded: 0,

  setStatus: (status) => set({ status }),

  increaseBet: () =>

    set((state) => ({

      bet: Math.min(state.bet + 10, state.balance),

    })),

  decreaseBet: () =>

    set((state) => ({

      bet: Math.max(10, state.bet - 10),

    })),

  startSpin: () => {

    const { balance, bet, status, freeSpinsRemaining } = get();

    const isFreeSpin = freeSpinsRemaining > 0;



    if (status === "spinning") {

      return false;

    }



    if (!isFreeSpin && balance < bet) {

      return false;

    }



    set({

      balance: isFreeSpin ? balance : balance - bet,

      freeSpinsRemaining: isFreeSpin ? freeSpinsRemaining - 1 : freeSpinsRemaining,

      status: "spinning",

      lastWins: [],

      lastTotalWin: 0,

      scatterCount: 0,

      scatterWin: 0,

      lastFreeSpinsAwarded: 0,

    });



    return true;

  },

  settleSpin: ({

    totalWin,

    waysWins,

    scatterCount,

    scatterWin,

    freeSpinsAwarded,

  }) =>

    set((state) => ({

      balance: state.balance + totalWin,

      status: "settled",

      lastWins: waysWins,

      lastTotalWin: totalWin,

      scatterCount,

      scatterWin,

      freeSpinsRemaining: state.freeSpinsRemaining + freeSpinsAwarded,

      lastFreeSpinsAwarded: freeSpinsAwarded,

    })),

}));


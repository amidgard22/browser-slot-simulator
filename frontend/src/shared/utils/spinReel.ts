import { GAME_CONFIG, SYMBOL_WEIGHTS } from "../../game/config/game.config";
import { pickWeighted } from "./pickWeighted";

export const spinReel = (): string[] => {
  const reel: string[] = [];
  let hasScatter = false;

  for (let row = 0; row < GAME_CONFIG.rows; row++) {
    let symbol = pickWeighted(SYMBOL_WEIGHTS);

    if (symbol === "SCATTER" && hasScatter) {
      symbol = pickWeighted({
        A: SYMBOL_WEIGHTS.A,
        K: SYMBOL_WEIGHTS.K,
        Q: SYMBOL_WEIGHTS.Q,
        J: SYMBOL_WEIGHTS.J,
        STAR: SYMBOL_WEIGHTS.STAR,
        RING: SYMBOL_WEIGHTS.RING,
        DRAGON: SYMBOL_WEIGHTS.DRAGON,
        WILD: SYMBOL_WEIGHTS.WILD,
      });
    }
    if (symbol === "SCATTER") hasScatter = true;

    reel.push(symbol);
  }

  return reel;
};

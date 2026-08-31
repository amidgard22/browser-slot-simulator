import { GAME_CONFIG } from "../../game/config/game.config";
import { spinReel } from "./spinReel";

export const spinBoard = () => {
  const reels = Array.from({ length: GAME_CONFIG.reels }, () => spinReel());

  return Array.from({ length: GAME_CONFIG.rows }, (_, row) =>
    reels.map((reel) => reel[row]),
  );
};

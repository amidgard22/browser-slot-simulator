import { PixiSlotApplication } from "../pixi/PixiSlotApplication";

import type { SlotGridProps } from "../types/game.types";



export const SlotGrid = ({

  board,

  winHighlights,

  onReelStop,

}: SlotGridProps) => (

  <PixiSlotApplication

    board={board}

    winHighlights={winHighlights}

    onReelStop={onReelStop}

  />

);


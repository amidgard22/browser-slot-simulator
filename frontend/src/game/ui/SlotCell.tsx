import type { SlotCellProps } from "../types/game.types";
import "./slot-game.css";
export const SlotCell = ({ symbol }: SlotCellProps) => (
  <div className="slot-cell">
    <img
      className="slot-cell-img"
      src={`/symbols/${symbol}.png`}
      alt={symbol}
    ></img>
  </div>
);

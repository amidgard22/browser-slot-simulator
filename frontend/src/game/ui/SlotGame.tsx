import { useCallback, useEffect, useRef, useState } from "react";
import {
  playFreeSpins,
  playReelStop,
  playScatter,
  playWin,
} from "../audio/soundManager";
import { SPIN_DURATION_MS } from "../config/game.config";
import { useGameStore } from "../model/game.store";
import { findScatterWin } from "../../shared/utils/wins/findScatterWin";
import {
  findWaysWins,
  getTotalWin,
} from "../../shared/utils/wins/findWaysWins";
import { getWinningCells } from "../../shared/utils/wins/getWinningCells";
import { spinBoard } from "../../shared/utils/spinBoard";
import { SlotGrid } from "./SlotGrid";
import "./slot-game.css";

export const SlotGame = () => {
  const [board, setBoard] = useState(() => spinBoard());
  const [winHighlights, setWinHighlights] = useState<boolean[][]>();
  const spinTimeoutRef = useRef<number | null>(null);
  const autoSpinTimeoutRef = useRef<number | null>(null);

  const {
    balance,
    bet,
    status,
    lastWins,
    lastTotalWin,
    scatterCount,
    scatterWin,
    freeSpinsRemaining,
    lastFreeSpinsAwarded,
    startSpin,
    settleSpin,
    increaseBet,
    decreaseBet,
  } = useGameStore();

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current !== null) {
        window.clearTimeout(spinTimeoutRef.current);
      }

      if (autoSpinTimeoutRef.current !== null) {
        window.clearTimeout(autoSpinTimeoutRef.current);
      }
    };
  }, []);

  const handleReelStop = useCallback(() => {
    playReelStop();
  }, []);

  const runSpin = useCallback(() => {
    if (!startSpin()) {
      return;
    }

    setWinHighlights(undefined);

    const nextBoard = spinBoard();
    setBoard(nextBoard);

    spinTimeoutRef.current = window.setTimeout(() => {
      const waysWins = findWaysWins(nextBoard, bet);
      const scatter = findScatterWin(nextBoard, bet);
      const totalWin = getTotalWin(waysWins) + scatter.amount;

      settleSpin({
        totalWin,
        waysWins,
        scatterCount: scatter.count,
        scatterWin: scatter.amount,
        freeSpinsAwarded: scatter.freeSpins,
      });

      setWinHighlights(
        getWinningCells(nextBoard, waysWins, scatter.count >= 3),
      );

      if (totalWin > 0) {
        playWin(totalWin, bet);
      }

      if (scatter.freeSpins > 0) {
        playScatter();
        playFreeSpins();
      }
    }, SPIN_DURATION_MS);
  }, [bet, settleSpin, startSpin]);

  useEffect(() => {
    if (status !== "settled" || freeSpinsRemaining <= 0) {
      return;
    }

    const delay = lastTotalWin > 0 || lastFreeSpinsAwarded > 0 ? 2200 : 700;

    autoSpinTimeoutRef.current = window.setTimeout(() => {
      runSpin();
    }, delay);

    return () => {
      if (autoSpinTimeoutRef.current !== null) {
        window.clearTimeout(autoSpinTimeoutRef.current);
      }
    };
  }, [
    status,
    freeSpinsRemaining,
    lastTotalWin,
    lastFreeSpinsAwarded,
    runSpin,
  ]);

  const isSpinning = status === "spinning";
  const isFreeSpinMode = freeSpinsRemaining > 0 || isSpinning;
  const canSpin =
    !isSpinning && (freeSpinsRemaining > 0 || balance >= bet);

  return (
    <main className="slot-game-page">
      <div>Created by Ilya Okostko</div>

      {freeSpinsRemaining > 0 && (
        <div className="slot-free-spins-banner">
          Фриспины: {freeSpinsRemaining}
        </div>
      )}

      <section className="slot-game">
        <img
          className="slot-frame-img"
          src="/symbols/slot-frame.png"
          alt=""
          aria-hidden="true"
        />
        <div className="slot-grid-wrap">
          <SlotGrid
            board={board}
            winHighlights={winHighlights}
            onReelStop={handleReelStop}
          />
        </div>
      </section>

      <section className="slot-controls">
        <div className="slot-stats">
          <div>Баланс: {balance}</div>
          <div>Ставка: {bet}</div>
          <div>Выигрыш: {lastTotalWin}</div>
        </div>

        <div className="slot-bet-controls">
          <button type="button" onClick={decreaseBet} disabled={isSpinning}>
            -
          </button>
          <span>{bet}</span>
          <button type="button" onClick={increaseBet} disabled={isSpinning}>
            +
          </button>
        </div>

        <button type="button" onClick={runSpin} disabled={!canSpin}>
          {isSpinning
            ? "Крутится..."
            : isFreeSpinMode
              ? `Spin (Free x${freeSpinsRemaining})`
              : "Spin"}
        </button>
      </section>

      <section className="slot-wins">
        {lastWins.length === 0 && scatterWin === 0 && status === "settled" && (
          <div>Нет выигрыша</div>
        )}

        {lastWins.map((win) => (
          <div key={`${win.symbol}-${win.reelCount}-${win.ways}`}>
            {win.symbol} x{win.reelCount} ({win.ways} ways) — {win.amount}
          </div>
        ))}

        {scatterWin > 0 && (
          <div>
            SCATTER x{scatterCount} — {scatterWin}
          </div>
        )}

        {lastFreeSpinsAwarded > 0 && (
          <div className="slot-free-spins-win">
            +{lastFreeSpinsAwarded} фриспинов!
          </div>
        )}
      </section>
    </main>
  );
};

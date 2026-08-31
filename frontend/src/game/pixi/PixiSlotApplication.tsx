import {
  Application,
  Assets,
  BlurFilter,
  Container,
  Graphics,
  Sprite,
  Texture,
} from "pixi.js";
import { useEffect, useRef } from "react";
import { GAME_CONFIG, SYMBOL_WEIGHTS } from "../config/game.config";
import { pickWeighted } from "../../shared/utils/pickWeighted";

type Props = {
  board: string[][];
  winHighlights?: boolean[][];
  onReelStop?: (reelIndex: number) => void;
};

const WIDTH = 800;
const HEIGHT = 480;
const REELS = 5;
const ROWS = 4;
const REEL_WIDTH = WIDTH / REELS;
const CELL_HEIGHT = HEIGHT / ROWS;
const FILLER_COUNT = 30;
const SPRITE_WIDTH = REEL_WIDTH * 0.9;
const SPRITE_HEIGHT = CELL_HEIGHT;

export const PixiSlotApplication = ({
  board,
  winHighlights,
  onReelStop,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialBoardRef = useRef(board);
  const spinRef = useRef<(nextBoard: string[][]) => void>(() => {});
  const applyHighlightsRef = useRef<(highlights?: boolean[][]) => void>(
    () => {},
  );
  const skipBoardEffectRef = useRef(true);
  const onReelStopRef = useRef(onReelStop);

  onReelStopRef.current = onReelStop;

  useEffect(() => {
    const app = new Application();

    let initialized = false;
    let cancelled = false;
    let pulseElapsed = 0;

    const start = async () => {
      await app.init({
        width: WIDTH,
        height: HEIGHT,
        backgroundAlpha: 0,
        antialias: true,
      });

      initialized = true;

      if (cancelled) {
        app.destroy();
        return;
      }

      containerRef.current?.appendChild(app.canvas);

      const symbols = Object.keys(SYMBOL_WEIGHTS);
      const paths = symbols.map((symbol) => `/symbols/${symbol}.png`);
      const textures = await Assets.load<Texture>(paths);

      if (cancelled) return;

      const strips: Container[] = [];
      const blurFilters: BlurFilter[] = [];
      const resultSprites: (Sprite | null)[][] = Array.from(
        { length: ROWS },
        () => Array.from({ length: REELS }, () => null),
      );
      const glowGraphics: (Graphics | null)[][] = Array.from(
        { length: ROWS },
        () => Array.from({ length: REELS }, () => null),
      );

      const animations = Array.from({ length: REELS }, () => ({
        active: false,
        elapsed: 0,
        duration: 0,
        targetY: 0,
        stopNotified: false,
      }));

      for (let reelIndex = 0; reelIndex < REELS; reelIndex++) {
        const strip = new Container();
        strip.x = reelIndex * REEL_WIDTH;

        const mask = new Graphics()
          .rect(reelIndex * REEL_WIDTH, 0, REEL_WIDTH, HEIGHT)
          .fill(0xffffff);

        const blur = new BlurFilter({
          strengthX: 0,
          strengthY: 0,
          quality: 2,
        });

        strip.mask = mask;
        strip.filters = [blur];

        strips.push(strip);
        blurFilters.push(blur);

        app.stage.addChild(mask);
        app.stage.addChild(strip);

        if (reelIndex < REELS - 1) {
          const divider = new Graphics()
            .moveTo((reelIndex + 1) * REEL_WIDTH, 0)
            .lineTo((reelIndex + 1) * REEL_WIDTH, HEIGHT)
            .stroke({
              width: 2,
              color: 0xd4af37,
              alpha: 0.5,
            });

          app.stage.addChild(divider);
        }
      }

      const highlightLayer = new Container();
      app.stage.addChild(highlightLayer);

      const layoutSprite = (sprite: Sprite, row: number) => {
        sprite.x = REEL_WIDTH * 0.05;
        sprite.y = row * CELL_HEIGHT;
        sprite.width = SPRITE_WIDTH;
        sprite.height = SPRITE_HEIGHT;
      };

      const createGlow = (reelIndex: number, row: number) => {
        const glow = new Graphics()
          .roundRect(
            reelIndex * REEL_WIDTH + REEL_WIDTH * 0.03,
            row * CELL_HEIGHT + CELL_HEIGHT * 0.05,
            REEL_WIDTH * 0.94,
            CELL_HEIGHT * 0.9,
            8,
          )
          .stroke({ width: 4, color: 0xffd700, alpha: 0.95 });

        glow.visible = false;
        highlightLayer.addChild(glow);
        glowGraphics[row][reelIndex] = glow;

        return glow;
      };

      for (let row = 0; row < ROWS; row++) {
        for (let reelIndex = 0; reelIndex < REELS; reelIndex++) {
          createGlow(reelIndex, row);
        }
      }

      const createSprite = (symbol: string, row: number) => {
        const path = `/symbols/${symbol}.png`;
        const sprite = new Sprite(textures[path]);
        layoutSprite(sprite, row);
        return sprite;
      };

      const resetVisuals = () => {
        for (let row = 0; row < ROWS; row++) {
          for (let reelIndex = 0; reelIndex < REELS; reelIndex++) {
            const sprite = resultSprites[row][reelIndex];
            const glow = glowGraphics[row][reelIndex];

            if (sprite) {
              sprite.alpha = 1;
            }

            if (glow) {
              glow.visible = false;
              glow.alpha = 1;
            }
          }
        }
      };

      applyHighlightsRef.current = (highlights) => {
        resetVisuals();

        if (!highlights?.length) {
          return;
        }

        const hasAnyHighlight = highlights.some((row) => row.some(Boolean));

        if (!hasAnyHighlight) {
          return;
        }

        for (let row = 0; row < ROWS; row++) {
          for (let reelIndex = 0; reelIndex < REELS; reelIndex++) {
            const sprite = resultSprites[row][reelIndex];
            const glow = glowGraphics[row][reelIndex];
            const isWinner = highlights[row]?.[reelIndex] ?? false;

            if (!sprite || !glow) continue;

            if (isWinner) {
              sprite.alpha = 1;
              glow.visible = true;
            } else {
              sprite.alpha = 0.35;
            }
          }
        }
      };

      const showBoard = (nextBoard: string[][]) => {
        strips.forEach((strip, reelIndex) => {
          strip.removeChildren().forEach((child) => child.destroy());
          strip.y = 0;

          for (let row = 0; row < ROWS; row++) {
            const sprite = createSprite(nextBoard[row][reelIndex], row);
            strip.addChild(sprite);
            resultSprites[row][reelIndex] = sprite;
          }
        });

        resetVisuals();
      };

      spinRef.current = (nextBoard) => {
        resetVisuals();

        strips.forEach((strip, reelIndex) => {
          strip.removeChildren().forEach((child) => child.destroy());
          strip.y = 0;

          const filler = Array.from({ length: FILLER_COUNT }, () =>
            pickWeighted(SYMBOL_WEIGHTS),
          );

          const result = nextBoard.map((row) => row[reelIndex]);
          const sequence = [...filler, ...result];

          sequence.forEach((symbol, index) => {
            strip.addChild(createSprite(symbol, index));
          });

          for (let row = 0; row < ROWS; row++) {
            resultSprites[row][reelIndex] = strip.children[
              FILLER_COUNT + row
            ] as Sprite;
          }

          animations[reelIndex] = {
            active: true,
            elapsed: 0,
            duration:
              GAME_CONFIG.spinBaseDurationMs +
              reelIndex * GAME_CONFIG.spinStaggerMs,
            targetY: -FILLER_COUNT * CELL_HEIGHT,
            stopNotified: false,
          };

          blurFilters[reelIndex].strengthY = 14;
        });
      };

      app.ticker.add((ticker) => {
        pulseElapsed += ticker.deltaMS;
        const pulse = 0.85 + Math.sin(pulseElapsed * 0.008) * 0.15;

        for (let row = 0; row < ROWS; row++) {
          for (let reelIndex = 0; reelIndex < REELS; reelIndex++) {
            const glow = glowGraphics[row][reelIndex];

            if (!glow?.visible) continue;

            glow.alpha = pulse;
          }
        }

        strips.forEach((strip, reelIndex) => {
          const animation = animations[reelIndex];

          if (!animation.active) return;

          animation.elapsed += ticker.deltaMS;

          const progress = Math.min(animation.elapsed / animation.duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          strip.y = animation.targetY * eased;
          blurFilters[reelIndex].strengthY = 14 * (1 - progress);

          if (progress === 1) {
            strip.y = animation.targetY;
            blurFilters[reelIndex].strengthY = 0;
            animation.active = false;

            if (!animation.stopNotified) {
              animation.stopNotified = true;
              onReelStopRef.current?.(reelIndex);
            }
          }
        });
      });

      showBoard(initialBoardRef.current);
    };

    void start();

    return () => {
      cancelled = true;
      spinRef.current = () => {};
      applyHighlightsRef.current = () => {};

      if (initialized) {
        app.destroy(true, { children: true });
      }
    };
  }, []);

  useEffect(() => {
    if (skipBoardEffectRef.current) {
      skipBoardEffectRef.current = false;
      return;
    }

    spinRef.current(board);
  }, [board]);

  useEffect(() => {
    applyHighlightsRef.current(winHighlights);
  }, [winHighlights]);

  return <div ref={containerRef} className="pixi-slot" />;
};

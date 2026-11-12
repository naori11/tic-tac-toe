"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Player } from "@/lib/game/types";

export interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange?: (difficulty: Difficulty) => void;
  /** @deprecated Use onDifficultyChange */
  onSelectDifficulty?: (difficulty: Difficulty) => void;
  playerSymbol: Player;
  onPlayerSymbolChange?: (symbol: Player) => void;
  /** @deprecated Use onPlayerSymbolChange */
  onSelectSymbol?: (symbol: Player) => void;
  onNewGame?: () => void;
  onResetScores?: () => void;
  isGameInProgress?: boolean;
  disabled?: boolean;
  className?: string;
}

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "easy", label: "Easy", desc: "Casual" },
  { id: "medium", label: "Medium", desc: "Tactical" },
  { id: "impossible", label: "Impossible", desc: "Minimax" },
];

export function GameControls({
  difficulty,
  onDifficultyChange,
  onSelectDifficulty,
  playerSymbol,
  onPlayerSymbolChange,
  onSelectSymbol,
  onNewGame,
  isGameInProgress = false,
  disabled = false,
  className,
}: GameControlsProps) {
  const handleDifficulty = (d: Difficulty) => {
    (onDifficultyChange ?? onSelectDifficulty)?.(d);
  };

  const handleSymbol = (s: Player) => {
    (onPlayerSymbolChange ?? onSelectSymbol)?.(s);
  };

  const isSymbolDisabled = disabled || isGameInProgress;

  return (
    <div
      data-testid="game-controls"
      className={cn("flex flex-col gap-3.5 w-full max-w-sm sm:max-w-md mx-auto", className)}
    >
      {/* Difficulty Tabs */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Difficulty
          </span>
          <span className="text-[11px] text-muted-foreground">
            {DIFFICULTIES.find((d) => d.id === difficulty)?.desc}
          </span>
        </div>
        <div
          role="tablist"
          aria-label="AI Difficulty"
          className="grid grid-cols-3 gap-1 rounded-2xl border border-border/70 bg-secondary/40 p-1 backdrop-blur-xs"
        >
          {DIFFICULTIES.map(({ id, label }) => {
            const isSelected = difficulty === id;
            return (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-label={`Select ${label} difficulty`}
                onClick={() => handleDifficulty(id)}
                disabled={disabled}
                className={cn(
                  "flex items-center justify-center py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
                  isSelected
                    ? "bg-card text-foreground shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symbol & Mid-Match Restart Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Play As
          </span>
          <div className="inline-flex rounded-xl border border-border/70 bg-secondary/40 p-0.5">
            <button
              type="button"
              aria-label="Play as X"
              aria-pressed={playerSymbol === "X"}
              onClick={() => handleSymbol("X")}
              disabled={isSymbolDisabled}
              title={isGameInProgress ? "Finish match to switch marks" : undefined}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none",
                playerSymbol === "X"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                isSymbolDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              X
            </button>
            <button
              type="button"
              aria-label="Play as O"
              aria-pressed={playerSymbol === "O"}
              onClick={() => handleSymbol("O")}
              disabled={isSymbolDisabled}
              title={isGameInProgress ? "Finish match to switch marks" : undefined}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none",
                playerSymbol === "O"
                  ? "bg-card text-rose-600 dark:text-rose-400 shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                isSymbolDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              O
            </button>
          </div>
          {isGameInProgress && (
            <span className="text-[10px] text-muted-foreground italic">
              (in match)
            </span>
          )}
        </div>

        {/* Quiet Mid-Match Restart Icon Button */}
        {onNewGame && (
          <button
            type="button"
            data-testid="restart-match-button"
            aria-label="Restart Match"
            title="Restart Match"
            onClick={onNewGame}
            disabled={disabled}
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-xl",
              "border border-border/70 bg-secondary/40 text-muted-foreground",
              "hover:text-foreground hover:bg-card hover:border-border transition-all active:scale-95 cursor-pointer shadow-2xs",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

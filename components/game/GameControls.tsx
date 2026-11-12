"use client";

import React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Player } from "@/lib/game/types";

export interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  playerSymbol: Player;
  onPlayerSymbolChange: (s: Player) => void;
  onNewGame: () => void;
  onResetScores: () => void;
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
  playerSymbol,
  onPlayerSymbolChange,
  onNewGame,
  onResetScores,
  disabled = false,
  className,
}: GameControlsProps) {
  return (
    <div
      data-testid="game-controls"
      className={cn("flex flex-col gap-4 w-full max-w-sm sm:max-w-md mx-auto", className)}
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
                onClick={() => onDifficultyChange(id)}
                disabled={disabled}
                className={cn(
                  "flex items-center justify-center py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
                  isSelected
                    ? "bg-card text-foreground shadow-sm border border-border/80"
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

      {/* Symbol & Primary Action Row */}
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Symbol Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Play As
          </span>
          <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border/70 bg-secondary/40 p-1">
            <button
              type="button"
              aria-label="Play as X"
              aria-pressed={playerSymbol === "X"}
              onClick={() => onPlayerSymbolChange("X")}
              disabled={disabled}
              className={cn(
                "flex items-center justify-center py-2 rounded-xl text-sm font-black transition-all duration-150 cursor-pointer select-none",
                playerSymbol === "X"
                  ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              X
            </button>
            <button
              type="button"
              aria-label="Play as O"
              aria-pressed={playerSymbol === "O"}
              onClick={() => onPlayerSymbolChange("O")}
              disabled={disabled}
              className={cn(
                "flex items-center justify-center py-2 rounded-xl text-sm font-black transition-all duration-150 cursor-pointer select-none",
                playerSymbol === "O"
                  ? "bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/40 shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              O
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Actions
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              aria-label="Start New Game"
              onClick={onNewGame}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl",
                "bg-primary text-primary-foreground font-semibold text-xs sm:text-sm",
                "hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer select-none"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
            <button
              type="button"
              aria-label="Reset All Scores"
              onClick={onResetScores}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl",
                "border border-border/70 bg-card/60 text-muted-foreground font-semibold text-xs sm:text-sm",
                "hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10",
                "active:scale-95 transition-all shadow-xs cursor-pointer select-none"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

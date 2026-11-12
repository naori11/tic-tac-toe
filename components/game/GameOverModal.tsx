"use client";

import React, { useEffect, useRef } from "react";
import { Bot, Handshake, RotateCcw, Trash2, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/game/types";
import type { Score } from "@/lib/game/useTicTacToe";

export interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | "draw" | null;
  playerSymbol: Player;
  scores: Score;
  onPlayAgain: () => void;
  onResetScores: () => void;
  onClose: () => void;
  className?: string;
}

export function GameOverModal({
  isOpen,
  winner,
  playerSymbol,
  scores,
  onPlayAgain,
  onResetScores,
  onClose,
  className,
}: GameOverModalProps): React.JSX.Element | null {
  const playAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen || !winner) return;

    // Focus primary action button when modal opens
    playAgainButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, winner, onClose]);

  if (!isOpen || !winner) {
    return null;
  }

  const isPlayerWinner = winner === playerSymbol;
  const isDraw = winner === "draw";

  let title = "AI Won 🤖";
  let subtext = "Tough match. Ready for a rematch?";
  let icon = <Bot className="h-10 w-10 text-rose-500 animate-bounce motion-reduce:animate-none" />;
  let badgeClass = "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400";

  if (isPlayerWinner) {
    title = "You Won! 🎉";
    subtext = "Great match! What's next?";
    icon = <Trophy className="h-10 w-10 text-emerald-500 animate-bounce motion-reduce:animate-none" />;
    badgeClass = "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
  } else if (isDraw) {
    title = "It's a Draw 🤝";
    subtext = "Evenly matched.";
    icon = <Handshake className="h-10 w-10 text-amber-500" />;
    badgeClass = "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400";
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        className={cn(
          "relative w-full max-w-sm sm:max-w-md rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md",
          "flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200",
          className
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Announcement Header */}
        <div
          className={cn(
            "p-3 rounded-2xl border flex items-center justify-center shadow-xs",
            badgeClass
          )}
        >
          {icon}
        </div>

        <div className="space-y-1">
          <h2
            id="game-over-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {subtext}
          </p>
        </div>

        {/* Score Summary Row */}
        <div
          data-testid="score-summary"
          className="w-full rounded-2xl bg-secondary/40 border border-border/70 py-2.5 px-4 text-xs sm:text-sm font-semibold text-muted-foreground tracking-wide"
        >
          You: {scores.player} · Ties: {scores.draws} · AI: {scores.ai}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <button
            ref={playAgainButtonRef}
            type="button"
            onClick={onPlayAgain}
            className={cn(
              "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl",
              "bg-primary text-primary-foreground font-semibold text-xs sm:text-sm",
              "hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer select-none"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
          <button
            type="button"
            onClick={onResetScores}
            className={cn(
              "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl",
              "border border-border/70 bg-card/60 text-muted-foreground font-semibold text-xs sm:text-sm",
              "hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10",
              "active:scale-95 transition-all shadow-xs cursor-pointer select-none"
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Scores</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Bot, Handshake, Loader2, Sparkles, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/game/types";

export interface GameStatusProps {
  winner: Player | "draw" | null;
  isAiThinking: boolean;
  currentPlayer: Player;
  playerSymbol: Player;
  className?: string;
}

export function GameStatus({
  winner,
  isAiThinking,
  currentPlayer,
  playerSymbol,
  className,
}: GameStatusProps) {
  const isPlayerTurn = currentPlayer === playerSymbol;

  // Case 1: Game has concluded with a winner or draw
  if (winner !== null) {
    if (winner === "draw") {
      return (
        <div
          data-testid="game-status-draw"
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border",
            "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
            "font-semibold text-sm sm:text-base shadow-xs backdrop-blur-xs animate-in fade-in duration-200",
            className
          )}
        >
          <Handshake className="h-5 w-5" />
          <span>It&apos;s a Draw! 🤝</span>
        </div>
      );
    }

    if (winner === playerSymbol) {
      return (
        <div
          data-testid="game-status-player-won"
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border",
            "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
            "font-bold text-sm sm:text-base shadow-md backdrop-blur-xs animate-in zoom-in-95 duration-200",
            className
          )}
        >
          <Trophy className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          <span>You Won! 🎉</span>
        </div>
      );
    }

    // AI Won
    return (
      <div
        data-testid="game-status-ai-won"
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border",
          "bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-400",
          "font-bold text-sm sm:text-base shadow-md backdrop-blur-xs animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <Bot className="h-5 w-5 text-rose-500 dark:text-rose-400" />
        <span>AI Won! 🤖</span>
      </div>
    );
  }

  // Case 2: AI is thinking
  if (isAiThinking) {
    return (
      <div
        data-testid="game-status-ai-thinking"
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl border",
          "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-400",
          "font-semibold text-sm sm:text-base shadow-xs backdrop-blur-xs",
          className
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        <span>AI is thinking...</span>
      </div>
    );
  }

  // Case 3: Player's Turn
  if (isPlayerTurn) {
    return (
      <div
        data-testid="game-status-player-turn"
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border/70",
          "bg-card/70 text-foreground font-semibold text-sm sm:text-base shadow-xs backdrop-blur-xs",
          className
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <User className="h-4 w-4 text-muted-foreground" />
        <span>Your Turn</span>
      </div>
    );
  }

  // Case 4: AI Turn (Waiting for trigger)
  return (
    <div
      data-testid="game-status-ai-turn"
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border/70",
        "bg-card/70 text-muted-foreground font-medium text-sm sm:text-base shadow-xs backdrop-blur-xs",
        className
      )}
    >
      <Bot className="h-4 w-4" />
      <span>AI Turn</span>
    </div>
  );
}

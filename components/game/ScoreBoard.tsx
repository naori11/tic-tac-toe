"use client";

import React from "react";
import { Bot, Handshake, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty, Player } from "@/lib/game/types";
import type { Score } from "@/lib/game/useTicTacToe";

export interface ScoreBoardProps {
  scores: Score;
  playerSymbol: Player;
  aiSymbol: Player;
  difficulty?: Difficulty;
  isMounted?: boolean;
  onResetScores?: () => void;
  className?: string;
}

export function ScoreBoard({
  scores,
  playerSymbol,
  aiSymbol,
  difficulty,
  isMounted = true,
  onResetScores,
  className,
}: ScoreBoardProps) {
  const isPlayerX = playerSymbol === "X";

  return (
    <div
      data-testid="score-board"
      aria-label="Score Board"
      className={cn("grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto", className)}
    >
      {/* Player Score Card */}
      <div
        data-testid="score-player"
        className={cn(
          "flex flex-col items-center justify-between rounded-2xl border p-3 sm:p-4 text-center shadow-xs transition-all",
          "bg-card/70 backdrop-blur-xs",
          isPlayerX
            ? "border-emerald-500/30 hover:border-emerald-500/50"
            : "border-rose-500/30 hover:border-rose-500/50"
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <User className="h-3.5 w-3.5" />
          <span>You</span>
          <span
            className={cn(
              "rounded-md px-1 py-0.5 text-[10px] font-bold",
              isPlayerX
                ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-500 dark:text-rose-400"
            )}
          >
            {playerSymbol}
          </span>
        </div>
        <div
          data-testid="player-score-count"
          className="my-1 text-2xl sm:text-3xl font-black tracking-tight tabular-nums"
        >
          {isMounted ? scores.player : "-"}
        </div>
        <span className="text-[11px] text-muted-foreground">Wins</span>
      </div>

      {/* Draws Score Card */}
      <div
        data-testid="score-draws"
        className="flex flex-col items-center justify-between rounded-2xl border border-border/70 bg-card/70 p-3 sm:p-4 text-center shadow-xs backdrop-blur-xs transition-all hover:border-border"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Handshake className="h-3.5 w-3.5" />
          <span>Ties</span>
        </div>
        <div
          data-testid="draws-score-count"
          className="my-1 text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-muted-foreground"
        >
          {isMounted ? scores.draws : "-"}
        </div>
        <span className="text-[11px] text-muted-foreground">Draws</span>
      </div>

      {/* AI Score Card */}
      <div
        data-testid="score-ai"
        className={cn(
          "flex flex-col items-center justify-between rounded-2xl border p-3 sm:p-4 text-center shadow-xs transition-all",
          "bg-card/70 backdrop-blur-xs",
          !isPlayerX
            ? "border-emerald-500/30 hover:border-emerald-500/50"
            : "border-rose-500/30 hover:border-rose-500/50"
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Bot className="h-3.5 w-3.5" />
          <span>AI</span>
          <span
            className={cn(
              "rounded-md px-1 py-0.5 text-[10px] font-bold",
              !isPlayerX
                ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-500 dark:text-rose-400"
            )}
          >
            {aiSymbol}
          </span>
        </div>
        <div
          data-testid="ai-score-count"
          className="my-1 text-2xl sm:text-3xl font-black tracking-tight tabular-nums"
        >
          {isMounted ? scores.ai : "-"}
        </div>
        <span className="text-[11px] text-muted-foreground capitalize">
          {difficulty ?? "Wins"}
        </span>
      </div>
    </div>
  );
}

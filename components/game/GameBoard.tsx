"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Cell } from "./Cell";
import { cn } from "@/lib/utils";
import type { Board, Player, WinningLine } from "@/lib/game/types";

export interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  winningLine: WinningLine | null;
  disabled?: boolean;
  playerSymbol?: Player;
  winner?: Player | "draw" | null;
  isAiThinking?: boolean;
  currentPlayer?: Player;
  className?: string;
}

export function GameBoard({
  board,
  onCellClick,
  winningLine,
  disabled = false,
  playerSymbol = "X",
  winner = null,
  isAiThinking = false,
  currentPlayer,
  className,
}: GameBoardProps) {
  const firedRef = useRef<string | null>(null);

  // Trigger confetti burst when player wins
  useEffect(() => {
    if (winner && winner === playerSymbol) {
      // Fire confetti once per victory
      if (firedRef.current !== `${winner}-${winningLine?.join(",")}`) {
        firedRef.current = `${winner}-${winningLine?.join(",")}`;
        try {
          if (typeof window !== "undefined") {
            confetti({
              particleCount: 90,
              spread: 65,
              origin: { y: 0.6 },
              colors: ["#10b981", "#06b6d4", "#3b82f6", "#ec4899", "#8b5cf6"],
            });
          }
        } catch {
          // Graceful fallback if canvas is unavailable (e.g., test environments)
        }
      }
    } else if (!winner) {
      firedRef.current = null;
    }
  }, [winner, playerSymbol, winningLine]);

  const isWinningCell = (index: number): boolean => {
    return winningLine !== null && winningLine.includes(index);
  };

  const isBoardDisabled =
    disabled ||
    isAiThinking ||
    winner !== null ||
    (currentPlayer !== undefined && playerSymbol !== undefined && currentPlayer !== playerSymbol);

  return (
    <div
      data-testid="game-board"
      aria-label="Tic-Tac-Toe Game Board"
      className={cn(
        "relative mx-auto w-full max-w-sm sm:max-w-md",
        "rounded-3xl border border-border/80 bg-card/60 p-3.5 sm:p-5",
        "backdrop-blur-md shadow-xl",
        className
      )}
    >
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {board.map((cellValue, index) => (
          <Cell
            key={index}
            index={index}
            value={cellValue}
            onClick={onCellClick}
            disabled={isBoardDisabled}
            isWinning={isWinningCell(index)}
            previewSymbol={playerSymbol}
          />
        ))}
      </div>
    </div>
  );
}

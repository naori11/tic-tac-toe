"use client";

import React from "react";
import { Circle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellState, Player } from "@/lib/game/types";

export interface CellProps {
  value: CellState;
  index: number;
  onClick: (index: number) => void;
  disabled?: boolean;
  isWinning?: boolean;
  previewSymbol?: Player | null;
}

export function Cell({
  value,
  index,
  onClick,
  disabled = false,
  isWinning = false,
  previewSymbol = null,
}: CellProps) {
  const isClickable = !disabled && value === null;

  return (
    <button
      type="button"
      data-testid={`cell-${index}`}
      aria-label={value ? `Cell ${index + 1}: ${value}` : `Cell ${index + 1}, empty`}
      disabled={!isClickable}
      onClick={() => onClick(index)}
      className={cn(
        "group relative aspect-square w-full rounded-2xl sm:rounded-3xl",
        "flex items-center justify-center",
        "border border-border/70 bg-card/80 backdrop-blur-xs",
        "transition-all duration-200 shadow-sm select-none",
        isClickable &&
          "cursor-pointer hover:bg-accent/60 hover:border-border hover:shadow-md active:scale-95",
        !isClickable && !isWinning && "cursor-not-allowed",
        isWinning &&
          value === "X" &&
          "ring-1 ring-emerald-500/60 bg-emerald-500/10",
        isWinning &&
          value === "O" &&
          "ring-1 ring-rose-500/60 bg-rose-500/10",
        isWinning &&
          !value &&
          "ring-1 ring-primary/60 bg-primary/10"
      )}
    >
      {/* Existing Mark */}
      {value === "X" && (
        <X
          className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-150"
          strokeWidth={2.75}
          aria-hidden="true"
        />
      )}

      {value === "O" && (
        <Circle
          className="h-11 w-11 sm:h-15 sm:w-15 text-rose-600 dark:text-rose-400 animate-in zoom-in-75 duration-150"
          strokeWidth={2.75}
          aria-hidden="true"
        />
      )}

      {/* Ghost Preview on hover for empty, interactive cells */}
      {isClickable && previewSymbol && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-30"
          aria-hidden="true"
        >
          {previewSymbol === "X" ? (
            <X
              className="h-10 w-10 sm:h-14 sm:w-14 text-emerald-600 dark:text-emerald-400"
              strokeWidth={2.5}
            />
          ) : (
            <Circle
              className="h-9 w-9 sm:h-13 sm:w-13 text-rose-600 dark:text-rose-400"
              strokeWidth={2.5}
            />
          )}
        </div>
      )}
    </button>
  );
}

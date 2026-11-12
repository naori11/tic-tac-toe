"use client";

import React, { useEffect, useState } from "react";
import { HelpCircle, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export interface GameHeaderProps {
  className?: string;
}

export function GameHeader({ className }: GameHeaderProps) {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!isRulesOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRulesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRulesOpen]);

  return (
    <header
      data-testid="game-header"
      className={cn(
        "flex items-center justify-between w-full max-w-sm sm:max-w-md mx-auto py-4 px-1",
        className
      )}
    >
      {/* Brand Title & Badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              Tic-Tac-Toe
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
              <Sparkles className="h-2.5 w-2.5 text-primary" />
              AI Edition
            </span>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Modern, tactical & unbeatable AI
          </p>
        </div>
      </div>

      {/* Header Actions: Rules & Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-testid="rules-button"
          aria-label="Game Rules and Difficulty Guide"
          title="Game Rules & AI Guide"
          onClick={() => setIsRulesOpen(true)}
          className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border/70 bg-card/70 hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all text-muted-foreground hover:text-foreground shadow-sm cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <ThemeToggle />
      </div>

      {/* Rules Modal / Dialog */}
      {isRulesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rules-dialog-title"
          data-testid="rules-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsRulesOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h2
                id="rules-dialog-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                How to Play & AI Modes
              </h2>
              <button
                type="button"
                data-testid="close-rules-button"
                aria-label="Close rules dialog"
                onClick={() => setIsRulesOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4 text-sm text-foreground/90">
              <div>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Objective
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Place 3 of your marks in a horizontal, vertical, or diagonal row
                  before your opponent does.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  AI Difficulty Levels
                </h3>
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-2.5">
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Easy
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      AI chooses moves at random. Great for warming up or a relaxed game.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-2.5">
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Medium
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tactical AI that seizes immediate winning lines and blocks your threats, with occasional casual moves.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-2.5">
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Impossible
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Unbeatable Minimax algorithm with depth weighting. It evaluates every possible game tree. Best you can do is a draw!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-3 flex justify-end">
              <button
                type="button"
                data-testid="rules-got-it-button"
                onClick={() => setIsRulesOpen(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

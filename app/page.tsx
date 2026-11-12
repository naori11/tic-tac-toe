"use client";

import React from "react";
import { GameHeader } from "@/components/game/GameHeader";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { GameStatus } from "@/components/game/GameStatus";
import { GameBoard } from "@/components/game/GameBoard";
import { GameControls } from "@/components/game/GameControls";
import { useTicTacToe } from "@/lib/game/useTicTacToe";

export default function TicTacToePage() {
  const {
    board,
    currentPlayer,
    playerSymbol,
    aiSymbol,
    difficulty,
    winner,
    winningLine,
    isAiThinking,
    scores,
    isMounted,
    makeMove,
    resetGame,
    resetScores,
    setDifficulty,
    setPlayerSymbol,
  } = useTicTacToe();

  const isGameInProgress = board.some((cell) => cell !== null) && winner === null;

  return (
    <main className="max-w-md mx-auto min-h-screen py-8 px-4 flex flex-col justify-between items-center gap-6">
      {/* Header with Title, AI Badge, Rules & Theme Toggle */}
      <GameHeader />

      {/* Main Game Container */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Score Board */}
        <ScoreBoard
          scores={scores}
          playerSymbol={playerSymbol}
          aiSymbol={aiSymbol}
          difficulty={difficulty}
          isMounted={isMounted}
          onResetScores={resetScores}
        />

        {/* Turn / Game Result Status */}
        <GameStatus
          winner={winner}
          winningLine={winningLine}
          isAiThinking={isAiThinking}
          currentPlayer={currentPlayer}
          playerSymbol={playerSymbol}
        />

        {/* Interactive 3x3 Grid */}
        <GameBoard
          board={board}
          winningLine={winningLine}
          isAiThinking={isAiThinking}
          winner={winner}
          playerSymbol={playerSymbol}
          currentPlayer={currentPlayer}
          onCellClick={makeMove}
        />

        {/* Controls: Difficulty, Player Symbol, New Game, Reset */}
        <GameControls
          difficulty={difficulty}
          playerSymbol={playerSymbol}
          onDifficultyChange={setDifficulty}
          onPlayerSymbolChange={setPlayerSymbol}
          onNewGame={resetGame}
          onResetScores={resetScores}
          isGameInProgress={isGameInProgress}
          disabled={isAiThinking}
        />
      </div>

      {/* Footer with Tech Stack Pills */}
      <footer className="w-full text-center py-2">
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60">
            React 19
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60">
            Next.js 15
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60">
            Tailwind
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60">
            Vercel
          </span>
        </div>
      </footer>
    </main>
  );
}

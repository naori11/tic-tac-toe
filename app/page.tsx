"use client";

import React, { useEffect, useState } from "react";
import { GameHeader } from "@/components/game/GameHeader";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { GameStatus } from "@/components/game/GameStatus";
import { GameBoard } from "@/components/game/GameBoard";
import { GameControls } from "@/components/game/GameControls";
import { GameOverModal } from "@/components/game/GameOverModal";
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

  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  useEffect(() => {
    if (winner !== null) {
      const timer = setTimeout(() => {
        setIsGameOverModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setIsGameOverModalOpen(false);
    }
  }, [winner]);

  const isGameInProgress = board.some((cell) => cell !== null) && winner === null;

  return (
    <main className="max-w-md mx-auto min-h-screen py-8 px-4 flex flex-col items-center gap-6">
      {/* Header with Title, Rules & Theme Toggle */}
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

        {/* Controls: Difficulty, Player Symbol, Mid-Match Restart */}
        <GameControls
          difficulty={difficulty}
          playerSymbol={playerSymbol}
          onDifficultyChange={setDifficulty}
          onPlayerSymbolChange={setPlayerSymbol}
          onNewGame={resetGame}
          isGameInProgress={isGameInProgress}
          disabled={isAiThinking}
        />
      </div>

      {/* Game Over Dialog */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        winner={winner}
        playerSymbol={playerSymbol}
        scores={scores}
        onPlayAgain={() => {
          resetGame();
          setIsGameOverModalOpen(false);
        }}
        onResetScores={() => {
          resetScores();
          resetGame();
          setIsGameOverModalOpen(false);
        }}
        onClose={() => setIsGameOverModalOpen(false)}
      />
    </main>
  );
}

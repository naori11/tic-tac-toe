import { checkWinner } from "./engine";
import type { Board, Difficulty, Player } from "./types";

export type { Difficulty };

/**
 * Returns an array of available cell indices (0-8) where the cell is null.
 */
export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Easy AI: picks an available move completely at random.
 * Returns -1 if no moves are available.
 */
export function getEasyMove(board: Board): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return -1;
  }
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Medium AI:
 * 1. Checks if AI has an immediate winning move (takes it).
 * 2. Checks if player has an immediate winning move (blocks it).
 * 3. Prefers center cell (index 4) if open.
 * 4. Otherwise picks an available move at random.
 * Returns -1 if no moves are available.
 */
export function getMediumMove(
  board: Board,
  aiSymbol: Player,
  playerSymbol: Player
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return -1;
  }

  const boardCopy = [...board];

  // 1. Take immediate winning move
  for (const move of availableMoves) {
    boardCopy[move] = aiSymbol;
    const win = checkWinner(boardCopy);
    boardCopy[move] = null;
    if (win !== null && win.winner === aiSymbol) {
      return move;
    }
  }

  // 2. Block opponent's immediate winning move
  for (const move of availableMoves) {
    boardCopy[move] = playerSymbol;
    const win = checkWinner(boardCopy);
    boardCopy[move] = null;
    if (win !== null && win.winner === playerSymbol) {
      return move;
    }
  }

  // 3. Prefer center cell (index 4) if open
  if (availableMoves.includes(4)) {
    return 4;
  }

  // 4. Otherwise pick an available move at random
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Classical recursive Minimax with depth penalty:
 * - AI win: 10 - depth
 * - Player win: -10 + depth
 * - Tie: 0
 * Uses alpha-beta pruning for optimal performance.
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiSymbol: Player,
  playerSymbol: Player,
  alpha: number,
  beta: number
): number {
  const win = checkWinner(board);
  if (win !== null) {
    return win.winner === aiSymbol ? 10 - depth : -10 + depth;
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0;
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const score = minimax(
        board,
        depth + 1,
        false,
        aiSymbol,
        playerSymbol,
        alpha,
        beta
      );
      board[move] = null;

      if (score > maxScore) {
        maxScore = score;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break;
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of availableMoves) {
      board[move] = playerSymbol;
      const score = minimax(
        board,
        depth + 1,
        true,
        aiSymbol,
        playerSymbol,
        alpha,
        beta
      );
      board[move] = null;

      if (score < minScore) {
        minScore = score;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break;
      }
    }
    return minScore;
  }
}

/**
 * Minimax AI (Impossible difficulty):
 * Returns the index of the optimal move according to classical minimax.
 * Returns -1 if no moves are available.
 */
export function getMinimaxMove(
  board: Board,
  aiSymbol: Player,
  playerSymbol: Player
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return -1;
  }

  if (availableMoves.length === 1) {
    return availableMoves[0];
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];
  let alpha = -Infinity;
  const beta = Infinity;

  const boardCopy = [...board];

  for (const move of availableMoves) {
    boardCopy[move] = aiSymbol;
    const score = minimax(
      boardCopy,
      0,
      false,
      aiSymbol,
      playerSymbol,
      alpha,
      beta
    );
    boardCopy[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, score);
  }

  return bestMove;
}

/**
 * Main AI move router:
 * Determines player symbol opposite to aiSymbol, routes to Easy, Medium, or Impossible.
 * Returns -1 if no moves are available.
 */
export function getAiMove(
  board: Board,
  difficulty: Difficulty,
  aiSymbol: Player
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return -1;
  }

  const playerSymbol: Player = aiSymbol === "X" ? "O" : "X";

  switch (difficulty) {
    case "easy":
      return getEasyMove(board);
    case "medium":
      return getMediumMove(board, aiSymbol, playerSymbol);
    case "impossible":
      return getMinimaxMove(board, aiSymbol, playerSymbol);
    default: {
      const _exhaustiveCheck: never = difficulty;
      return -1;
    }
  }
}

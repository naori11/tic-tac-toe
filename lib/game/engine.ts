import type { Board, CellState, WinResult, WinningLine } from "./types";

export const WINNING_LINES: WinningLine[] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export function createInitialBoard(): Board {
  return Array<CellState>(9).fill(null);
}

export function checkWinner(board: Board): WinResult | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const first = board[a];
    if (first !== null && first === board[b] && first === board[c]) {
      return { winner: first, line };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function isValidMove(board: Board, index: number): boolean {
  if (!Number.isInteger(index) || index < 0 || index >= board.length) {
    return false;
  }
  return board[index] === null;
}

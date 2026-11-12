export type Player = 'X' | 'O';

export type CellState = Player | null;

export type Board = CellState[];

export type WinningLine = [number, number, number];

export interface WinResult {
  winner: Player;
  line: WinningLine;
}

export type Difficulty = 'easy' | 'medium' | 'impossible';

export type GameResult = Player | 'draw' | null;

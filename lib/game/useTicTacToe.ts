import { useCallback, useEffect, useRef, useState } from "react";
import { getAiMove } from "./ai";
import { checkWinner, createInitialBoard, isBoardFull, isValidMove } from "./engine";
import type { Board, Difficulty, Player, WinningLine } from "./types";

export interface Score {
  player: number;
  ai: number;
  draws: number;
}

export interface UseTicTacToeOptions {
  initialDifficulty?: Difficulty;
  initialPlayerSymbol?: Player;
  aiDelayMs?: number;
}

export const STORAGE_KEY = "tic-tac-toe-scores";

export function useTicTacToe(options: UseTicTacToeOptions = {}): {
  board: Board;
  currentPlayer: Player;
  playerSymbol: Player;
  aiSymbol: Player;
  difficulty: Difficulty;
  winner: Player | "draw" | null;
  winningLine: WinningLine | null;
  isAiThinking: boolean;
  scores: Score;
  isMounted: boolean;
  makeMove: (index: number) => void;
  resetGame: () => void;
  resetScores: () => void;
  setDifficulty: (d: Difficulty) => void;
  setPlayerSymbol: (symbol: Player) => void;
} {
  const {
    initialDifficulty = "medium",
    initialPlayerSymbol = "X",
    aiDelayMs = 350,
  } = options;

  const [playerSymbol, setPlayerSymbolState] = useState<Player>(initialPlayerSymbol);
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialDifficulty);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [scores, setScores] = useState<Score>({ player: 0, ai: 0, draws: 0 });
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hasLoadedRef = useRef(false);

  const aiSymbol: Player = playerSymbol === "X" ? "O" : "X";

  // Hydrate scores from localStorage safely on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof parsed.player === "number" &&
          typeof parsed.ai === "number" &&
          typeof parsed.draws === "number"
        ) {
          setScores({
            player: parsed.player,
            ai: parsed.ai,
            draws: parsed.draws,
          });
        }
      }
    } catch {
      // Safe fallback for SSR or restricted environments (e.g. private browsing)
    }
    hasLoadedRef.current = true;
    setIsMounted(true);
  }, []);

  // Persist scores to localStorage on changes once mounted
  useEffect(() => {
    if (!isMounted || !hasLoadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // Safe storage fallback
    }
  }, [scores, isMounted]);

  // AI Turn Pacing and Execution
  useEffect(() => {
    if (winner !== null || currentPlayer !== aiSymbol) {
      setIsAiThinking(false);
      return;
    }

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const aiMoveIndex = getAiMove(board, difficulty, aiSymbol);
      if (aiMoveIndex === -1) {
        setIsAiThinking(false);
        return;
      }

      const nextBoard = [...board];
      nextBoard[aiMoveIndex] = aiSymbol;

      const win = checkWinner(nextBoard);
      if (win) {
        setBoard(nextBoard);
        setWinner(aiSymbol);
        setWinningLine(win.line);
        setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
      } else if (isBoardFull(nextBoard)) {
        setBoard(nextBoard);
        setWinner("draw");
        setWinningLine(null);
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setBoard(nextBoard);
        setCurrentPlayer(playerSymbol);
      }
      setIsAiThinking(false);
    }, aiDelayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [board, currentPlayer, aiSymbol, difficulty, winner, playerSymbol, aiDelayMs]);

  const makeMove = useCallback(
    (index: number) => {
      if (winner !== null || isAiThinking || currentPlayer !== playerSymbol) {
        return;
      }

      if (!isValidMove(board, index)) {
        return;
      }

      const nextBoard = [...board];
      nextBoard[index] = playerSymbol;

      const win = checkWinner(nextBoard);
      if (win) {
        setBoard(nextBoard);
        setWinner(playerSymbol);
        setWinningLine(win.line);
        setScores((prev) => ({ ...prev, player: prev.player + 1 }));
        return;
      }

      if (isBoardFull(nextBoard)) {
        setBoard(nextBoard);
        setWinner("draw");
        setWinningLine(null);
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
        return;
      }

      setBoard(nextBoard);
      setCurrentPlayer(aiSymbol);
      setIsAiThinking(true);
    },
    [board, currentPlayer, isAiThinking, playerSymbol, aiSymbol, winner]
  );

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  }, []);

  const resetScores = useCallback(() => {
    const initialScores: Score = { player: 0, ai: 0, draws: 0 };
    setScores(initialScores);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialScores));
    } catch {
      // Safe storage fallback
    }
  }, []);

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
  }, []);

  const setPlayerSymbol = useCallback((symbol: Player) => {
    setPlayerSymbolState(symbol);
    setBoard(createInitialBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  }, []);

  return {
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
  };
}

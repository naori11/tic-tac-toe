import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as aiModule from "../lib/game/ai";
import { STORAGE_KEY, useTicTacToe } from "../lib/game/useTicTacToe";

describe("useTicTacToe", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.playerSymbol).toBe("X");
    expect(result.current.aiSymbol).toBe("O");
    expect(result.current.difficulty).toBe("medium");
    expect(result.current.winner).toBeNull();
    expect(result.current.winningLine).toBeNull();
    expect(result.current.isAiThinking).toBe(false);
    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 0 });
    expect(result.current.isMounted).toBe(true);
  });

  it("handles player move and triggers AI response after delay", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove(0);
    });

    expect(result.current.board[0]).toBe("X");
    expect(result.current.currentPlayer).toBe("O");
    expect(result.current.isAiThinking).toBe(true);

    // AI should not have moved yet before timer
    expect(result.current.board.filter((c) => c !== null).length).toBe(1);

    // Advance timer past AI thinking delay (350ms)
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.isAiThinking).toBe(false);
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.board.filter((c) => c !== null).length).toBe(2);
    expect(result.current.board.filter((c) => c === "O").length).toBe(1);
  });

  it("prevents moves on occupied cells and while AI is thinking", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove(0);
    });

    // Attempt to click same cell
    act(() => {
      result.current.makeMove(0);
    });
    expect(result.current.board[0]).toBe("X");

    // Attempt to click another cell while AI is thinking
    expect(result.current.isAiThinking).toBe(true);
    act(() => {
      result.current.makeMove(1);
    });
    // Cell 1 should still be null because isAiThinking is true
    expect(result.current.board[1]).toBeNull();
  });

  it("prevents out of bounds moves", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove(-1);
      result.current.makeMove(9);
      result.current.makeMove(100);
    });

    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.currentPlayer).toBe("X");
  });

  it("detects player victory, sets winningLine, increments player score, and ignores further moves", () => {
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    // Force AI moves to predetermined non-blocking squares
    aiSpy
      .mockReturnValueOnce(3) // AI plays 3
      .mockReturnValueOnce(4); // AI plays 4

    const { result } = renderHook(() => useTicTacToe());

    // Turn 1: Player plays 0
    act(() => {
      result.current.makeMove(0);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(result.current.board[0]).toBe("X");
    expect(result.current.board[3]).toBe("O");

    // Turn 2: Player plays 1
    act(() => {
      result.current.makeMove(1);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(result.current.board[1]).toBe("X");
    expect(result.current.board[4]).toBe("O");

    // Turn 3: Player plays 2 -> Row [0, 1, 2] complete win!
    act(() => {
      result.current.makeMove(2);
    });

    expect(result.current.winner).toBe("X");
    expect(result.current.winningLine).toEqual([0, 1, 2]);
    expect(result.current.scores).toEqual({ player: 1, ai: 0, draws: 0 });
    expect(result.current.isAiThinking).toBe(false);

    // AI should not make any move after game over
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.board[5]).toBeNull();

    // Subsequent clicks should be ignored
    act(() => {
      result.current.makeMove(5);
    });
    expect(result.current.board[5]).toBeNull();
  });

  it("detects AI victory, sets winningLine, and increments AI score", () => {
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    // AI wins with [3, 4, 5]
    aiSpy
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5);

    const { result } = renderHook(() => useTicTacToe());

    // Move 1: Player 0, AI 3
    act(() => {
      result.current.makeMove(0);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Move 2: Player 1, AI 4
    act(() => {
      result.current.makeMove(1);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Move 3: Player 6, AI 5 -> AI wins on row [3, 4, 5]
    act(() => {
      result.current.makeMove(6);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.winner).toBe("O");
    expect(result.current.winningLine).toEqual([3, 4, 5]);
    expect(result.current.scores).toEqual({ player: 0, ai: 1, draws: 0 });
    expect(result.current.isAiThinking).toBe(false);
  });

  it("detects draw, increments draws score, and sets winner to 'draw'", () => {
    // Fill board without winner:
    // X O X
    // X X O
    // O X O
    // Moves order:
    // P: 0 (X), AI: 1 (O)
    // P: 2 (X), AI: 5 (O)
    // P: 3 (X), AI: 6 (O)
    // P: 4 (X), AI: 8 (O)
    // P: 7 (X) -> Draw!
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    aiSpy
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(8);

    const { result } = renderHook(() => useTicTacToe());

    // P: 0, AI: 1
    act(() => {
      result.current.makeMove(0);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // P: 2, AI: 5
    act(() => {
      result.current.makeMove(2);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // P: 3, AI: 6
    act(() => {
      result.current.makeMove(3);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // P: 4, AI: 8
    act(() => {
      result.current.makeMove(4);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // P: 7 -> 9th move fills board
    act(() => {
      result.current.makeMove(7);
    });

    expect(result.current.winner).toBe("draw");
    expect(result.current.winningLine).toBeNull();
    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 1 });
    expect(result.current.isAiThinking).toBe(false);
  });

  it("allows resetting the game while preserving scores", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove(4);
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.winner).toBeNull();
    expect(result.current.winningLine).toBeNull();
    expect(result.current.isAiThinking).toBe(false);
  });

  it("cancels pending AI move when resetGame is called mid-think", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.makeMove(0);
    });
    expect(result.current.isAiThinking).toBe(true);

    act(() => {
      result.current.resetGame();
    });

    // Advance time - AI move should NOT fire
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.board).toEqual(Array(9).fill(null));
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.isAiThinking).toBe(false);
  });

  it("allows setting player symbol to O where AI moves first as X", () => {
    const { result } = renderHook(() => useTicTacToe());

    act(() => {
      result.current.setPlayerSymbol("O");
    });

    expect(result.current.playerSymbol).toBe("O");
    expect(result.current.aiSymbol).toBe("X");
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.isAiThinking).toBe(true);

    // AI takes the first move
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.isAiThinking).toBe(false);
    expect(result.current.currentPlayer).toBe("O");
    expect(result.current.board.filter((c) => c === "X").length).toBe(1);
    expect(result.current.board.filter((c) => c === "O").length).toBe(0);
  });

  it("triggers AI first move when initialized with playerSymbol 'O'", () => {
    const { result } = renderHook(() =>
      useTicTacToe({ initialPlayerSymbol: "O" })
    );

    expect(result.current.playerSymbol).toBe("O");
    expect(result.current.aiSymbol).toBe("X");
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.isAiThinking).toBe(true);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(result.current.isAiThinking).toBe(false);
    expect(result.current.currentPlayer).toBe("O");
    expect(result.current.board.filter((c) => c === "X").length).toBe(1);
  });

  it("allows changing difficulty", () => {
    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.difficulty).toBe("medium");

    act(() => {
      result.current.setDifficulty("impossible");
    });
    expect(result.current.difficulty).toBe("impossible");

    act(() => {
      result.current.setDifficulty("easy");
    });
    expect(result.current.difficulty).toBe("easy");
  });

  it("resets scores and updates localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 5, ai: 3, draws: 2 })
    );

    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.scores).toEqual({ player: 5, ai: 3, draws: 2 });

    act(() => {
      result.current.resetScores();
    });

    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 0 });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")).toEqual({
      player: 0,
      ai: 0,
      draws: 0,
    });
  });

  it("loads scores from localStorage on mount safely", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ player: 4, ai: 1, draws: 2 })
    );

    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.scores).toEqual({ player: 4, ai: 1, draws: 2 });
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "invalid-json-data{{");

    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 0 });
  });

  it("handles localStorage errors gracefully when storage throws", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceeded or SecurityError");
      });
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceeded or SecurityError");
      });

    const { result } = renderHook(() => useTicTacToe());

    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 0 });

    act(() => {
      result.current.resetScores();
    });

    expect(result.current.scores).toEqual({ player: 0, ai: 0, draws: 0 });

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});

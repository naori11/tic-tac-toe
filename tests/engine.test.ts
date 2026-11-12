import { describe, it, expect } from "vitest";
import {
  createInitialBoard,
  checkWinner,
  isBoardFull,
  isValidMove,
  WINNING_LINES,
} from "@/lib/game/engine";
import type { Board, Player, WinningLine } from "@/lib/game/types";

describe("WINNING_LINES", () => {
  it("should contain exactly 8 winning lines", () => {
    expect(WINNING_LINES).toHaveLength(8);
  });

  it("should include all 3 rows, 3 columns, and 2 diagonals", () => {
    const expectedLines: WinningLine[] = [
      [0, 1, 2], // Row 1
      [3, 4, 5], // Row 2
      [6, 7, 8], // Row 3
      [0, 3, 6], // Col 1
      [1, 4, 7], // Col 2
      [2, 5, 8], // Col 3
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    expect(WINNING_LINES).toEqual(expectedLines);
  });
});

describe("createInitialBoard", () => {
  it("should return an array of 9 null cells", () => {
    const board = createInitialBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });

  it("should return a new array instance on each call", () => {
    const board1 = createInitialBoard();
    const board2 = createInitialBoard();
    expect(board1).not.toBe(board2);
    expect(board1).toEqual(board2);
  });
});

describe("checkWinner", () => {
  it("should return null for an empty board", () => {
    const board = createInitialBoard();
    expect(checkWinner(board)).toBeNull();
  });

  it("should return null for an ongoing game without a winner", () => {
    const board: Board = [
      "X", "O", "X",
      "O", "X", null,
      null, null, null,
    ];
    expect(checkWinner(board)).toBeNull();
  });

  it("should return null for a draw game", () => {
    const drawBoard: Board = [
      "X", "O", "X",
      "X", "O", "O",
      "O", "X", "X",
    ];
    expect(checkWinner(drawBoard)).toBeNull();
  });

  describe("detects all 8 winning lines for Player X", () => {
    const cases: Array<{ name: string; line: WinningLine; board: Board }> = [
      {
        name: "Row 1 (0, 1, 2)",
        line: [0, 1, 2],
        board: ["X", "X", "X", "O", "O", null, null, null, null],
      },
      {
        name: "Row 2 (3, 4, 5)",
        line: [3, 4, 5],
        board: ["O", "O", null, "X", "X", "X", null, null, null],
      },
      {
        name: "Row 3 (6, 7, 8)",
        line: [6, 7, 8],
        board: ["O", null, "O", null, null, null, "X", "X", "X"],
      },
      {
        name: "Col 1 (0, 3, 6)",
        line: [0, 3, 6],
        board: ["X", "O", null, "X", "O", null, "X", null, null],
      },
      {
        name: "Col 2 (1, 4, 7)",
        line: [1, 4, 7],
        board: ["O", "X", null, null, "X", "O", null, "X", null],
      },
      {
        name: "Col 3 (2, 5, 8)",
        line: [2, 5, 8],
        board: ["O", null, "X", null, "O", "X", null, null, "X"],
      },
      {
        name: "Diagonal top-left to bottom-right (0, 4, 8)",
        line: [0, 4, 8],
        board: ["X", "O", null, "O", "X", null, null, null, "X"],
      },
      {
        name: "Diagonal top-right to bottom-left (2, 4, 6)",
        line: [2, 4, 6],
        board: [null, "O", "X", "O", "X", null, "X", null, null],
      },
    ];

    cases.forEach(({ name, line, board }) => {
      it(`wins on ${name}`, () => {
        const result = checkWinner(board);
        expect(result).toEqual({ winner: "X", line });
      });
    });
  });

  describe("detects winning lines for Player O", () => {
    it("wins on Row 1 for Player O", () => {
      const board: Board = ["O", "O", "O", "X", "X", null, null, "X", null];
      expect(checkWinner(board)).toEqual({
        winner: "O",
        line: [0, 1, 2],
      });
    });

    it("wins on Diagonal (2, 4, 6) for Player O", () => {
      const board: Board = [
        "X", "X", "O",
        "X", "O", null,
        "O", null, null,
      ];
      expect(checkWinner(board)).toEqual({
        winner: "O",
        line: [2, 4, 6],
      });
    });
  });
});

describe("isBoardFull", () => {
  it("should return false for an empty board", () => {
    const board = createInitialBoard();
    expect(isBoardFull(board)).toBe(false);
  });

  it("should return false when at least one cell is empty", () => {
    const board: Board = [
      "X", "O", "X",
      "X", "O", "O",
      "O", "X", null,
    ];
    expect(isBoardFull(board)).toBe(false);
  });

  it("should return true when all cells are filled", () => {
    const board: Board = [
      "X", "O", "X",
      "X", "O", "O",
      "O", "X", "X",
    ];
    expect(isBoardFull(board)).toBe(true);
  });
});

describe("isValidMove", () => {
  it("should return true for empty cells within valid range (0-8)", () => {
    const board = createInitialBoard();
    for (let i = 0; i < 9; i++) {
      expect(isValidMove(board, i)).toBe(true);
    }
  });

  it("should return false for already occupied cells", () => {
    const board: Board = [
      "X", null, "O",
      null, null, null,
      null, null, null,
    ];
    expect(isValidMove(board, 0)).toBe(false);
    expect(isValidMove(board, 1)).toBe(true);
    expect(isValidMove(board, 2)).toBe(false);
  });

  it("should return false for indices out of range", () => {
    const board = createInitialBoard();
    expect(isValidMove(board, -1)).toBe(false);
    expect(isValidMove(board, 9)).toBe(false);
    expect(isValidMove(board, 100)).toBe(false);
  });

  it("should return false for non-integer or NaN indices", () => {
    const board = createInitialBoard();
    expect(isValidMove(board, 1.5)).toBe(false);
    expect(isValidMove(board, NaN)).toBe(false);
  });
});

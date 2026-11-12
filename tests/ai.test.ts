import { describe, it, expect, vi } from "vitest";
import {
  getAvailableMoves,
  getEasyMove,
  getMediumMove,
  getMinimaxMove,
  getAiMove,
} from "@/lib/game/ai";
import { createInitialBoard, checkWinner, isBoardFull } from "@/lib/game/engine";
import type { Board, Player } from "@/lib/game/types";

describe("AI Engine", () => {
  describe("getAvailableMoves", () => {
    it("should return all indices 0..8 for an empty board", () => {
      const board = createInitialBoard();
      expect(getAvailableMoves(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should return only indices of null cells for a partially filled board", () => {
      const board: Board = [
        "X", null, "O",
        null, "X", null,
        "O", null, "X",
      ];
      expect(getAvailableMoves(board)).toEqual([1, 3, 5, 7]);
    });

    it("should return empty array for a full board", () => {
      const board: Board = [
        "X", "O", "X",
        "X", "O", "O",
        "O", "X", "X",
      ];
      expect(getAvailableMoves(board)).toEqual([]);
    });
  });

  describe("getEasyMove", () => {
    it("should return -1 if the board is full", () => {
      const board: Board = [
        "X", "O", "X",
        "X", "O", "O",
        "O", "X", "X",
      ];
      expect(getEasyMove(board)).toBe(-1);
    });

    it("should always pick an available open cell", () => {
      const board: Board = [
        "X", null, "O",
        "O", "X", null,
        null, "O", "X",
      ];
      const available = getAvailableMoves(board); // [1, 5, 6]

      for (let i = 0; i < 20; i++) {
        const move = getEasyMove(board);
        expect(available).toContain(move);
      }
    });

    it("should exhibit randomness across multiple calls on an open board", () => {
      const board = createInitialBoard();
      const moves = new Set<number>();
      for (let i = 0; i < 50; i++) {
        moves.add(getEasyMove(board));
      }
      // Over 50 random samples from 9 cells, we expect more than 1 distinct cell
      expect(moves.size).toBeGreaterThan(1);
    });
  });

  describe("getMediumMove", () => {
    it("should return -1 if the board is full", () => {
      const board: Board = [
        "X", "O", "X",
        "X", "O", "O",
        "O", "X", "X",
      ];
      expect(getMediumMove(board, "X", "O")).toBe(-1);
    });

    it("should take an immediate winning move for AI (row)", () => {
      const board: Board = [
        "X", "X", null,
        "O", "O", null,
        null, null, null,
      ];
      // AI is X, open winning move is at index 2
      expect(getMediumMove(board, "X", "O")).toBe(2);
    });

    it("should take an immediate winning move for AI (diagonal)", () => {
      const board: Board = [
        "O", "X", "X",
        "X", "O", null,
        null, null, null,
      ];
      // AI is O, open winning move on diagonal [0, 4, 8] is at index 8
      expect(getMediumMove(board, "O", "X")).toBe(8);
    });

    it("should block opponent immediate winning move if AI cannot win immediately", () => {
      const board: Board = [
        "X", "X", null,
        "O", null, null,
        null, null, null,
      ];
      // AI is O, Player is X with threat at 2
      expect(getMediumMove(board, "O", "X")).toBe(2);
    });

    it("should prioritize AI winning over blocking opponent when both have winning moves", () => {
      const board: Board = [
        "X", "X", null, // X can win at 2
        "O", "O", null, // O can win at 5
        null, null, null,
      ];
      // AI is O: should pick 5 to win immediately rather than blocking 2
      expect(getMediumMove(board, "O", "X")).toBe(5);

      // AI is X: should pick 2 to win immediately rather than blocking 5
      expect(getMediumMove(board, "X", "O")).toBe(2);
    });

    it("should prefer center cell (index 4) if open and no immediate win/block", () => {
      const board: Board = [
        "X", null, null,
        null, null, null,
        null, null, null,
      ];
      // AI is O, center (4) is empty
      expect(getMediumMove(board, "O", "X")).toBe(4);
    });

    it("should pick an available move when center is taken and no win/block exists", () => {
      const board: Board = [
        "X", null, null,
        null, "O", null,
        null, null, null,
      ];
      const move = getMediumMove(board, "X", "O");
      const available = getAvailableMoves(board);
      expect(available).toContain(move);
      expect(move).not.toBe(0);
      expect(move).not.toBe(4);
    });
  });

  describe("getMinimaxMove", () => {
    it("should return -1 if the board is full", () => {
      const board: Board = [
        "X", "O", "X",
        "X", "O", "O",
        "O", "X", "X",
      ];
      expect(getMinimaxMove(board, "X", "O")).toBe(-1);
    });

    it("should take immediate winning move", () => {
      const board: Board = [
        "X", "X", null,
        "O", "O", null,
        null, null, null,
      ];
      // AI is X -> must pick 2
      expect(getMinimaxMove(board, "X", "O")).toBe(2);
    });

    it("should block opponent winning move", () => {
      const board: Board = [
        "X", "X", null,
        "O", null, null,
        null, null, null,
      ];
      // AI is O, X threatens at 2 -> must pick 2
      expect(getMinimaxMove(board, "O", "X")).toBe(2);
    });

    it("should prevent corner fork setup", () => {
      // Opponent X takes opposite corners (0 and 8), O must play edge (1, 3, 5, or 7)
      // to avoid fork trap (assuming center 4 was taken by O)
      const board: Board = [
        "X", null, null,
        null, "O", null,
        null, null, "X",
      ];
      const move = getMinimaxMove(board, "O", "X");
      // Side cells are 1, 3, 5, 7. Playing a corner allows X to set up a double threat.
      expect([1, 3, 5, 7]).toContain(move);
    });

    it("should prefer a faster win over a slower win (depth penalty)", () => {
      // AI is X:
      // Can win immediately at index 2 (row 0: [X, X, null]), or slower elsewhere
      const board: Board = [
        "X", "X", null,
        "O", "O", null,
        null, null, null,
      ];
      expect(getMinimaxMove(board, "X", "O")).toBe(2);
    });

    it("should choose an optimal move from an empty board", () => {
      const board = createInitialBoard();
      const move = getMinimaxMove(board, "X", "O");
      // Optimal opening moves are corners (0, 2, 6, 8) or center (4)
      expect([0, 2, 4, 6, 8]).toContain(move);
    });

    it("always results in a draw when playing against itself (self-play)", () => {
      const board = createInitialBoard();
      let currentTurn: Player = "X";

      while (!isBoardFull(board) && checkWinner(board) === null) {
        const opponent: Player = currentTurn === "X" ? "O" : "X";
        const move = getMinimaxMove(board, currentTurn, opponent);
        expect(move).toBeGreaterThanOrEqual(0);
        board[move] = currentTurn;
        currentTurn = opponent;
      }

      // Neither player should win; perfect play must draw
      expect(checkWinner(board)).toBeNull();
      expect(isBoardFull(board)).toBe(true);
    });
  });

  describe("getAiMove", () => {
    it("should return -1 when board is full regardless of difficulty", () => {
      const board: Board = [
        "X", "O", "X",
        "X", "O", "O",
        "O", "X", "X",
      ];
      expect(getAiMove(board, "easy", "X")).toBe(-1);
      expect(getAiMove(board, "medium", "X")).toBe(-1);
      expect(getAiMove(board, "impossible", "X")).toBe(-1);
    });

    it("should route 'easy' difficulty to valid open cell", () => {
      const board = createInitialBoard();
      board[0] = "X";
      const move = getAiMove(board, "easy", "O");
      expect(getAvailableMoves(board)).toContain(move);
      expect(move).not.toBe(0);
    });

    it("should route 'medium' difficulty and block opponent", () => {
      const board: Board = [
        "X", "X", null,
        null, null, null,
        null, null, null,
      ];
      // AI is O, should block X at 2
      const move = getAiMove(board, "medium", "O");
      expect(move).toBe(2);
    });

    it("should route 'impossible' difficulty and pick winning move", () => {
      const board: Board = [
        "O", "O", null,
        "X", "X", null,
        null, null, null,
      ];
      // AI is O, should win at 2
      const move = getAiMove(board, "impossible", "O");
      expect(move).toBe(2);
    });
  });

  describe("Property-based / Invariant Test: Minimax NEVER loses across 100 simulated games", () => {
    function simulateGame(
      aiSymbol: Player,
      aiGoesFirst: boolean
    ): { winner: Player | null; isDraw: boolean } {
      const board = createInitialBoard();
      const playerSymbol: Player = aiSymbol === "X" ? "O" : "X";
      let turn: Player = "X";

      while (!isBoardFull(board) && checkWinner(board) === null) {
        if (turn === aiSymbol) {
          const move = getMinimaxMove(board, aiSymbol, playerSymbol);
          board[move] = aiSymbol;
        } else {
          // Opponent makes random legal move
          const available = getAvailableMoves(board);
          const randomMove = available[Math.floor(Math.random() * available.length)];
          board[randomMove] = playerSymbol;
        }
        turn = turn === "X" ? "O" : "X";
      }

      const winResult = checkWinner(board);
      return {
        winner: winResult ? winResult.winner : null,
        isDraw: winResult === null && isBoardFull(board),
      };
    }

    it("never loses when AI plays first as X (50 games)", () => {
      let aiLosses = 0;
      let aiWins = 0;
      let draws = 0;

      for (let i = 0; i < 50; i++) {
        const result = simulateGame("X", true);
        if (result.winner === "O") {
          aiLosses++;
        } else if (result.winner === "X") {
          aiWins++;
        } else {
          draws++;
        }
      }

      expect(aiLosses).toBe(0);
      expect(aiWins + draws).toBe(50);
    });

    it("never loses when AI plays second as O (50 games)", () => {
      let aiLosses = 0;
      let aiWins = 0;
      let draws = 0;

      for (let i = 0; i < 50; i++) {
        const result = simulateGame("O", false);
        if (result.winner === "X") {
          aiLosses++;
        } else if (result.winner === "O") {
          aiWins++;
        } else {
          draws++;
        }
      }

      expect(aiLosses).toBe(0);
      expect(aiWins + draws).toBe(50);
    });
  });
});

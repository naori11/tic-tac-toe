import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

import confetti from "canvas-confetti";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";
import { Cell } from "../components/game/Cell";
import { GameBoard } from "../components/game/GameBoard";
import { ScoreBoard } from "../components/game/ScoreBoard";
import { GameControls } from "../components/game/GameControls";
import { GameStatus } from "../components/game/GameStatus";
import { GameHeader } from "../components/game/GameHeader";

describe("UI Components & Primitives", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ThemeProvider", () => {
    it("renders children correctly", () => {
      const { container } = render(
        <ThemeProvider attribute="class" defaultTheme="system">
          <div data-testid="child-element">Test Content</div>
        </ThemeProvider>
      );
      expect(screen.getByTestId("child-element").textContent).toBe("Test Content");
      expect(container).toBeDefined();
    });
  });

  describe("ThemeToggle", () => {
    it("renders theme toggle button with accessible label", () => {
      render(<ThemeToggle />);
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeDefined();
    });

    it("can be clicked to toggle theme", () => {
      render(<ThemeToggle />);
      const button = screen.getByRole("button", { name: /toggle theme/i });
      fireEvent.click(button);
      expect(button).toBeDefined();
    });
  });

  describe("Cell", () => {
    it("renders empty cell with accessible label and handles click", () => {
      const handleClick = vi.fn();
      render(
        <Cell
          index={0}
          value={null}
          onClick={handleClick}
          previewSymbol="X"
        />
      );

      const cell = screen.getByTestId("cell-0") as HTMLButtonElement;
      expect(cell.getAttribute("aria-label")).toBe("Cell 1, empty");
      expect(cell.disabled).toBe(false);

      fireEvent.click(cell);
      expect(handleClick).toHaveBeenCalledWith(0);
    });

    it("renders marked 'X' cell and disables click", () => {
      const handleClick = vi.fn();
      render(
        <Cell
          index={4}
          value="X"
          onClick={handleClick}
        />
      );

      const cell = screen.getByTestId("cell-4") as HTMLButtonElement;
      expect(cell.getAttribute("aria-label")).toBe("Cell 5: X");
      expect(cell.disabled).toBe(true);

      fireEvent.click(cell);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders marked 'O' cell and disables click", () => {
      const handleClick = vi.fn();
      render(
        <Cell
          index={2}
          value="O"
          onClick={handleClick}
        />
      );

      const cell = screen.getByTestId("cell-2") as HTMLButtonElement;
      expect(cell.getAttribute("aria-label")).toBe("Cell 3: O");
      expect(cell.disabled).toBe(true);
    });

    it("applies winning highlight styling when isWinning is true", () => {
      const { rerender } = render(
        <Cell
          index={1}
          value="X"
          onClick={() => {}}
          isWinning={true}
        />
      );

      let cell = screen.getByTestId("cell-1");
      expect(cell.className).toContain("ring-emerald-500");

      rerender(
        <Cell
          index={1}
          value="O"
          onClick={() => {}}
          isWinning={true}
        />
      );
      cell = screen.getByTestId("cell-1");
      expect(cell.className).toContain("ring-rose-500");
    });
  });

  describe("GameBoard", () => {
    it("renders 9 cells in a grid", () => {
      const board = Array(9).fill(null);
      const handleClick = vi.fn();

      render(
        <GameBoard
          board={board}
          onCellClick={handleClick}
          winningLine={null}
          playerSymbol="X"
        />
      );

      expect(screen.getByTestId("game-board")).toBeDefined();
      for (let i = 0; i < 9; i++) {
        expect(screen.getByTestId(`cell-${i}`)).toBeDefined();
      }
    });

    it("triggers onCellClick when an empty cell is clicked", () => {
      const board = Array(9).fill(null);
      const handleClick = vi.fn();

      render(
        <GameBoard
          board={board}
          onCellClick={handleClick}
          winningLine={null}
        />
      );

      fireEvent.click(screen.getByTestId("cell-3"));
      expect(handleClick).toHaveBeenCalledWith(3);
    });

    it("highlights cells in the winning line", () => {
      const board: ("X" | "O" | null)[] = ["X", "X", "X", "O", "O", null, null, null, null];
      render(
        <GameBoard
          board={board}
          onCellClick={() => {}}
          winningLine={[0, 1, 2]}
          winner="X"
          playerSymbol="X"
        />
      );

      expect(screen.getByTestId("cell-0").className).toContain("ring-emerald-500");
      expect(screen.getByTestId("cell-1").className).toContain("ring-emerald-500");
      expect(screen.getByTestId("cell-2").className).toContain("ring-emerald-500");
      expect(screen.getByTestId("cell-3").className).not.toContain("ring-rose-500");
    });

    it("triggers confetti when player wins", () => {
      const board: ("X" | "O" | null)[] = ["X", "X", "X", null, null, null, null, null, null];
      render(
        <GameBoard
          board={board}
          onCellClick={() => {}}
          winningLine={[0, 1, 2]}
          winner="X"
          playerSymbol="X"
        />
      );

      expect(confetti).toHaveBeenCalled();
    });

    it("does not trigger confetti when AI wins", () => {
      const board: ("X" | "O" | null)[] = ["O", "O", "O", null, null, null, null, null, null];
      render(
        <GameBoard
          board={board}
          onCellClick={() => {}}
          winningLine={[0, 1, 2]}
          winner="O"
          playerSymbol="X"
        />
      );

      expect(confetti).not.toHaveBeenCalled();
    });
  });

  describe("ScoreBoard", () => {
    it("renders player, draws, and AI scores correctly", () => {
      render(
        <ScoreBoard
          scores={{ player: 5, ai: 2, draws: 3 }}
          playerSymbol="X"
          aiSymbol="O"
          difficulty="impossible"
        />
      );

      expect(screen.getByTestId("player-score-count").textContent).toBe("5");
      expect(screen.getByTestId("draws-score-count").textContent).toBe("3");
      expect(screen.getByTestId("ai-score-count").textContent).toBe("2");
      expect(screen.getByText("impossible")).toBeDefined();
    });
  });

  describe("GameControls", () => {
    it("renders difficulty tabs and triggers onDifficultyChange", () => {
      const handleDifficulty = vi.fn();
      render(
        <GameControls
          difficulty="medium"
          onDifficultyChange={handleDifficulty}
          playerSymbol="X"
          onPlayerSymbolChange={() => {}}
          onNewGame={() => {}}
          onResetScores={() => {}}
        />
      );

      const impossibleTab = screen.getByRole("tab", { name: /impossible/i });
      fireEvent.click(impossibleTab);
      expect(handleDifficulty).toHaveBeenCalledWith("impossible");
    });

    it("toggles symbol when player selects symbol", () => {
      const handleSymbol = vi.fn();
      render(
        <GameControls
          difficulty="easy"
          onDifficultyChange={() => {}}
          playerSymbol="X"
          onPlayerSymbolChange={handleSymbol}
          onNewGame={() => {}}
          onResetScores={() => {}}
        />
      );

      const symbolOButton = screen.getByRole("button", { name: /play as o/i });
      fireEvent.click(symbolOButton);
      expect(handleSymbol).toHaveBeenCalledWith("O");
    });

    it("triggers onNewGame and onResetScores when clicked", () => {
      const handleNewGame = vi.fn();
      const handleResetScores = vi.fn();
      render(
        <GameControls
          difficulty="medium"
          onDifficultyChange={() => {}}
          playerSymbol="X"
          onPlayerSymbolChange={() => {}}
          onNewGame={handleNewGame}
          onResetScores={handleResetScores}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /start new game/i }));
      expect(handleNewGame).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: /reset all scores/i }));
      expect(handleResetScores).toHaveBeenCalledTimes(1);
    });
  });

  describe("GameStatus", () => {
    it("displays 'Your Turn' when it is player's turn", () => {
      render(
        <GameStatus
          winner={null}
          isAiThinking={false}
          currentPlayer="X"
          playerSymbol="X"
        />
      );
      expect(screen.getByTestId("game-status-player-turn").textContent).toContain("Your Turn");
    });

    it("displays 'AI is thinking...' when AI is thinking", () => {
      render(
        <GameStatus
          winner={null}
          isAiThinking={true}
          currentPlayer="O"
          playerSymbol="X"
        />
      );
      expect(screen.getByTestId("game-status-ai-thinking").textContent).toContain("AI is thinking...");
    });

    it("displays 'You Won! 🎉' when player wins", () => {
      render(
        <GameStatus
          winner="X"
          isAiThinking={false}
          currentPlayer="O"
          playerSymbol="X"
        />
      );
      expect(screen.getByTestId("game-status-player-won").textContent).toContain("You Won! 🎉");
    });

    it("displays 'AI Won! 🤖' when AI wins", () => {
      render(
        <GameStatus
          winner="O"
          isAiThinking={false}
          currentPlayer="X"
          playerSymbol="X"
        />
      );
      expect(screen.getByTestId("game-status-ai-won").textContent).toContain("AI Won! 🤖");
    });

    it("displays 'It's a Draw! 🤝' when game is a draw", () => {
      render(
        <GameStatus
          winner="draw"
          isAiThinking={false}
          currentPlayer="X"
          playerSymbol="X"
        />
      );
      expect(screen.getByTestId("game-status-draw").textContent).toContain("It's a Draw! 🤝");
    });
  });

  describe("GameHeader", () => {
    it("renders header with title and rules button", () => {
      render(<GameHeader />);
      expect(screen.getByText("Tic-Tac-Toe")).toBeDefined();
      expect(screen.getByText("AI Edition")).toBeDefined();
      expect(screen.getByTestId("rules-button")).toBeDefined();
    });

    it("opens and closes rules dialog modal", () => {
      render(<GameHeader />);
      expect(screen.queryByTestId("rules-modal")).toBeNull();

      // Open modal
      fireEvent.click(screen.getByTestId("rules-button"));
      expect(screen.getByTestId("rules-modal")).toBeDefined();
      expect(screen.getByText(/How to Play & AI Modes/i)).toBeDefined();
      expect(screen.getByText(/Unbeatable Minimax algorithm/i)).toBeDefined();

      // Close modal with 'Got It' button
      fireEvent.click(screen.getByTestId("rules-got-it-button"));
      expect(screen.queryByTestId("rules-modal")).toBeNull();
    });

    it("closes modal on Escape key press", () => {
      render(<GameHeader />);
      fireEvent.click(screen.getByTestId("rules-button"));
      expect(screen.getByTestId("rules-modal")).toBeDefined();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByTestId("rules-modal")).toBeNull();
    });
  });
});

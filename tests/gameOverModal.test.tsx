import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameOverModal } from "../components/game/GameOverModal";
import type { Score } from "../lib/game/useTicTacToe";

describe("GameOverModal", () => {
  const defaultScores: Score = { player: 3, ai: 2, draws: 1 };

  const defaultProps = {
    isOpen: true,
    winner: "X" as const,
    playerSymbol: "X" as const,
    scores: defaultScores,
    onPlayAgain: vi.fn(),
    onResetScores: vi.fn(),
    onClose: vi.fn(),
  };

  it("renders null when isOpen is false", () => {
    const { container } = render(
      <GameOverModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders null when winner is null", () => {
    const { container } = render(
      <GameOverModal {...defaultProps} winner={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("has accessible dialog attributes", () => {
    render(<GameOverModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe("game-over-title");
  });

  it("announces Player Win correctly when player matches winner", () => {
    render(
      <GameOverModal
        {...defaultProps}
        winner="X"
        playerSymbol="X"
      />
    );
    expect(screen.getByRole("heading", { name: /you won! 🎉/i })).toBeDefined();
    expect(screen.getByText("Great match! What's next?")).toBeDefined();
  });

  it("announces AI Win correctly when winner is not player and not draw", () => {
    render(
      <GameOverModal
        {...defaultProps}
        winner="O"
        playerSymbol="X"
      />
    );
    expect(screen.getByRole("heading", { name: /ai won 🤖/i })).toBeDefined();
    expect(screen.getByText("Tough match. Ready for a rematch?")).toBeDefined();
  });

  it("announces Draw correctly when winner is draw", () => {
    render(
      <GameOverModal
        {...defaultProps}
        winner="draw"
        playerSymbol="X"
      />
    );
    expect(screen.getByRole("heading", { name: /it's a draw 🤝/i })).toBeDefined();
    expect(screen.getByText("Evenly matched.")).toBeDefined();
  });

  it("displays the score summary row correctly", () => {
    render(
      <GameOverModal
        {...defaultProps}
        scores={{ player: 5, ai: 4, draws: 2 }}
      />
    );
    expect(screen.getByText(/You: 5 · Ties: 2 · AI: 4/)).toBeDefined();
  });

  it("calls onPlayAgain when 'Play Again' button is clicked", () => {
    const onPlayAgain = vi.fn();
    render(<GameOverModal {...defaultProps} onPlayAgain={onPlayAgain} />);
    const playAgainButton = screen.getByRole("button", { name: /play again/i });
    fireEvent.click(playAgainButton);
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("calls onResetScores when 'Reset Scores' button is clicked", () => {
    const onResetScores = vi.fn();
    render(<GameOverModal {...defaultProps} onResetScores={onResetScores} />);
    const resetScoresButton = screen.getByRole("button", { name: /reset scores/i });
    fireEvent.click(resetScoresButton);
    expect(onResetScores).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button (X) is clicked", () => {
    const onClose = vi.fn();
    render(<GameOverModal {...defaultProps} onClose={onClose} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<GameOverModal {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when other keys are pressed", () => {
    const onClose = vi.fn();
    render(<GameOverModal {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

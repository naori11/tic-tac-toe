import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as aiModule from "@/lib/game/ai";
import Page from "../app/page";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("Main Page Assembly (app/page.tsx)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("renders without throwing and displays all primary components without footer tags", () => {
    const { container } = render(<Page />);

    // Verify container and primary sections exist
    expect(container).toBeDefined();
    expect(screen.getByTestId("game-header")).toBeDefined();
    expect(screen.getByTestId("score-board")).toBeDefined();
    expect(screen.getByTestId("game-board")).toBeDefined();
    expect(screen.getByTestId("game-controls")).toBeDefined();

    // Verify Title is present
    expect(screen.getByText("Tic-Tac-Toe")).toBeDefined();

    // Verify footer tags and tech stack pills are NOT present
    expect(container.querySelector("footer")).toBeNull();
    expect(screen.queryByText("React 19")).toBeNull();
    expect(screen.queryByText("Next.js 15")).toBeNull();
    expect(screen.queryByText("Tailwind")).toBeNull();
    expect(screen.queryByText("Vercel")).toBeNull();
  });

  it("allows player to make a move on the board", () => {
    render(<Page />);

    const cell0 = screen.getByTestId("cell-0") as HTMLButtonElement;
    expect(cell0.disabled).toBe(false);
    expect(cell0.getAttribute("aria-label")).toBe("Cell 1, empty");

    // Player clicks cell 0
    fireEvent.click(cell0);
    expect(cell0.getAttribute("aria-label")).toBe("Cell 1: X");
    expect(cell0.disabled).toBe(true);
  });

  it("allows switching difficulty tabs", () => {
    render(<Page />);

    // Click 'Impossible' tab
    const impossibleTab = screen.getByRole("tab", { name: /select impossible difficulty/i });
    fireEvent.click(impossibleTab);
    expect(impossibleTab.getAttribute("aria-selected")).toBe("true");

    // Click 'Easy' tab
    const easyTab = screen.getByRole("tab", { name: /select easy difficulty/i });
    fireEvent.click(easyTab);
    expect(easyTab.getAttribute("aria-selected")).toBe("true");
  });

  it("allows restarting match mid-game using restart match button", () => {
    render(<Page />);

    const cell4 = screen.getByTestId("cell-4") as HTMLButtonElement;
    fireEvent.click(cell4);
    expect(cell4.getAttribute("aria-label")).toBe("Cell 5: X");

    // Advance past AI thinking delay
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Click 'Restart Match' icon button
    const restartButton = screen.getByTestId("restart-match-button");
    fireEvent.click(restartButton);

    expect(cell4.getAttribute("aria-label")).toBe("Cell 5, empty");
    expect(cell4.disabled).toBe(false);
  });

  it("displays GameOverModal ~400ms after match completion and handles Play Again", () => {
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    aiSpy.mockReturnValueOnce(3).mockReturnValueOnce(4);

    render(<Page />);

    // Move 1: Player clicks cell 0 (X), AI plays cell 3 (O)
    fireEvent.click(screen.getByTestId("cell-0"));
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Move 2: Player clicks cell 1 (X), AI plays cell 4 (O)
    fireEvent.click(screen.getByTestId("cell-1"));
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Move 3: Player clicks cell 2 (X) -> Player wins on [0, 1, 2]
    fireEvent.click(screen.getByTestId("cell-2"));

    // Modal should NOT be visible immediately
    expect(screen.queryByRole("dialog")).toBeNull();

    // Advance 400ms delay for modal display
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // GameOverModal is now displayed
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByRole("heading", { name: /you won! 🎉/i })).toBeDefined();
    expect(screen.getByTestId("score-summary").textContent).toContain("You: 1 · Ties: 0 · AI: 0");

    // Click 'Play Again'
    const playAgainButton = screen.getByRole("button", { name: /play again/i });
    fireEvent.click(playAgainButton);

    // Modal is dismissed
    expect(screen.queryByRole("dialog")).toBeNull();

    // Board is cleared and ready for new match
    const cell0 = screen.getByTestId("cell-0") as HTMLButtonElement;
    expect(cell0.disabled).toBe(false);
    expect(cell0.getAttribute("aria-label")).toBe("Cell 1, empty");
  });

  it("displays GameOverModal on match completion and handles Reset Scores", () => {
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    aiSpy.mockReturnValueOnce(3).mockReturnValueOnce(4);

    render(<Page />);

    // Play to a player win
    fireEvent.click(screen.getByTestId("cell-0"));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    fireEvent.click(screen.getByTestId("cell-1"));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    fireEvent.click(screen.getByTestId("cell-2"));

    // Advance 400ms to open modal
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByTestId("player-score-count").textContent).toBe("1");

    // Click 'Reset Scores' in modal
    const resetScoresButton = screen.getByRole("button", { name: /reset scores/i });
    fireEvent.click(resetScoresButton);

    // Modal is dismissed and scores are reset
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("player-score-count").textContent).toBe("0");
    expect(screen.getByTestId("draws-score-count").textContent).toBe("0");
    expect(screen.getByTestId("ai-score-count").textContent).toBe("0");

    // Board is also reset
    expect((screen.getByTestId("cell-0") as HTMLButtonElement).disabled).toBe(false);
  });

  it("allows closing GameOverModal via close button without resetting board", () => {
    const aiSpy = vi.spyOn(aiModule, "getAiMove");
    aiSpy.mockReturnValueOnce(3).mockReturnValueOnce(4);

    render(<Page />);

    // Play to a player win
    fireEvent.click(screen.getByTestId("cell-0"));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    fireEvent.click(screen.getByTestId("cell-1"));
    act(() => {
      vi.advanceTimersByTime(350);
    });
    fireEvent.click(screen.getByTestId("cell-2"));

    // Advance 400ms to open modal
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole("dialog")).toBeDefined();

    // Close modal via close button
    const closeButton = screen.getByRole("button", { name: /close dialog/i });
    fireEvent.click(closeButton);

    // Modal is dismissed
    expect(screen.queryByRole("dialog")).toBeNull();

    // Winning cell remains marked
    const cell0 = screen.getByTestId("cell-0") as HTMLButtonElement;
    expect(cell0.getAttribute("aria-label")).toBe("Cell 1: X");
  });
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

import Page from "../app/page";

describe("Main Page Assembly (app/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without throwing and displays all primary components", () => {
    const { container } = render(<Page />);

    // Verify container and primary sections exist
    expect(container).toBeDefined();
    expect(screen.getByTestId("game-header")).toBeDefined();
    expect(screen.getByTestId("score-board")).toBeDefined();
    expect(screen.getByTestId("game-board")).toBeDefined();
    expect(screen.getByTestId("game-controls")).toBeDefined();

    // Verify Title and Pills
    expect(screen.getByText("Tic-Tac-Toe")).toBeDefined();
    expect(screen.getByText("AI Edition")).toBeDefined();
    expect(screen.getByText("React 19")).toBeDefined();
    expect(screen.getByText("Next.js 15")).toBeDefined();
    expect(screen.getByText("Tailwind")).toBeDefined();
    expect(screen.getByText("Vercel")).toBeDefined();
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

  it("allows switching difficulty and resetting scores", () => {
    render(<Page />);

    // Click 'Impossible' tab
    const impossibleTab = screen.getByRole("tab", { name: /select impossible difficulty/i });
    fireEvent.click(impossibleTab);
    expect(impossibleTab.getAttribute("aria-selected")).toBe("true");

    // Click 'Reset' button
    const resetButton = screen.getByRole("button", { name: /reset all scores/i });
    fireEvent.click(resetButton);
    expect(screen.getByTestId("player-score-count").textContent).toBe("0");
    expect(screen.getByTestId("draws-score-count").textContent).toBe("0");
    expect(screen.getByTestId("ai-score-count").textContent).toBe("0");
  });

  it("allows starting a new game", () => {
    render(<Page />);

    const cell4 = screen.getByTestId("cell-4") as HTMLButtonElement;
    fireEvent.click(cell4);
    expect(cell4.getAttribute("aria-label")).toBe("Cell 5: X");

    // Click 'New' button
    const newGameButton = screen.getByRole("button", { name: /start new game/i });
    fireEvent.click(newGameButton);

    expect(cell4.getAttribute("aria-label")).toBe("Cell 5, empty");
    expect(cell4.disabled).toBe(false);
  });
});

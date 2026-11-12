# Implementation Plan: Next.js 15 & React 19 Tic-Tac-Toe Game

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sleek, responsive Tic-Tac-Toe web application using Next.js (App Router), React 19, Tailwind CSS, and shadcn/ui, featuring selectable AI difficulty (Easy, Medium, Impossible Minimax), custom player mark selection (X or O), session scoreboard tracking, and polished micro-animations for Vercel deployment.

**Architecture:** Pure client-side game engine and algorithmic AI models (`lib/game/engine.ts`, `lib/game/ai.ts`) decoupled from presentation, surfaced through a custom React 19 hook (`lib/game/useTicTacToe.ts`) and rendered with modular, accessible UI components.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide React, next-themes, canvas-confetti, Vitest.

---

## Global Constraints
- Target Framework: Next.js App Router (React 19)
- Styling: Tailwind CSS with CSS variables for light & dark themes
- UI Primitives: Accessible shadcn/ui component patterns
- Deployment Target: Vercel (static output / zero SSR hydration errors)
- Testing: Vitest for pure game logic & AI minimax testing
- Strictly pass-through types and zero `any` types

---

## User Review Required
> [!IMPORTANT]
> The game logic is completely client-side to ensure zero-latency play, 100% offline support, and zero serverless costs on Vercel. AI calculations for 3x3 Minimax take <1ms, with an artificial ~350ms delay added purely for realistic player pacing.

---

## Proposed Changes

### Task 1: Project Scaffolding & Dependencies Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `lib/utils.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: Base configuration, `cn()` utility in `lib/utils.ts`, dev and test scripts.

- [ ] **Step 1: Create `package.json` with Next.js 15, React 19, Tailwind, Lucide, Vitest**
- [ ] **Step 2: Create `tsconfig.json` with `@/*` path mapping**
- [ ] **Step 3: Create Tailwind and PostCSS configurations (`tailwind.config.ts`, `postcss.config.mjs`)**
- [ ] **Step 4: Create `app/globals.css` with CSS variables for light and dark modes**
- [ ] **Step 5: Create `lib/utils.ts` with `clsx` and `tailwind-merge`**
- [ ] **Step 6: Create `vitest.config.ts` configured for TypeScript and React tests**
- [ ] **Step 7: Install dependencies using `npm install`**
- [ ] **Step 8: Commit configuration**
  ```bash
  git add package.json tsconfig.json postcss.config.mjs tailwind.config.ts app/globals.css lib/utils.ts vitest.config.ts package-lock.json
  git commit -m "chore: scaffold Next.js 15, React 19, Tailwind, and Vitest setup"
  ```

---

### Task 2: Core Game Engine & Types (TDD)

**Files:**
- Create: `lib/game/types.ts`
- Create: `lib/game/engine.ts`
- Test: `tests/engine.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type Player = 'X' | 'O';
  export type CellState = Player | null;
  export type Board = CellState[]; // length 9
  export type WinningLine = [number, number, number];
  export interface WinResult {
    winner: Player;
    line: WinningLine;
  }
  export function createInitialBoard(): Board;
  export function checkWinner(board: Board): WinResult | null;
  export function isBoardFull(board: Board): boolean;
  export function isValidMove(board: Board, index: number): boolean;
  ```

- [ ] **Step 1: Write failing engine tests in `tests/engine.test.ts`**
  - Test all 8 winning lines (3 horizontal, 3 vertical, 2 diagonal)
  - Test draw state detection
  - Test move validity check
- [ ] **Step 2: Run tests to verify they fail**
  `npm test tests/engine.test.ts` -> FAIL
- [ ] **Step 3: Implement `lib/game/types.ts` and `lib/game/engine.ts`**
- [ ] **Step 4: Run tests to verify they pass**
  `npm test tests/engine.test.ts` -> PASS
- [ ] **Step 5: Commit**
  ```bash
  git add lib/game/types.ts lib/game/engine.ts tests/engine.test.ts
  git commit -m "feat(game): add core engine rules and winning line verification"
  ```

---

### Task 3: AI Engine Implementation (TDD)

**Files:**
- Create: `lib/game/ai.ts`
- Test: `tests/ai.test.ts`

**Interfaces:**
- Consumes: `Board`, `Player`, `checkWinner`, `isBoardFull` from `lib/game/engine.ts`
- Produces:
  ```typescript
  export type Difficulty = 'easy' | 'medium' | 'impossible';
  export function getAvailableMoves(board: Board): number[];
  export function getEasyMove(board: Board): number;
  export function getMediumMove(board: Board, aiSymbol: Player, playerSymbol: Player): number;
  export function getMinimaxMove(board: Board, aiSymbol: Player, playerSymbol: Player): number;
  export function getAiMove(board: Board, difficulty: Difficulty, aiSymbol: Player): number;
  ```

- [ ] **Step 1: Write failing AI tests in `tests/ai.test.ts`**
  - Verify Easy AI picks an open cell
  - Verify Medium AI takes immediate winning move and blocks opponent threat
  - Verify Minimax AI never loses across simulated matches
- [ ] **Step 2: Run tests to verify they fail**
  `npm test tests/ai.test.ts` -> FAIL
- [ ] **Step 3: Implement `lib/game/ai.ts` with Minimax recursion and depth scoring**
- [ ] **Step 4: Run tests to verify they pass**
  `npm test tests/ai.test.ts` -> PASS
- [ ] **Step 5: Commit**
  ```bash
  git add lib/game/ai.ts tests/ai.test.ts
  git commit -m "feat(ai): implement Easy, Medium, and Impossible Minimax algorithms"
  ```

---

### Task 4: Custom Game Hook & State Machine (`useTicTacToe`)

**Files:**
- Create: `lib/game/useTicTacToe.ts`
- Test: `tests/useTicTacToe.test.ts`

**Interfaces:**
- Consumes: `lib/game/engine.ts`, `lib/game/ai.ts`
- Produces:
  ```typescript
  export interface Score {
    player: number;
    ai: number;
    draws: number;
  }
  export function useTicTacToe(): {
    board: Board;
    currentPlayer: Player;
    playerSymbol: Player;
    aiSymbol: Player;
    difficulty: Difficulty;
    winner: Player | 'draw' | null;
    winningLine: WinningLine | null;
    isAiThinking: boolean;
    scores: Score;
    isMounted: boolean;
    makeMove: (index: number) => void;
    resetGame: () => void;
    resetScores: () => void;
    setDifficulty: (d: Difficulty) => void;
    setPlayerSymbol: (symbol: Player) => void;
  };
  ```

- [ ] **Step 1: Implement `lib/game/useTicTacToe.ts`**
  - Handles turn alternation and AI delayed trigger (~350ms)
  - Manages `localStorage` score persistence safely with `isMounted` guard
  - Handles symbol flipping (when player selects 'O', AI moves first as 'X')
- [ ] **Step 2: Add hook tests verifying move progression and game restart**
- [ ] **Step 3: Run tests to verify they pass**
- [ ] **Step 4: Commit**
  ```bash
  git add lib/game/useTicTacToe.ts tests/useTicTacToe.test.ts
  git commit -m "feat(game): add useTicTacToe custom hook with AI pacing and persistence"
  ```

---

### Task 5: UI Components & shadcn/ui Primitives

**Files:**
- Create: `components/theme-provider.tsx` & `components/theme-toggle.tsx`
- Create: `components/game/Cell.tsx`
- Create: `components/game/GameBoard.tsx`
- Create: `components/game/ScoreBoard.tsx`
- Create: `components/game/GameControls.tsx`
- Create: `components/game/GameStatus.tsx`
- Create: `components/game/GameHeader.tsx`

**Interfaces:**
- Visual design: Modern Clean & Tactile
  - X: Emerald/Cyan glow
  - O: Rose/Violet glow
  - Tactile cells with smooth hover and ghost mark preview
  - Confetti burst on player victory using `canvas-confetti`

- [ ] **Step 1: Implement Theme Provider & Theme Toggle (Dark/Light)**
- [ ] **Step 2: Implement tactile `Cell.tsx` with hover preview and winning glow**
- [ ] **Step 3: Implement 3x3 `GameBoard.tsx`**
- [ ] **Step 4: Implement `ScoreBoard.tsx` with Player Wins, Draws, and AI Wins**
- [ ] **Step 5: Implement `GameControls.tsx` with Difficulty Tabs and Symbol Selector**
- [ ] **Step 6: Implement `GameStatus.tsx` with animated AI thinking spinner**
- [ ] **Step 7: Implement `GameHeader.tsx` with title and info dialog**
- [ ] **Step 8: Commit UI components**
  ```bash
  git add components/
  git commit -m "feat(ui): add game board, cells, scoreboard, and control components"
  ```

---

### Task 6: Main App Layout & Assembly

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: Create `app/layout.tsx` with metadata, viewport, Inter font, and ThemeProvider**
- [ ] **Step 2: Assemble game view in `app/page.tsx` with clean responsive container**
- [ ] **Step 3: Commit assembly**
  ```bash
  git add app/layout.tsx app/page.tsx
  git commit -m "feat(page): assemble complete Tic-Tac-Toe game page"
  ```

---

### Task 7: Build, Quality Gates & Verification

- [ ] **Step 1: Run all Vitest unit tests**
  `npx vitest run`
- [ ] **Step 2: Run TypeScript compile check**
  `npx tsc --noEmit`
- [ ] **Step 3: Run production build**
  `npm run build`
- [ ] **Step 4: Manual verification**
  - Start preview server: `npm run start` (or `npm run dev`)
  - Verify Player as X (first move) and O (AI first move)
  - Verify Easy, Medium, Impossible gameplay
  - Verify score persistence across page refresh
  - Verify Dark and Light mode themes
  - Verify mobile touch targets
- [ ] **Step 5: Final commit & Walkthrough documentation**

---

## Verification Plan

### Automated Tests
- `npx vitest run`: All engine and AI tests pass with 100% coverage on core rules and minimax invariant.
- `npx tsc --noEmit`: Typecheck passes with zero errors.
- `npm run build`: Next.js production build succeeds, creating optimized static output for Vercel.

### Manual Verification
1. **Gameplay Flow:**
   - Play a full game as X against Easy AI -> verify win/loss/draw detection and scoreboard update.
   - Switch to Impossible AI -> verify AI plays defensively or offensively without blunders (never loses).
   - Switch player symbol to O -> verify AI automatically makes the opening move as X.
2. **UI & Theme:**
   - Toggle theme between Dark and Light -> ensure proper contrast for X (emerald) and O (rose).
   - Hover over empty cells -> verify faint preview of player's symbol.
   - Check winning animation -> verify winning 3 cells glow with confetti burst on player victory.
3. **Persistence:**
   - Refresh the page -> verify scores remain intact from `localStorage`.
   - Click "Reset Scores" -> verify scores reset cleanly to 0-0-0.

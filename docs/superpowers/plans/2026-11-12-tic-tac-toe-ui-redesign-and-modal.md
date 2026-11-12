# Implementation Plan: Tic-Tac-Toe UI Redesign & Post-Game Modal

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Tic-Tac-Toe web application by eliminating generic/vibecoded visual styling (neon glows, drop-shadow halos, "AI Edition" sparkle badge, and footer tech-stack pills), and streamline gameplay actions into an accessible post-game modal that announces the winner with "Play Again" and "Reset Scores" buttons.

**Architecture:** Add a dedicated, accessible `GameOverModal` dialog triggered when a match concludes, strip artificial neon styling from cells and board into a quiet tactile design, streamline `GameControls` to focus on difficulty and symbol selection, and remove the footer from `app/page.tsx`.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS, Lucide React, Vitest.

---

## Global Constraints
- Framework: Next.js 15 App Router & React 19
- Styling: Tailwind CSS with clean, quiet, accessible design (no neon drop-shadows or artificial AI glows)
- Quality Gates: 100% passing Vitest suite, zero TypeScript errors (`tsc --noEmit`), zero ESLint warnings (`npm run lint`), successful static build (`npm run build`)

---

## Proposed Changes

### Task 1: Create `GameOverModal` Component & Unit Tests (TDD)

**Files:**
- Create: `components/game/GameOverModal.tsx`
- Test: `tests/gameOverModal.test.tsx`

**Interfaces:**
- Produces:
  ```typescript
  export interface GameOverModalProps {
    isOpen: boolean;
    winner: Player | 'draw' | null;
    playerSymbol: Player;
    scores: Score;
    onPlayAgain: () => void;
    onResetScores: () => void;
    onClose: () => void;
  }
  export function GameOverModal(props: GameOverModalProps): React.JSX.Element | null;
  ```

- [ ] **Step 1: Write failing modal tests in `tests/gameOverModal.test.tsx`**
  - Verify announcement for Player Win ("You Won! 🎉"), AI Win ("AI Won"), and Draw ("It's a Draw")
  - Verify scores display
  - Verify "Play Again" button triggers `onPlayAgain`
  - Verify "Reset Scores" button triggers `onResetScores`
  - Verify Escape key calls `onClose`
- [ ] **Step 2: Run tests to verify they fail**
  `npm test tests/gameOverModal.test.tsx` -> FAIL
- [ ] **Step 3: Implement `components/game/GameOverModal.tsx` with dialog backdrop, typography, and buttons**
- [ ] **Step 4: Run tests to verify they pass**
  `npm test tests/gameOverModal.test.tsx` -> PASS
- [ ] **Step 5: Commit**
  ```bash
  git add components/game/GameOverModal.tsx tests/gameOverModal.test.tsx
  git commit -m "feat(ui): add GameOverModal dialog with winner announcement and action buttons"
  ```

---

### Task 2: Visual De-Slopping of Components (Header, Cell, GameBoard, GameControls)

**Files:**
- Modify: `components/game/GameHeader.tsx`
- Modify: `components/game/Cell.tsx`
- Modify: `components/game/GameBoard.tsx`
- Modify: `components/game/GameControls.tsx`
- Test: `tests/components.test.tsx`

**Details:**
- `GameHeader.tsx`: Remove `"AI Edition"` badge and sparkles, remove subtitle `"Modern, tactical & unbeatable AI"`. Clean title `<h1>Tic-Tac-Toe</h1>`.
- `Cell.tsx` & `GameBoard.tsx`: Remove all neon drop shadows (`drop-shadow-[0_0_12px_...]`) and heavy bloom animations. Clean colors (`text-emerald-600 dark:text-emerald-400` for X, `text-rose-600 dark:text-rose-400` for O) and subtle tinted borders for winning lines.
- `GameControls.tsx`: Remove the permanent bottom action buttons row (`New` and `Reset`). Keep Difficulty tabs and Symbol selector. Add a quiet restart icon button (`RotateCcw`) in the controls header for optional mid-match restarts.
- Update `tests/components.test.tsx` for new header and control props.

- [ ] **Step 1: Update component tests in `tests/components.test.tsx`**
- [ ] **Step 2: Refactor `GameHeader.tsx` to remove badge and subtitle**
- [ ] **Step 3: Refactor `Cell.tsx` and `GameBoard.tsx` to eliminate neon glow and drop shadows**
- [ ] **Step 4: Refactor `GameControls.tsx` to remove static New/Reset buttons row and add subtle restart icon**
- [ ] **Step 5: Run tests to verify they pass**
  `npm test tests/components.test.tsx` -> PASS
- [ ] **Step 6: Commit**
  ```bash
  git add components/game/ tests/components.test.tsx
  git commit -m "refactor(ui): de-slop visual styling and streamline game controls"
  ```

---

### Task 3: Assemble Page & Remove Footer Tags

**Files:**
- Modify: `app/page.tsx`
- Test: `tests/page.test.tsx`

**Details:**
- In `app/page.tsx`:
  - Delete `<footer>` and tech stack tags (`React 19`, `Next.js 15`, `Tailwind`, `Vercel`).
  - Add `isGameOverModalOpen` state, automatically opening ~400ms after `winner !== null`.
  - Wire up `GameOverModal` with `onPlayAgain` (calls `resetGame`, closes modal) and `onResetScores` (calls `resetScores`, `resetGame`, closes modal).
  - Pass `onNewGame={resetGame}` to `GameControls` for mid-match restart.
- In `tests/page.test.tsx`:
  - Update integration tests to verify `GameOverModal` displays on match completion and responds to Play Again and Reset Scores.

- [ ] **Step 1: Update integration tests in `tests/page.test.tsx`**
- [ ] **Step 2: Update `app/page.tsx` (remove footer, integrate `GameOverModal`)**
- [ ] **Step 3: Run tests to verify they pass**
  `npm test tests/page.test.tsx` -> PASS
- [ ] **Step 4: Commit**
  ```bash
  git add app/page.tsx tests/page.test.tsx
  git commit -m "feat(page): remove footer tags and integrate GameOverModal flow"
  ```

---

### Task 4: Final Quality Verification & Documentation Update

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Run complete test suite**
  `npm test`
- [ ] **Step 2: Run TypeScript compile check**
  `npx tsc --noEmit`
- [ ] **Step 3: Run ESLint check**
  `npm run lint`
- [ ] **Step 4: Run production build**
  `npm run build`
- [ ] **Step 5: Update `README.md` to reflect streamlined UI and post-game modal**
- [ ] **Step 6: Commit**
  ```bash
  git add README.md
  git commit -m "docs: update README with post-game modal and refined UI"
  ```

---

## Verification Plan

### Automated Tests
- `npm test`: All unit and integration test suites pass (0 failures).
- `npx tsc --noEmit`: 0 TypeScript errors.
- `npm run lint`: 0 ESLint errors/warnings.
- `npm run build`: Next.js 15 static production build succeeds.

### Manual Verification
1. Header displays only clean "Tic-Tac-Toe", Rules button, and Theme Toggle (no "AI Edition" badge or subtitle).
2. Bottom of the page is clean (no tech stack pills).
3. Playing moves has no garish neon glows or excessive shadows; marks look crisp and refined.
4. When a game completes (Player win, AI win, or Draw), the `GameOverModal` pops up announcing the winner.
5. Clicking "Play Again" in the modal clears the board and closes the modal while preserving scores.
6. Clicking "Reset Scores" in the modal resets the scores to 0-0-0, resets the board, and closes the modal.
7. Mid-match restart icon in the controls resets an ongoing match cleanly.

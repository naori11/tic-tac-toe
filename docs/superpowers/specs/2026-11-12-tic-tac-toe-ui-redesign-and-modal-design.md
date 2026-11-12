# Design Document: Tic-Tac-Toe UI Redesign & Post-Game Modal

## 1. Overview
This design updates the Next.js 15 & React 19 Tic-Tac-Toe application to remove unnecessary visual elements, tone down "vibecoded" aesthetic choices (neon glows, intense drop shadows, excessive sparkle badges), and streamline gameplay actions into an automated post-game modal dialog that announces the winner and provides "Play Again" and "Reset Scores" actions.

---

## 2. Requirements & Motivations
1. **Remove Footer Framework Tags**: The tech-stack pills (`React 19`, `Next.js 15`, `Tailwind`, `Vercel`) are unnecessary for the product experience and clutter the layout.
2. **De-slogan Header**: Remove `"AI Edition"` badge with sparkles and subtitle `"Modern, tactical & unbeatable AI"`. Header becomes a clean, confident title: `Tic-Tac-Toe`.
3. **De-slop Visual Language (Quiet Design)**:
   - Eliminate heavy drop shadows (`drop-shadow-[0_0_12px_...]`) and neon halo blooms.
   - Replace with crisp, intentional stroke weights, refined neutral borders, and subtle tinted fills on winning cells.
   - Remove bulky permanent action buttons from the active game screen.
4. **Post-Game Modal for Match Completion**:
   - Instead of static `New Game` & `Reset` buttons cluttering the bottom, an accessible modal dialog opens ~400ms after a game concludes.
   - Announces the outcome (`You Won!`, `AI Won`, `It's a Draw`).
   - Displays running score tally.
   - Places `Play Again` (primary) and `Reset Scores` (secondary) directly underneath.
   - Allows mid-game restarts via a discreet restart icon button in the controls.

---

## 3. Architecture & Component Changes

```
components/game/
├── GameOverModal.tsx       # [NEW] Post-game outcome dialog with winner & actions
├── GameHeader.tsx          # [MODIFY] Remove "AI Edition" badge & subtitle; clean typography
├── Cell.tsx                # [MODIFY] Remove neon glow/drop-shadows; clean crisp colors
├── GameBoard.tsx           # [MODIFY] Remove neon halo effects on winning states
├── GameControls.tsx        # [MODIFY] Remove static New/Reset buttons row; add subtle restart icon
└── GameStatus.tsx          # [MODIFY] Streamline status display; support post-game inline fallback

app/
└── page.tsx                # [MODIFY] Remove footer pills; integrate GameOverModal
```

---

## 4. Component Specifications

### 4.1 `GameOverModal.tsx`
- **Props**:
  - `isOpen: boolean`
  - `winner: Player | 'draw' | null`
  - `playerSymbol: Player`
  - `scores: Score`
  - `onPlayAgain: () => void`
  - `onResetScores: () => void`
  - `onClose: () => void`
- **States & Visuals**:
  - `winner === playerSymbol`: Trophy/sparkle-free icon, `"You Won! 🎉"`, positive congratulatory subtext.
  - `winner !== 'draw'` (AI won): `"AI Won"`, rematch subtext.
  - `winner === 'draw'`: `"It's a Draw"`, tied match subtext.
  - Score summary card: `You: X · Ties: Y · AI: Z`.
  - Actions:
    - Primary Button: `"Play Again"`
    - Secondary Button: `"Reset Scores"`
- **Accessibility**:
  - Focus trap, `aria-modal="true"`, `role="dialog"`, ESC key listener to close and inspect board.

### 4.2 `GameHeader.tsx`
- Remove badge and subtitle.
- Render clean title `<h1>Tic-Tac-Toe</h1>` with existing Help (Rules) button and ThemeToggle.

### 4.3 `Cell.tsx` & `GameBoard.tsx`
- Remove `drop-shadow-[0_0_12px_...]` and `shadow-[0_0_24px_...]`.
- Use clean `text-emerald-600 dark:text-emerald-400` for X, `text-rose-600 dark:text-rose-400` for O.
- Winning cells receive `bg-emerald-500/10 border-emerald-500/40` or `bg-rose-500/10 border-rose-500/40`.

### 4.4 `GameControls.tsx`
- Remove the `"Actions"` grid (containing `New` and `Reset`).
- Keep Difficulty tabs and Symbol selector.
- Include a subtle icon button (`RotateCcw`) in the controls for starting over mid-match.

### 4.5 `app/page.tsx`
- Delete `<footer>` and tech stack tags entirely.
- Add `isGameOverModalOpen` state that opens when `winner !== null`.

---

## 5. Testing & Quality Gates
- **Automated Tests**:
  - Unit tests for `GameOverModal`: opens on winner, announces correct winner, fires `onPlayAgain` and `onResetScores`, closes on ESC.
  - Unit tests for streamlined `GameControls` and `GameHeader`.
  - Full suite `npm test` passes cleanly.
- **TypeScript & Lint**:
  - `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- **Production Build**:
  - `npm run build` succeeds with static prerendering.

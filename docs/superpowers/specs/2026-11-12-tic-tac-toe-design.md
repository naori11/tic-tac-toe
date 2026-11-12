# Design Document: Next.js 15 & React 19 Tic-Tac-Toe Game

## 1. Overview
A modern, tactile, and responsive Tic-Tac-Toe web application built with **React 19**, **Next.js (App Router)**, **Tailwind CSS**, and **shadcn/ui**. The game is single-player (Player vs AI) with selectable difficulty (Easy, Medium, Impossible Minimax), customizable player marks (X or O), session scoreboard tracking, and polished micro-interactions designed for seamless deployment to Vercel.

---

## 2. Technical Stack
- **Framework:** Next.js (App Router)
- **UI Runtime:** React 19
- **Styling:** Tailwind CSS with CSS variables for dynamic theming
- **Component Primitives:** shadcn/ui (Card, Button, Badge, Tabs, Dialog)
- **Icons:** Lucide React (`lucide-react`)
- **Theming:** `next-themes` (Dark/Light mode support)
- **Testing:** Vitest with TypeScript support
- **Hosting/Deployment:** Vercel

---

## 3. Architecture & Project Layout

```
C:\Projects\tictactoe\
├── app/
│   ├── layout.tsx             # Root layout with ThemeProvider, fonts, metadata
│   ├── page.tsx               # Main page orchestrating the Tic-Tac-Toe game
│   └── globals.css            # Tailwind theme tokens & custom animations
├── components/
│   ├── ui/                    # shadcn/ui primitives (Button, Card, Badge, Tabs, etc.)
│   ├── game/
│   │   ├── GameHeader.tsx     # Title, theme switcher, info dialog
│   │   ├── GameControls.tsx   # Difficulty selector, Player side picker (X/O), New Game
│   │   ├── ScoreBoard.tsx     # Player wins, Draws, AI wins cards
│   │   ├── GameStatus.tsx     # Status badge ("Your Turn", "AI Thinking...", results)
│   │   ├── GameBoard.tsx      # 3x3 interactive grid
│   │   └── Cell.tsx           # Individual tactile cell with hover preview & glow
│   └── theme-toggle.tsx       # Dark/light mode switcher
├── lib/
│   ├── game/
│   │   ├── types.ts           # Types: Player, Board, GameStatus, Difficulty, Score
│   │   ├── engine.ts          # Core game rules, winning line calculation, board helpers
│   │   ├── ai.ts              # Easy (random), Medium (heuristic/block), Impossible (Minimax)
│   │   └── useTicTacToe.ts    # React hook managing game state & localStorage persistence
│   └── utils.ts               # shadcn cn() helper
└── tests/
    ├── engine.test.ts         # Unit tests for winning lines, draws, and valid moves
    └── ai.test.ts             # Unit tests for Minimax optimality and AI behaviors
```

---

## 4. Game Engine & AI Algorithms

### 4.1 Data Models (`lib/game/types.ts`)
- `Player`: `'X' | 'O'`
- `CellState`: `Player | null`
- `Board`: `CellState[]` (fixed length 9: indices 0 through 8)
- `Difficulty`: `'easy' | 'medium' | 'impossible'`
- `GameResult`: `'X' | 'O' | 'draw' | null`
- `Score`: `{ player: number, ai: number, draws: number }`

### 4.2 Winning Combinations
Indices for all 8 winning lines:
- Horizontal: `[0, 1, 2]`, `[3, 4, 5]`, `[6, 7, 8]`
- Vertical: `[0, 3, 6]`, `[1, 4, 7]`, `[2, 5, 8]`
- Diagonal: `[0, 4, 8]`, `[2, 4, 6]`

### 4.3 AI Strategy Implementations (`lib/game/ai.ts`)
1. **Easy AI (Casual)**:
   - Selects randomly from available empty cells.
2. **Medium AI (Heuristic)**:
   - Step 1: Checks if AI has an immediate winning move. If yes, plays it.
   - Step 2: Checks if Player has an immediate winning move. If yes, blocks it.
   - Step 3: Prefers center cell (index 4) if open.
   - Step 4: Otherwise, picks randomly among open cells.
3. **Impossible AI (Minimax Algorithm)**:
   - Evaluates terminal states with depth penalization:
     - AI win: `+10 - depth`
     - Player win: `-10 + depth`
     - Draw: `0`
   - Recursively maximizes AI utility and minimizes Player utility.
   - Mathematically unbeatable in standard 3x3 Tic-Tac-Toe.

---

## 5. UI/UX Design Specifications

### 5.1 Color Tokens & Accents
- **Player X**: Emerald/Cyan palette (`text-emerald-500`, dark: `text-emerald-400`, glow ring).
- **Player O**: Rose/Violet palette (`text-rose-500`, dark: `text-rose-400`, glow ring).
- **Empty Cell Hover Preview**: Semi-transparent ghost preview of the active player's symbol on hover.
- **Winning Line Highlight**: Glowing border and subtle pulsing background on the 3 winning cells.
- **Tactile Feedback**: Cells feature micro-scaling (`active:scale-95`) and smooth color transitions.

### 5.2 Layout & Responsiveness
- Centered layout with max container width of `max-w-md` (448px), perfectly adapted for desktop and mobile screens.
- Generous cell dimensions (`min-h-[88px]` to `min-h-[104px]`) meeting touch target accessibility standards.

---

## 6. Robustness & Deployment

### 6.1 SSR & Hydration Safety
- `localStorage` reading for scores is deferred until after the initial client mount using a `mounted` boolean flag.
- Avoids server/client HTML divergence in Next.js SSR.

### 6.2 Input Guarding
- Grid interaction is locked whenever:
  - An AI move is pending (`isAiThinking === true`).
  - The cell is already occupied.
  - The game has reached a terminal state (Win/Draw).

### 6.3 Vercel Deployment
- Next.js build runs `next build` generating clean static pages.
- Zero external runtime server dependencies.

---

## 7. Testing & Verification Plan

### 7.1 Automated Unit Tests (Vitest)
- `tests/engine.test.ts`:
  - Verify all 8 winning triplets detect winner and indices correctly.
  - Verify draw detection when 9 cells are filled without a triplet.
  - Verify move validation prevents playing on occupied cells.
- `tests/ai.test.ts`:
  - Easy AI always makes a valid legal move.
  - Medium AI seizes winning move and blocks opponent threat.
  - Minimax AI never loses in simulations.

### 7.2 Manual Verification
- Test playing as X (player starts) and O (AI starts).
- Switch between Easy, Medium, and Impossible modes.
- Verify score tracking persists after page reload.
- Verify reset score dialog/action.
- Test responsive viewports on desktop and simulated mobile.
- Test dark mode and light mode contrast.

# 🎮 Tic-Tac-Toe Next.js

A modern, responsive, and unbeatable Tic-Tac-Toe web application built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**. Features a zero-blunder Minimax AI engine, customizable marks, light/dark themes, tactile animations, score persistence, and celebratory confetti.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?style=flat&logo=vitest)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

---

## ✨ Features

- **🧠 Three Distinct AI Difficulty Levels:**
  - **Easy:** Completely randomized choices for casual play.
  - **Medium:** Tactical heuristic AI that deterministically takes immediate winning moves, blocks opponent threats, prioritizes the center square, and chooses randomly among remaining cells.
  - **Impossible (Unbeatable):** Recursive Minimax search algorithm with depth penalization. Mathematically impossible to defeat; the best possible outcome is a draw.
- **❌ / ⭕ Player Mark Selection:**
  - Play as **X** (moves first) or **O** (AI initiates the opening move as X).
  - Clean real-time board reset and state transition when switching marks mid-game.
- **🎨 Dark & Light Theme Modes:**
  - Integrated with `next-themes` and a flash-free script tag.
  - Quiet, refined aesthetic with balanced contrast, subtle border hierarchy, and clean typography without distracting neon effects or cluttered badges.
- **🏆 Post-Game Result Modal (`GameOverModal`):**
  - Instant outcome dialog displaying victory, defeat, or draw states when a match concludes.
  - Contextual actions: "Play Again" to immediately deal a new round, and "Reset Scores" to reset all statistics.
  - Accessible modal dialog semantics with backdrop blur and keyboard navigation.
- **💾 Local Storage Scoreboard:**
  - Automatically records Player Wins, AI Wins, and Draws.
  - Persists across browser refreshes and tab closures.
  - Includes a one-click "Reset Scores" action.
- **✨ Tactile UI & Micro-Interactions:**
  - Cell hover ghost preview reflecting current turn.
  - Crisp, restrained animations when markers are placed.
  - Elegant highlight along the winning line.
  - Celebratory confetti burst on player victory powered by `canvas-confetti`.
- **♿ Accessibility & Performance:**
  - Fully navigable using keyboard tabs and Enter/Space controls.
  - ARIA attributes (`aria-label`, `role="grid"`, `aria-live="polite"` status announcer, `role="dialog"` modal).
  - 100% static prerendered output for sub-millisecond edge delivery.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Core Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) & [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Effects:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Unit & Integration Testing:** [Vitest 2.1](https://vitest.dev/) & [@testing-library/react](https://testing-library.com/)
- **Language:** [TypeScript 5.7](https://www.typescriptlang.org/)

---

## 📁 Project Architecture

```
tictactoe/
├── app/
│   ├── globals.css          # Tailwind base, dark mode theme variables & custom utilities
│   ├── layout.tsx           # Root HTML layout with ThemeProvider and metadata
│   └── page.tsx             # Interactive Tic-Tac-Toe main client page
├── components/
│   ├── theme-provider.tsx   # Next-themes wrapper
│   ├── theme-toggle.tsx     # Sun / Moon theme toggle button
│   └── game/
│       ├── Cell.tsx         # Individual button cell with touch targets & ARIA tags
│       ├── GameBoard.tsx    # 3x3 interactive board with preview markers & win highlights
│       ├── GameControls.tsx # Difficulty tabs, mark selector, new game & reset actions
│       ├── GameHeader.tsx   # Clean game title bar with rules modal & ThemeToggle
│       ├── GameOverModal.tsx# Post-game outcome dialog with Play Again & Reset Scores actions
│       ├── GameStatus.tsx   # Turn indicator, winner announcer & AI thinking status
│       └── ScoreBoard.tsx   # Live stats display (Player, Draws, AI) with SSR hydration protection
├── lib/
│   ├── utils.ts             # Tailwind class merging utility (clsx + twMerge)
│   └── game/
│       ├── ai.ts            # Easy, Medium, and Minimax AI engine algorithms
│       ├── engine.ts        # Core rules: checkWinner, isBoardFull, winning line lines
│       ├── types.ts         # TypeScript types (Board, Player, Difficulty, etc.)
│       └── useTicTacToe.ts  # Custom hook managing game state, AI timing & localStorage
└── tests/
    ├── ai.test.ts           # Comprehensive AI heuristics & Minimax invariant tests (26 tests)
    ├── components.test.tsx  # React component rendering & interaction tests (26 tests)
    ├── engine.test.ts       # Board game logic, winning permutations, draws (24 tests)
    ├── gameOverModal.test.tsx # GameOverModal outcome announcement & action tests (12 tests)
    ├── page.test.tsx        # Top-level Page integration tests (7 tests)
    ├── useTicTacToe.test.ts # State machine, AI turn scheduling, score updates (16 tests)
    └── utils.test.ts        # Helper utilities tests (2 tests)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18.18.0** or later installed:

```bash
node -v
```

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd tictactoe
npm install
```

### Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play.

### Running Tests

Execute the automated test suite with Vitest:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Type Checking

Verify TypeScript compilation with zero errors:

```bash
npx tsc --noEmit
```

### Production Build

Create an optimized static production build:

```bash
npm run build
npm run start
```

---

## 🌐 Deployment to Vercel

The application is fully optimized for **Vercel** with zero custom configuration required.

### Option 1: Vercel Dashboard (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Keep all default build settings:
   - **Framework Preset:** `Next.js`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
5. Click **Deploy**. Your app will be live within seconds with automated SSL and edge caching.

### Option 2: Vercel CLI

Deploy directly from your terminal:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your account
vercel login

# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 🧪 Quality Gates & Verification

All quality gates pass cleanly:

| Gate | Tool | Status |
| --- | --- | --- |
| **Unit & Integration Tests** | Vitest 2.1 | `113 passed (7 test suites)` |
| **Code Quality & Lint** | ESLint 8 / Next Core Web Vitals | `0 errors / 0 warnings` |
| **Type Integrity** | TypeScript 5.7 | `0 errors (tsc --noEmit)` |
| **Production Build** | Next.js 15 (Turbopack/Webpack) | `Optimized static export` |
| **Minimax Invariant** | Exhaustive simulation | `0 losses for Impossible AI` |

---

## 📄 License

MIT License. Feel free to use, modify, and distribute for personal or commercial projects.

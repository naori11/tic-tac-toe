"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className={`relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border/60 bg-card/60 text-muted-foreground opacity-60 shadow-sm transition-all ${className}`}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border/70 bg-card/70 hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-200 text-muted-foreground hover:text-foreground shadow-sm cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}

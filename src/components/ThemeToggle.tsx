"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        applyTheme(saved);
        return;
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      applyTheme(initial);
    } catch (e) {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // ignore
    }
    applyTheme(next);
  };

  return (
    <button
      aria-pressed={theme === "dark"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggle}
      className="relative inline-flex items-center w-14 h-8 rounded-full p-1 transition-colors border"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <Sun className="absolute left-2 w-4 h-4 transition-colors" style={{ color: "var(--foreground)", opacity: 0.75 }} />
      <Moon className="absolute right-2 w-4 h-4 transition-colors" style={{ color: "var(--foreground)", opacity: 0.6 }} />
      <span
        className="absolute left-1 top-1 w-6 h-6 rounded-full shadow-md transform transition-transform"
        style={{
          transform: theme === "dark" ? "translateX(24px)" : "translateX(0px)",
          background: "var(--card-foreground)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        }}
      />
      <span className="sr-only">Theme toggle</span>
    </button>
  );
}

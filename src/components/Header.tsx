"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // read initial theme from document
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "dark" || t === "light") setTheme(t);

    // observe changes to data-theme attribute so the panel updates live
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          const newer = document.documentElement.getAttribute("data-theme");
          if (newer === "dark" || newer === "light") setTheme(newer);
        }
      }
    });
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border shadow-sm transition-colors"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Full-width panel sliding in from the right */}
          <aside
            className={`fixed top-0 right-0 bottom-0 w-full max-w-full p-4 shadow-xl z-50 h-full overflow-y-auto transform transition-transform`}
            style={{
              background: theme === "dark" ? "#0f172a" : "#ffffff",
              color: theme === "dark" ? "#fdfbf7" : "#111827",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">U</div>
                <span className="font-bold">Uni Helper</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center px-3 py-1 rounded-full border shadow-sm transition-colors"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--card-foreground)",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-6">
              <a href="#" className="font-semibold">How it works</a>
              <a href="#" className="font-semibold">Features</a>
              <a href="#" className="font-semibold text-primary">Sign In</a>

              <div className="pt-4">
                <ThemeToggle />
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

"use client";

// ============================================================
// InvoForge — ThemeToggle Component
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      const stored = localStorage.getItem("invoforge_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored ? stored === "dark" : prefersDark;
      setIsDark(dark);
      applyTheme(dark);
    });
  }, []);

  function applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem("invoforge_theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg skeleton" aria-hidden />
    );
  }

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-icon relative"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        style={{
          position: "absolute",
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
          transition: "all 0.3s ease",
        }}
      >
        <Moon size={16} style={{ color: "var(--indigo-400)" }} />
      </span>
      <span
        style={{
          position: "absolute",
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        <Sun size={16} style={{ color: "var(--warning)" }} />
      </span>
    </button>
  );
}
